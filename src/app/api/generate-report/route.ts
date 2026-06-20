import { NextResponse } from "next/server"
import { chatCompletion } from "@/lib/gigachat"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

type Period = "day" | "week" | "month"

type StatsResponse = {
  period: { from: string; to: string }
  totals: {
    views: number
    uniqueSessions: number
    avgTimeOnPageSec: number
    bookingClicks: number
    conversionRate: number
  }
  previous: {
    views: number
    uniqueSessions: number
    avgTimeOnPageSec: number
    bookingClicks: number
    conversionRate: number
  }
  viewsByDay: { date: string; views: number }[]
  topCategories: { category: string; views: number }[]
  topProducts: { name: string; category: string; views: number }[]
  bottomProducts: { name: string; category: string; views: number }[]
  devices: { mobile: number; tablet: number; desktop: number }
  topFilters: { key: string; value: string; count: number }[]
  newVsReturning: { new: number; returning: number }
  bounceRate: number
  wishlistAdds: number
  topWishlisted: { name: string; category: string; views: number }[]
}

const PERIOD_LABEL: Record<Period, string> = {
  day: "сутки",
  week: "неделю",
  month: "месяц",
}

function isPeriod(v: unknown): v is Period {
  return v === "day" || v === "week" || v === "month"
}

// Формируем компактный, но содержательный промпт. GigaChat работает лучше с
// структурированным форматом и явной задачей.
function buildPrompt(stats: StatsResponse, period: Period): string {
  const topCats = stats.topCategories
    .slice(0, 5)
    .map((c) => `${c.category}: ${c.views}`)
    .join(", ")
  const topProds = stats.topProducts
    .slice(0, 5)
    .map((p) => `${p.name} (${p.category}): ${p.views}`)
    .join("\n  - ")
  const bottomProds = stats.bottomProducts
    .slice(0, 5)
    .map((p) => `${p.name} (${p.category}): ${p.views}`)
    .join("\n  - ")
  const filters = stats.topFilters
    .slice(0, 5)
    .map((f) => `${f.key}=${f.value} (${f.count})`)
    .join(", ")
  const topWish = stats.topWishlisted
    .slice(0, 5)
    .map((p) => `${p.name} (${p.category}): ${p.views}`)
    .join("\n  - ")

  const deltaViews =
    stats.previous.views > 0
      ? `${(((stats.totals.views - stats.previous.views) / stats.previous.views) * 100).toFixed(1)}%`
      : "—"

  // Доли по устройствам: модели проще читать «64%», чем сырой счётчик.
  const deviceTotal =
    stats.devices.mobile + stats.devices.tablet + stats.devices.desktop
  const deviceShare = (count: number): string => {
    if (deviceTotal === 0) return "—"
    return `${Math.round((count / deviceTotal) * 100)}%`
  }

  return `Период анализа: ${PERIOD_LABEL[period]} (${stats.period.from} – ${stats.period.to})

Сводные метрики за период:
- Просмотров карточек товаров: ${stats.totals.views}
- Уникальных сессий: ${stats.totals.uniqueSessions}
- Среднее время на странице: ${stats.totals.avgTimeOnPageSec} сек
- Кликов «Забронировать»: ${stats.totals.bookingClicks}
- Конверсия в клик «Забронировать»: ${(stats.totals.conversionRate * 100).toFixed(1)}%
- Bounce rate (просмотр одной страницы): ${(stats.bounceRate * 100).toFixed(1)}%
- Добавлений в избранное (сигнал интереса, заказов на сайте нет): ${stats.wishlistAdds}

Сравнение с предыдущим аналогичным периодом:
- Просмотров было: ${stats.previous.views} (изменение: ${deltaViews})
- Сессий было: ${stats.previous.uniqueSessions}

Распределение по устройствам:
- Мобильные: ${stats.devices.mobile} (${deviceShare(stats.devices.mobile)})
- Планшеты: ${stats.devices.tablet} (${deviceShare(stats.devices.tablet)})
- Десктоп: ${stats.devices.desktop} (${deviceShare(stats.devices.desktop)})

Новые vs возвращающиеся сессии:
- Новые: ${stats.newVsReturning.new}
- Возвращающиеся: ${stats.newVsReturning.returning}

Топ-5 категорий по просмотрам: ${topCats || "нет данных"}

Топ-5 товаров по просмотрам:
  - ${topProds || "нет данных"}

5 товаров с наименьшим интересом:
  - ${bottomProds || "нет данных"}

Топ-5 применённых фильтров: ${filters || "нет данных"}

Топ-5 товаров по добавлениям в избранное:
  - ${topWish || "нет данных"}

Составь развёрнутый аналитический отчёт по этим данным для владельца пивного бара Shengen+. Структура:
# Ключевые выводы
(2-3 абзаца общей картины)

## Что работает
(2-4 конкретных позитивных наблюдения)

## Что требует внимания
(2-4 проблемных места)

## Рекомендации
(3-5 пронумерованных конкретных действий)

## Итог
(1 короткий абзац)

Пиши на понятном русском, без жаргона. Опирайся ТОЛЬКО на переданные данные — ничего не выдумывай. Если данных мало для каких-то выводов — честно так и напиши.`
}

