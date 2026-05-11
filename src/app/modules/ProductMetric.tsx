"use client"
import { useEffect } from "react"
import {
  getSessionId,
  getDeviceType,
  getReferrer,
  getAppliedFilters,
  sendEvent,
} from "@/lib/tracking"

interface Props {
  name: string
  category: string
  price: number
}

export default function ProductMetric({ name, category, price }: Props) {
  useEffect(() => {
    // Снимок начальных данных — фиксируем в момент захода на страницу,
    // чтобы time_on_page и контекст не «съезжали» при дальнейшей навигации.
    const sessionId = getSessionId()
    const deviceType = getDeviceType()
    const referrer = getReferrer()
    const appliedFilters = getAppliedFilters()
    const enteredAt = performance.now()

    // Фиксируем сам факт просмотра — отдельный «view»-эвент
    sendEvent("/api/track", {
      type: "view",
      product: { name, category, price },
      session_id: sessionId,
      device_type: deviceType,
      referrer,
      applied_filters: appliedFilters,
    })

    // По уходу со страницы — отправляем time_on_page отдельным эвентом.
    // visibilitychange срабатывает при сворачивании, переключении вкладок,
    // мобильных свайпах назад — надёжнее чем beforeunload.
    let dispatched = false
    const dispatch = () => {
      if (dispatched) return
      dispatched = true
      const timeOnPageMs = Math.round(performance.now() - enteredAt)
      sendEvent("/api/track", {
        type: "time_on_page",
        product: { name, category },
        session_id: sessionId,
        time_on_page_ms: timeOnPageMs,
      })
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") dispatch()
    }
    window.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("pagehide", dispatch)

    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pagehide", dispatch)
      // На размонтирование тоже — например, при SPA-навигации без unload
      dispatch()
    }
  }, [name, category, price])

  return null
}
