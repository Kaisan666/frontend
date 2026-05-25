// Утилиты для расширенного трекинга поведения пользователей.
// Все функции безопасны для SSR — проверяют typeof window перед обращением.

const SESSION_KEY = "shengen_session_id"
export const PREV_PATH_KEY = "shengen_prev_path"

/**
 * Генерирует UUID v4. crypto.randomUUID() есть только в secure context
 * (HTTPS или localhost), поэтому на dev-сервере по IP/HTTP падает.
 * Фолбэк через crypto.getRandomValues — работает везде, где есть Web Crypto.
 */
function randomUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant RFC4122
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }
  // Последний рубеж — древние браузеры без Web Crypto. Для session-id хватит.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

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

    const fresh = randomUuid()
    window.localStorage.setItem(SESSION_KEY, fresh)
    return fresh
  } catch {
    // localStorage может бросать в приватном режиме / при отключённых cookies
    return randomUuid()
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
