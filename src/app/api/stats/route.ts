import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mskDate, mskDateDaysAgo } from "@/lib/date"

// Дашборд /stats тянет всё одной ручкой. Принимает ?period=day|week|month
// или явный диапазон ?from=YYYY-MM-DD&to=YYYY-MM-DD.
// По умолчанию — month (последние 30 дней).

type Period = "day" | "week" | "month"

const PERIOD_DAYS: Record<Period, number> = {
  day: 1,
  week: 7,
  month: 30,
}

function periodDays(period: Period | null): number {
  return PERIOD_DAYS[(period ?? "month") as Period] ?? 30
}

function startOf(period: Period | null, from: string | null): string {
  if (from) return from
  return mskDateDaysAgo(periodDays(period) - 1)
}

function today(): string {
  return mskDate()
}

type Row = {
  type: string
  product_name: string | null
  category: string | null
  session_id: string
  time_on_page_ms: number | null
  device_type: string | null
  applied_filters: Record<string, string> | null
  date: string
  created_at: string
  source: string | null
}

// Часовой пояс для heatmap — нужен в виде ISO-локали с явной timezone.
const MSK_PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Moscow",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  weekday: "short",
})

// Возвращает [dayOfWeek 0..6 (0=Mon), hour 0..23] в МСК для ISO-строки
function getMskDayAndHour(iso: string): [number, number] {
  const date = new Date(iso)
  const parts = MSK_PARTS.formatToParts(date)
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon"
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0")
  const dayMap: Record<string, number> = {
    Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
  }
  return [dayMap[weekday] ?? 0, hour]
}

// ---- Агрегации основного периода ----

type Aggregates = ReturnType<typeof aggregate>

