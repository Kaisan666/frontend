import { supabase } from "@/lib/supabase"

// Дашборд /stats тянет всё одной ручкой. Принимает ?period=day|week|month
// или явный диапазон ?from=YYYY-MM-DD&to=YYYY-MM-DD.
// По умолчанию — month (последние 30 дней).

type Period = "day" | "week" | "month"

const PERIOD_DAYS: Record<Period, number> = {
  day: 1,
  week: 7,
  month: 30,
}

function startOf(period: Period | null, from: string | null): string {
  if (from) return from
  const days = PERIOD_DAYS[(period ?? "month") as Period] ?? 30
  return new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]
}

function today(): string {
  return new Date().toISOString().split("T")[0]
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const period = url.searchParams.get("period") as Period | null
  const from = startOf(period, url.searchParams.get("from"))
  const to = url.searchParams.get("to") ?? today()

  // Тянем все события за период одной выборкой — потом агрегируем в JS,
  // потому что Supabase JS client не очень дружит со сложными group by.
  const { data: events, error } = await supabase
    .from("events_log")
    .select("type, product_name, category, session_id, time_on_page_ms, date, source")
    .gte("date", from)
    .lte("date", to)

  if (error) {
    console.error(error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  type Row = {
    type: string
    product_name: string | null
    category: string | null
    session_id: string
    time_on_page_ms: number | null
    date: string
    source: string | null
  }

  const rows = (events ?? []) as Row[]

  // ---- Агрегаты ----

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

  // Просмотры по дням (для LineChart) — заполняем все даты, даже нулевые,
  // чтобы график не «прыгал» пустотами
  const viewsByDayMap = new Map<string, number>()
  const startMs = new Date(from).getTime()
  const endMs = new Date(to).getTime()
  for (let t = startMs; t <= endMs; t += 24 * 60 * 60 * 1000) {
    const day = new Date(t).toISOString().split("T")[0]
    viewsByDayMap.set(day, 0)
  }
  views.forEach((r) => {
    viewsByDayMap.set(r.date, (viewsByDayMap.get(r.date) ?? 0) + 1)
  })
  const viewsByDay = Array.from(viewsByDayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, views: count }))

  // Топ-категории (для PieChart)
  const categoryMap = new Map<string, number>()
  views.forEach((r) => {
    const cat = r.category ?? "other"
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1)
  })
  const topCategories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, views: count }))
    .sort((a, b) => b.views - a.views)

  // Топ-товары (для BarChart) — top 10
  const productMap = new Map<string, { category: string; views: number }>()
  views.forEach((r) => {
    if (!r.product_name) return
    const existing = productMap.get(r.product_name)
    if (existing) {
      existing.views += 1
    } else {
      productMap.set(r.product_name, { category: r.category ?? "other", views: 1 })
    }
  })
  const topProducts = Array.from(productMap.entries())
    .map(([name, info]) => ({ name, ...info }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  return Response.json({
    period: { from, to },
    totals: {
      views: views.length,
      uniqueSessions,
      avgTimeOnPageSec,
      bookingClicks: bookings.length,
      conversionRate,
    },
    viewsByDay,
    topCategories,
    topProducts,
  })
}
