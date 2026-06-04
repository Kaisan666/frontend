import { useSyncExternalStore } from "react"

// Клиентский стор избранного поверх localStorage. Храним СНИМОК товара
// (поля для рендера карточки), чтобы страница «Избранное» рисовалась без
// доп. запроса. Идентификатор — slug. Синхронизация компонентов и вкладок
// через useSyncExternalStore + событие storage (паттерн как у AgeGate).

export type WishlistItem = {
  slug: string
  name: string
  price: number
  category: "beer" | "food" | "other"
  imageUrl?: string
  country?: string
  unit?: "мл" | "гр" | "шт"
  quantity?: number
}

const KEY = "shengen_wishlist"
const EMPTY: WishlistItem[] = [] // стабильная ссылка для getServerSnapshot

function load(): WishlistItem[] {
  if (typeof window === "undefined") return EMPTY
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as WishlistItem[]) : []
  } catch {
    // localStorage недоступен (приватный режим) / битый JSON
    return []
  }
}

let items: WishlistItem[] = load()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // тихо игнорируем — избранное не критично
  }
}

// Синхронизация между вкладками
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      items = load()
      emit()
    }
  })
}

export function isSaved(slug: string): boolean {
  return items.some((i) => i.slug === slug)
}

/** Переключает товар в избранном. Возвращает true, если товар ТЕПЕРЬ в избранном. */
export function toggle(item: WishlistItem): boolean {
  if (isSaved(item.slug)) {
    items = items.filter((i) => i.slug !== item.slug)
    persist()
    emit()
    return false
  }
  items = [item, ...items]
  persist()
  emit()
  return true
}

export function remove(slug: string): void {
  items = items.filter((i) => i.slug !== slug)
  persist()
  emit()
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function getSnapshot(): WishlistItem[] {
  return items
}

function getServerSnapshot(): WishlistItem[] {
  return EMPTY
}

/** Реактивный список избранного. На сервере/при гидрации — пустой (затем досинхронится). */
export function useWishlist(): WishlistItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