function aggregate(rows: Row[]) {
  const views = rows.filter((r) => r.type === "view")
  const timeRows = rows.filter((r) => r.type === "time_on_page" && r.time_on_page_ms != null)
  const bookings = rows.filter((r) => r.type === "booking_click")

  const uniqueSessions = new Set(rows.map((r) => r.session_id)).size

  const avgTimeOnPageSec =
    timeRows.length > 0
      ? Math.round(
          timeRows.reduce((sum, r) => sum + (r.time_on_page_ms ?? 0), 0) /
            timeRows.length /
            1000
        )
      : 0

  const conversionRate =
    uniqueSessions > 0 ? +(bookings.length / uniqueSessions).toFixed(3) : 0

  return {
    views: views.length,
    uniqueSessions,
    avgTimeOnPageSec,
    bookingClicks: bookings.length,
    conversionRate,
    rawViews: views,
    rawTime: timeRows,
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const period = url.searchParams.get("period") as Period | null
  const from = startOf(period, url.searchParams.get("from"))
  const to = url.searchParams.get("to") ?? today()

  // Длина текущего периода в днях — для расчёта предыдущего диапазона
  const days = periodDays(period)
  const prevTo = mskDateDaysAgo(days)
  const prevFrom = mskDateDaysAgo(days * 2 - 1)

  const FIELDS =
    "type, product_name, category, session_id, time_on_page_ms, device_type, applied_filters, date, created_at, source"

  // Три параллельных запроса: текущий период, предыдущий период, исторические сессии (до текущего периода)
  const [current, previous, historical] = await Promise.all([
    supabaseAdmin.from("events_log").select(FIELDS).gte("date", from).lte("date", to),
    supabaseAdmin.from("events_log").select(FIELDS).gte("date", prevFrom).lte("date", prevTo),
    supabaseAdmin.from("events_log").select("session_id").lt("date", from).limit(10000),
  ])

  if (current.error) {
    console.error(current.error)
    return Response.json({ error: current.error.message }, { status: 500 })
  }

  const rows = ((current.data ?? []) as unknown) as Row[]
  const prevRows = ((previous.data ?? []) as unknown) as Row[]
  const histSessions = new Set(
    ((historical.data ?? []) as { session_id: string }[]).map((r) => r.session_id)
  )

  const agg: Aggregates = aggregate(rows)
  const prevAgg: Aggregates = aggregate(prevRows)

  // ---- Просмотры по дням ----
  const viewsByDayMap = new Map<string, number>()
  const startMs = new Date(from).getTime()
  const endMs = new Date(to).getTime()
  for (let t = startMs; t <= endMs; t += 24 * 60 * 60 * 1000) {
    const day = new Date(t).toISOString().split("T")[0]
    viewsByDayMap.set(day, 0)
  }
  agg.rawViews.forEach((r) => {
    viewsByDayMap.set(r.date, (viewsByDayMap.get(r.date) ?? 0) + 1)
  })
  const viewsByDay = Array.from(viewsByDayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, views: count }))

  // ---- Топ-категории ----
  const categoryMap = new Map<string, number>()
  agg.rawViews.forEach((r) => {
    const cat = r.category ?? "other"
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1)
  })
  const topCategories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, views: count }))
    .sort((a, b) => b.views - a.views)

  // ---- Топ и боттом товаров ----
  const productMap = new Map<string, { category: string; views: number }>()
  agg.rawViews.forEach((r) => {
    if (!r.product_name) return
    const existing = productMap.get(r.product_name)
    if (existing) {
      existing.views += 1
    } else {
      productMap.set(r.product_name, { category: r.category ?? "other", views: 1 })
    }
  })
  const productsArr = Array.from(productMap.entries()).map(([name, info]) => ({
    name,
    ...info,
  }))
  const topProducts = [...productsArr].sort((a, b) => b.views - a.views).slice(0, 10)
  const bottomProducts = [...productsArr].sort((a, b) => a.views - b.views).slice(0, 5)

  // ---- Устройства ----
  const deviceMap = new Map<string, number>()
  rows.forEach((r) => {
    if (!r.device_type) return
    deviceMap.set(r.device_type, (deviceMap.get(r.device_type) ?? 0) + 1)
  })
  const devices = {
    mobile: deviceMap.get("mobile") ?? 0,
    tablet: deviceMap.get("tablet") ?? 0,
    desktop: deviceMap.get("desktop") ?? 0,
  }

  // ---- Топ применённых фильтров ----
  const filterMap = new Map<string, number>()
  agg.rawViews.forEach((r) => {
    if (!r.applied_filters || typeof r.applied_filters !== "object") return
    Object.entries(r.applied_filters).forEach(([k, v]) => {
      if (!v) return
      const key = `${k}=${String(v)}`
      filterMap.set(key, (filterMap.get(key) ?? 0) + 1)
    })
  })
  const topFilters = Array.from(filterMap.entries())
    .map(([keyValue, count]) => {
      const [key, value] = keyValue.split("=")
      return { key, value, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ---- Новые vs возвращающиеся сессии ----
  const currentSessions = new Set(rows.map((r) => r.session_id))
  let newSessions = 0
  let returningSessions = 0
  currentSessions.forEach((sid) => {
    if (histSessions.has(sid)) returningSessions++
    else newSessions++
  })
  const newVsReturning = { new: newSessions, returning: returningSessions }

  // ---- Heatmap: день недели × час (МСК) ----
  const heatmap: number[][] = Array.from({ length: 7 }, () => new Array(24).fill(0))
  rows.forEach((r) => {
    if (!r.created_at) return
    const [day, hour] = getMskDayAndHour(r.created_at)
    heatmap[day][hour]++
  })

  // ---- Распределение времени на странице ----
  const timeBuckets = {
    "<10s": 0,
    "10-30s": 0,
    "30-60s": 0,
    "1-3min": 0,
    "3-5min": 0,
    ">5min": 0,
  }
  agg.rawTime.forEach((r) => {
    const sec = (r.time_on_page_ms ?? 0) / 1000
    if (sec < 10) timeBuckets["<10s"]++
    else if (sec < 30) timeBuckets["10-30s"]++
    else if (sec < 60) timeBuckets["30-60s"]++
    else if (sec < 180) timeBuckets["1-3min"]++
    else if (sec < 300) timeBuckets["3-5min"]++
    else timeBuckets[">5min"]++
  })
  const timeDistribution = Object.entries(timeBuckets).map(([bucket, count]) => ({
    bucket,
    count,
  }))

  // ---- Bounce rate: сессии с ровно 1 view-эвентом ----
  const sessionViewCount = new Map<string, number>()
  agg.rawViews.forEach((r) => {
    sessionViewCount.set(r.session_id, (sessionViewCount.get(r.session_id) ?? 0) + 1)
  })
  let bounces = 0
  sessionViewCount.forEach((count) => {
    if (count === 1) bounces++
  })
  const bounceRate =
    sessionViewCount.size > 0 ? +(bounces / sessionViewCount.size).toFixed(3) : 0

  return Response.json({
    period: { from, to },
    totals: {
      views: agg.views,
      uniqueSessions: agg.uniqueSessions,
      avgTimeOnPageSec: agg.avgTimeOnPageSec,
      bookingClicks: agg.bookingClicks,
      conversionRate: agg.conversionRate,
    },
    previous: {
      views: prevAgg.views,
      uniqueSessions: prevAgg.uniqueSessions,
      avgTimeOnPageSec: prevAgg.avgTimeOnPageSec,
      bookingClicks: prevAgg.bookingClicks,
      conversionRate: prevAgg.conversionRate,
    },
    viewsByDay,
    topCategories,
    topProducts,
    bottomProducts,
    devices,
    topFilters,
    newVsReturning,
    heatmap,
    timeDistribution,
    bounceRate,
  })
}
