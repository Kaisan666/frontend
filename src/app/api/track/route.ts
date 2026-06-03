import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { mskDate } from "@/lib/date"

// Расширенный трекинг событий. Принимает разные типы:
//  - "view"          — просмотр карточки товара
//  - "time_on_page"  — время на странице (отправляется при уходе)
//  - "booking_click" — клик по CTA «Забронировать»
//
// Ручка ПУБЛИЧНАЯ (без авторизации) — это трекер. Поэтому форме/размерам/
// диапазонам присланных данных доверять нельзя: без рантайм-валидации любой
// через DevTools зальёт мусор в events_log или накрутит просмотры (что ломает
// сортировку по популярности и дашборд). Zod проверяет payload до записи в БД.

const deviceType = z.enum(["mobile", "tablet", "desktop"])
const sessionId = z.string().min(1).max(64)
const productName = z.string().min(1).max(200)
const category = z.string().min(1).max(50)

const EventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("view"),
    session_id: sessionId,
    device_type: deviceType,
    referrer: z.string().max(2048).default(""),
    applied_filters: z.record(z.string(), z.string()).default({}),
    product: z.object({
      name: productName,
      category,
      price: z.number().finite().min(0).max(1_000_000),
    }),
  }),
  z.object({
    type: z.literal("time_on_page"),
    session_id: sessionId,
    time_on_page_ms: z.number().int().min(0).max(24 * 60 * 60 * 1000), // ≤ 24ч
    product: z.object({
      name: productName,
      category,
    }),
  }),
  z.object({
    type: z.literal("booking_click"),
    session_id: sessionId,
    device_type: deviceType,
    source: z.string().min(1).max(50),
  }),
])

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = EventSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 })
  }
  const body = parsed.data

  try {
    const today = mskDate()

    if (body.type === "view") {
      // Старая RPC для совместимости — продолжает считать суммарные просмотры
      const { error: rpcError } = await supabase.rpc("increment_view", {
        p_name: body.product.name,
        p_category: body.product.category,
        p_price: body.product.price,
        p_date: today,
      })
      if (rpcError) throw rpcError

      // Расширенное событие с контекстом — в новую таблицу events_log
      const { error: eventError } = await supabase.from("events_log").insert({
        type: "view",
        product_name: body.product.name,
        category: body.product.category,
        price: body.product.price,
        session_id: body.session_id,
        device_type: body.device_type,
        referrer: body.referrer || null,
        applied_filters: body.applied_filters,
        date: today,
      })
      // Не падаем, если events_log ещё не создан — старая RPC сработала,
      // базовая статистика идёт. Просто залогируем.
      if (eventError) console.error("events_log insert failed:", eventError.message)
    }

    if (body.type === "time_on_page") {
      const { error } = await supabase.from("events_log").insert({
        type: "time_on_page",
        product_name: body.product.name,
        category: body.product.category,
        session_id: body.session_id,
        time_on_page_ms: body.time_on_page_ms,
        date: today,
      })
      if (error) console.error("events_log time_on_page insert failed:", error.message)
    }

    if (body.type === "booking_click") {
      const { error } = await supabase.from("events_log").insert({
        type: "booking_click",
        session_id: body.session_id,
        device_type: body.device_type,
        source: body.source,
        date: today,
      })
      if (error) console.error("events_log booking_click insert failed:", error.message)
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}
