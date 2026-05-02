"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { createPortal } from "react-dom"
import { client } from "@/sanity/lib/client"
import styles from "./CatalogFilters.module.scss"

type Filters = {
  categories: string[]
  styles: string[]
  country: string[]
  abv: number[]
  ibu: number[]
}

const categoryLabels: Record<string, string> = {
  beer: "Пиво",
  food: "Еда",
  other: "Другое",
}

type FilterGroup = {
  key: string
  label: string
  values: (string | number)[]
  formatValue?: (v: string | number) => string
}

async function fetchCount(pending: Record<string, string>): Promise<number> {
  const conditions: string[] = ['_type == "product"']
  const params: Record<string, string> = {}

  for (const [k, v] of Object.entries(pending)) {
    if (!v) continue
    if (k === "style") {
      // style может содержать несколько значений через запятую/слэш ("Эль, Ламбик")
      // match ищет токен как отдельное слово, без чувствительности к регистру
      conditions.push(`style match $style`)
      params.style = v
    } else {
      conditions.push(`${k} == $${k}`)
      params[k] = v
    }
  }

  const query = `count(*[${conditions.join(' && ')}])`
  return client.fetch<number>(query, params)
}

export const CatalogFilters = ({ filters }: { filters: Filters }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [pending, setPending] = useState<Record<string, string>>({})
  const [foundCount, setFoundCount] = useState<number | null>(null)

  const groups: FilterGroup[] = [
    {
      key: "category",
      label: "Категория",
      values: filters.categories,
      formatValue: v => categoryLabels[String(v)] ?? String(v),
    },
    { key: "style", label: "Стиль", values: filters.styles },
    { key: "country", label: "Страна", values: filters.country },
    {
      key: "abv",
      label: "Крепость (ABV)",
      values: filters.abv,
      formatValue: v => `${v}%`,
    },
    { key: "ibu", label: "Горечь (IBU)", values: filters.ibu },
  ]

  // Desktop: сразу пишем в URL
  const toggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const resetAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    groups.forEach(g => params.delete(g.key))
    router.push(`${pathname}?${params.toString()}`)
  }

  // Drawer
  const openDrawer = async () => {
    const initial: Record<string, string> = {}
    groups.forEach(g => {
      const val = searchParams.get(g.key)
      if (val) initial[g.key] = val
    })
    setPending(initial)
    setIsDrawerOpen(true)
    const count = await fetchCount(initial)
    setFoundCount(count)
  }

  const togglePending = async (key: string, value: string) => {
    const newPending = pending[key] === value
      ? Object.fromEntries(Object.entries(pending).filter(([k]) => k !== key))
      : { ...pending, [key]: value }

    setPending(newPending)

    const count = await fetchCount(newPending)
    setFoundCount(count)
  }

  const resetPending = async () => {
    setPending({})
    const count = await fetchCount({})
    setFoundCount(count)
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    groups.forEach(g => params.delete(g.key))
    Object.entries(pending).forEach(([k, v]) => params.set(k, v))
    router.push(`${pathname}?${params.toString()}`)
    setIsDrawerOpen(false)
  }

  const hasActive = groups.some(g => searchParams.has(g.key))
  const activeCount = groups.filter(g => searchParams.has(g.key)).length
  const hasPending = Object.keys(pending).length > 0

  const renderGroups = (
    isActive: (key: string, value: string) => boolean,
    onToggle: (key: string, value: string) => void
  ) =>
    groups.map(group => {
      if (group.values.length === 0) return null
      return (
        <div key={group.key} className={styles["filters__group"]}>
          <h3 className={styles["filters__title"]}>{group.label}</h3>
          <div className={styles["filters__tags"]}>
            {group.values.map(value => {
              const strValue = String(value)
              return (
                <button
                  key={strValue}
                  onClick={() => onToggle(group.key, strValue)}
                  className={`${styles["filters__tag"]} ${isActive(group.key, strValue) ? styles["filters__tag--active"] : ""}`}
                >
                  {group.formatValue ? group.formatValue(value) : strValue}
                </button>
              )
            })}
          </div>
        </div>
      )
    })

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={styles["filters"]}>
        {renderGroups(
          (key, val) => searchParams.get(key) === val,
          toggle
        )}
        {hasActive && (
          <button className={styles["filters__reset"]} onClick={resetAll}>
            Сбросить фильтры
          </button>
        )}
      </aside>

      {/* Mobile trigger */}
      <div className={styles["filters-mobile"]}>
        <button
          className={`${styles["filters-mobile__btn"]} ${hasActive ? styles["filters-mobile__btn--active"] : ""}`}
          onClick={openDrawer}
        >
          Фильтры {hasActive && `(${activeCount})`}
        </button>

        {isDrawerOpen && createPortal(
          <div className={styles["drawer"]}>
            <div className={styles["drawer__overlay"]} onClick={() => setIsDrawerOpen(false)} />
            <div className={styles["drawer__panel"]}>
              <div className={styles["drawer__header"]}>
                <span className={styles["drawer__title"]}>Фильтры</span>
                <button className={styles["drawer__close"]} onClick={() => setIsDrawerOpen(false)}>
                  ✕
                </button>
              </div>
              <div className={styles["drawer__content"]}>
                {renderGroups(
                  (key, val) => pending[key] === val,
                  togglePending
                )}
              </div>
              <div className={styles["drawer__footer"]}>
                {hasPending && (
                  <button className={styles["filters__reset"]} onClick={resetPending}>
                    Сбросить фильтры
                  </button>
                )}
                <button className={styles["drawer__apply"]} onClick={applyFilters}>
                  {foundCount !== null
                    ? `Показать ${foundCount} товаров`
                    : "Применить"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  )
}
