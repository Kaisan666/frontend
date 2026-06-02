"use client"
import React from "react"
import Link from "next/link"
import { getSessionId, getDeviceType, sendEvent } from "@/lib/tracking"

type Props = {
  className?: string
  children: React.ReactNode
  source: string // 'header_desktop' | 'header_mobile' | etc. — где висит этот CTA
}

// «Забронировать» ведёт на страницу контактов (адрес, телефон, карты) — taplink
// убрали как лишнюю прослойку. Клик всё так же фиксируем как booking_click,
// чтобы метрика конверсии на дашборде сохранила смысл.
export const BookingLink = ({ className, children, source }: Props) => {
  const handleClick = () => {
    sendEvent("/api/track", {
      type: "booking_click",
      session_id: getSessionId(),
      device_type: getDeviceType(),
      source,
    })
  }

  return (
    <Link href="/contacts" className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
