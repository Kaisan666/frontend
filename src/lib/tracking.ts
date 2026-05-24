// Утилиты для расширенного трекинга поведения пользователей.
// Все функции безопасны для SSR — проверяют typeof window перед обращением.

const SESSION_KEY = "shengen_session_id"
export const PREV_PATH_KEY = "shengen_prev_path"

/**
 * Возвращает уникальный идентификатор сессии для текущего браузера.
 * Хранится в localStorage и переживает перезагрузки страницы.
 * Если localStorage недоступен (SSR / приватный режим) — отдаёт случайный uuid,
 * который живёт только в текущей загрузке.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  try {
    const existing = window.localStorage.getItem(SESSION_KEY)
    if (existing) return existing

    const fresh = crypto.randomUUID()
    window.localStorage.setItem(SESSION_KEY, fresh)
    return fresh
  } catch {
    // localStorage может бросать в приватном режиме / при отключённых cookies
    return crypto.randomUUID()
  }
}

export type DeviceType = "mobile" | "tablet" | "desktop"

/**
 * Определяет тип устройства по user-agent.
 * Простая эвристика — для статистики сойдёт, для роутинга — нет.
 */
export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop"

  const ua = window.navigator.userAgent.toLowerCase()

  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/.test(ua)) {
    return "tablet"
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua)) {
    return "mobile"
  }
  return "desktop"
}

/**
 * Возвращает источник перехода для текущей страницы.
 *
 * Приоритет — внутренний предыдущий путь из sessionStorage (его пишет
 * PathTracker при SPA-навигации), потому что document.referrer для
 * client-side переходов в Next.js не обновляется и хранит только URL
 * самой первой загрузки.
 *
 * Фолбэк — document.referrer для случая прямого захода на страницу
 * товара (например, по ссылке из соцсетей).
 */
export function getReferrer(): string {
  if (typeof window === "undefined") return ""

  try {
    const prev = window.sessionStorage.getItem(PREV_PATH_KEY)
    if (prev) return prev
  } catch {
    // sessionStorage недоступен — идём к document.referrer
  }

  return document.referrer || ""
}

/**
 * Извлекает применённые фильтры из URL search params.
 * Возвращает объект с теми ключами, что есть в текущем URL.
 */
export function getAppliedFilters(): Record<string, string> {
  if (typeof window === "undefined") return {}

  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/**
 * Отправляет событие на сервер. Использует sendBeacon если доступен —
 * это надёжнее для unload-событий (страница уже закрывается, обычный fetch
 * может не успеть). Фолбэк на fetch с keepalive.
 */
export function sendEvent(url: string, data: unknown): void {
  if (typeof window === "undefined") return

  const payload = JSON.stringify(data)

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" })
    navigator.sendBeacon(url, blob)
    return
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Тихо глотаем — это аналитика, не критично
  })
}
