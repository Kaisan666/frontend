"use client"
import { Heart } from "lucide-react"
import { useWishlist, toggle, type WishlistItem } from "@/lib/wishlist"
import { sendEvent, getSessionId, getDeviceType } from "@/lib/tracking"
import styles from "./WishlistButton.module.scss"

// Сердечко на карточке: toggle в localStorage-стор. При добавлении шлёт
// событие wishlist_add в трекинг (на удаление — не шлём, по решению).
export const WishlistButton = (item: WishlistItem) => {
  const items = useWishlist()
  const saved = items.some((i) => i.slug === item.slug)

  const onClick = (e: React.MouseEvent) => {
    // карточка живёт в гриде рядом со ссылкой «Подробнее» — глушим всплытие
    e.preventDefault()
    e.stopPropagation()
    const nowSaved = toggle(item)
    if (nowSaved) {
      sendEvent("/api/track", {
        type: "wishlist_add",
        product: { name: item.name, category: item.category },
        session_id: getSessionId(),
        device_type: getDeviceType(),
      })
    }
  }

  return (
    <button
      type="button"
      className={`${styles["wishlist-btn"]} ${saved ? styles["wishlist-btn--active"] : ""}`}
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <Heart size={20} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
    </button>
  )
}
