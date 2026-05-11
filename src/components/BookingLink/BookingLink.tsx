"use client"
import React from "react"
import { getSessionId, getDeviceType, sendEvent } from "@/lib/tracking"

type Props = {
  className?: string
  children: React.ReactNode
  source: string // 'header_desktop' | 'header_mobile' | etc. — где висит этот CTA
}

const TAPLINK_URL = "https://taplink.cc/shengenplus"

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
    <a
      href={TAPLINK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