const SYSTEM_PROMPT = `Ты — аналитик веб-сайта пивного бара. Твоя задача — превращать сухие метрики веб-аналитики в понятные текстовые отчёты на русском языке. Пиши простым языком, без воды, но содержательно. Используй markdown: # для заголовка, ## для подзаголовков, **жирный** для акцентов, - для списков, нумерация 1. для рекомендаций.`

export async function POST(request: Request) {
  let body: { period?: unknown }
  try {
    body = (await request.json()) as { period?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const period = isPeriod(body.period) ? body.period : "week"

  // Берём агрегаты из соседней ручки. Это не самый эффективный путь
  // (двойная работа), но он позволяет переиспользовать ровно ту же логику,
  // что видит дашборд — отчёт всегда консистентен с картинкой на экране.
  const statsUrl = new URL(`/api/stats?period=${period}`, request.url)
  const statsResponse = await fetch(statsUrl, {
    headers: {
      // Прокидываем basic-auth заголовок — proxy.ts закрывает /api/stats
      ...(request.headers.get("authorization")
        ? { Authorization: request.headers.get("authorization")! }
        : {}),
    },
  })
  if (!statsResponse.ok) {
    return NextResponse.json(
      { error: "Не удалось получить данные дашборда" },
      { status: 502 }
    )
  }
  const stats = (await statsResponse.json()) as StatsResponse

  // Защитимся от пустых периодов — нет смысла генерить отчёт по нулевым данным.
  if (stats.totals.views === 0 && stats.totals.uniqueSessions === 0) {
    return NextResponse.json(
      { error: "За выбранный период нет данных для анализа" },
      { status: 422 }
    )
  }

  let content: string
  let modelName: string
  try {
    const result = await chatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(stats, period) },
      ],
      maxTokens: 2000,
    })
    content = result.content
    modelName = result.model
  } catch (error) {
    console.error("[generate-report] GigaChat call failed:", error)
    return NextResponse.json(
      { error: "Языковая модель сейчас недоступна. Попробуй позже." },
      { status: 503 }
    )
  }

  // Сохраняем в Supabase. Если запись не пройдёт — отчёт всё равно вернём,
  // не хотим терять результат генерации из-за технической проблемы хранилища.
  const { data: saved, error: saveError } = await supabaseAdmin
    .from("ai_reports")
    .insert({
      period,
      period_from: stats.period.from,
      period_to: stats.period.to,
      content,
      model_name: modelName,
    })
    .select("id, period, period_from, period_to, content, model_name, generated_at")
    .single()

  if (saveError) {
    console.error("[generate-report] ai_reports insert failed:", saveError.message)
    return NextResponse.json({
      id: null,
      period,
      periodFrom: stats.period.from,
      periodTo: stats.period.to,
      content,
      modelName,
      generatedAt: new Date().toISOString(),
      warning: "Отчёт не сохранён в историю",
    })
  }

  return NextResponse.json({
    id: saved.id,
    period: saved.period,
    periodFrom: saved.period_from,
    periodTo: saved.period_to,
    content: saved.content,
    modelName: saved.model_name,
    generatedAt: saved.generated_at,
  })
}
