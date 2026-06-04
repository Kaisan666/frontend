"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import styles from "./CatalogSearch.module.scss"

// Поиск живёт в URL (?q=...), как фильтры и сортировка — шарится ссылкой,
// читается на сервере в catalog/page.tsx (там Fuse.js прогоняет fuzzy-поиск).
// Здесь только инпут: локальный стейт + дебаунс → пишем q в URL.
export const CatalogSearch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")

  // Дебаунс 300мс: не дёргаем навигацию на каждый символ. router.replace
  // (не push) — чтобы посимвольный ввод не плодил записи в history.
  // scroll:false — чтобы страница не прыгала вверх при наборе.
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = value.trim()
      if (trimmed) params.set("q", trimmed)
      else params.delete("q")
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
    // намеренно зависим только от value: дебаунсим ввод, а не реакцию на URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className={styles["search"]}>
      <span className={styles["search__icon"]} aria-hidden>
        <Search size={16} strokeWidth={2} />
      </span>
      <input
        type="text"
        className={styles["search__input"]}
        placeholder="Поиск по названию…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Поиск товаров по названию"
      />
      {value && (
        <button
          type="button"
          className={styles["search__clear"]}
          onClick={() => setValue("")}
          aria-label="Очистить поиск"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
