"use client"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { PREV_PATH_KEY } from "@/lib/tracking"

// Запоминает предыдущий путь при SPA-навигации, чтобы трекинг видел
// внутренний referrer (document.referrer для SPA не обновляется).
//
// Запись в sessionStorage делаем в cleanup-фазе useEffect: при смене
// pathname React сначала отрабатывает cleanup со СТАРЫМ значением,
// а уже потом монтирует новое поддерево (включая ProductMetric, который
// этот sessionStorage читает).
export default function PathTracker() {
  const pathname = usePathname()

  useEffect(() => {
    return () => {
      try {
        sessionStorage.setItem(PREV_PATH_KEY, pathname)
      } catch {
        // приватный режим / отключённые cookies
      }
    }
  }, [pathname])

  return null
}
