import { supabase } from "@/lib/supabase"

// Расширенный трекинг событий. Принимает разные типы:
//  - "view"          — просмотр карточки товара
//  - "time_on_page"  — время на странице (отправляется при уходе)
//  - "booking_click" — клик по CTA «Забронировать»

type ViewPayload = {
  type: "view"
  product: { name: string; category: string; price: number }
  session_id: string
  device_type: string
  referrer: string
  applied_filters: Record<string, string>
}

type TimeOnPagePayload = {
  type: "time_on_page"
  product: { name: string; category: string }
  session_id: string
  time_on_page_ms: number
}

type BookingClickPayload = {
  type: "booking_click"
  session_id: string
  device_type: string
  source: string // 'header_desktop' | 'header_mobile' | 'event_button' | etc.
}

type EventPayload = ViewPayload | TimeOnPagePayload | BookingClickPayload

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EventPayload
    const today = new Date().toISOString().split("T")[0]

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
