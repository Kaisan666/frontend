"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FILTER_CONTEXT_KEY } from "@/lib/tracking"

/**
 * Сидит на /catalog и записывает в sessionStorage текущие фильтры (URL search params).
 * Когда юзер кликает на товар и переходит на /products/<slug>, ProductMetric читает
 * этот контекст и кладёт в applied_filters трекинг-эвента — мы понимаем, какие
 * фильтры привели к просмотру товара.
 *
 * Если юзер открыл /catalog без фильтров — стирает прошлый контекст, чтобы не
 * наследовать его в следующую сессию навигации.
 */
export function FilterContextCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const filters: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      filters[key] = value
    })

    try {
      if (Object.keys(filters).length === 0) {
        window.sessionStorage.removeItem(FILTER_CONTEXT_KEY)
        return
      }
      window.sessionStorage.setItem(
        FILTER_CONTEXT_KEY,
        JSON.stringify({ filters, timestamp: Date.now() })
      )
    } catch {
      // sessionStorage недоступен в приватном режиме — молча игнорируем,
      // applied_filters останется пустым (как было раньше).
    }
  }, [searchParams])

  return null
}
