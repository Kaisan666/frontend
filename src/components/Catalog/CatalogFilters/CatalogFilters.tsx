"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { createPortal } from "react-dom"
import { client } from "@/sanity/lib/client"
import styles from "./CatalogFilters.module.scss"

type Range = { min: number; max: number }

export type CatalogFiltersData = {
  categories: string[]
  styles: string[]
  country: string[]
  abv: Range
  ibu: Range
  price: Range
}

const categoryLabels: Record<string, string> = {
  beer: "Пиво",
  food: "Еда",
  other: "Другое",
}

type ChipGroup = {
  key: string
  label: string
  values: string[]
  formatValue?: (v: string) => string
}

type RangeGroup = {
  key: "abv" | "ibu" | "price"
  label: string
  minParam: string
  maxParam: string
  step: number
  suffix: string
  bounds: Range
}

const RANGE_DEFS = [
  { key: "abv", label: "Крепость (ABV)", minParam: "abvMin", maxParam: "abvMax", step: 0.1, suffix: "%" },
  { key: "ibu", label: "Горечь (IBU)", minParam: "ibuMin", maxParam: "ibuMax", step: 1, suffix: "" },
  { key: "price", label: "Цена", minParam: "minPrice", maxParam: "maxPrice", step: 10, suffix: " ₽" },
] as const

const RANGE_CONDITIONS: Record<string, string> = {
  abvMin: "abv >= $abvMin",
  abvMax: "abv <= $abvMax",
  ibuMin: "ibu >= $ibuMin",
  ibuMax: "ibu <= $ibuMax",
  minPrice: "price >= $minPrice",
  maxPrice: "price <= $maxPrice",
}

function buildChipGroups(f: CatalogFiltersData): ChipGroup[] {
  return [
    { key: "category", label: "Категория", values: f.categories, formatValue: (v) => categoryLabels[v] ?? v },
    { key: "style", label: "Стиль", values: f.styles },
    { key: "country", label: "Страна", values: f.country },
  ]
}

// Диапазон не нужен, если значение одно (min == max) — отфильтровываем.
function buildRangeGroups(f: CatalogFiltersData): RangeGroup[] {
  return RANGE_DEFS.map((d) => ({ ...d, bounds: f[d.key] })).filter((g) => g.bounds.max > g.bounds.min)
}

const normalizeRangeValue = (s?: string): string | null => {
  const t = (s ?? "").trim()
  if (t === "" || Number.isNaN(Number(t))) return null
  return String(Number(t))
}

// Пустой/невалидный инпут = нет ограничения с этой стороны. Любое число — как есть.
function applyRange(params: URLSearchParams, g: RangeGroup, minStr?: string, maxStr?: string) {
  const setOrDelete = (param: string, str?: string) => {
    const norm = normalizeRangeValue(str)
    if (norm === null) params.delete(param)
    else params.set(param, norm)
  }
  setOrDelete(g.minParam, minStr)
  setOrDelete(g.maxParam, maxStr)
}

async function fetchCount(pending: Record<string, string>): Promise<number> {
  const conditions: string[] = ['_type == "product"']
  const params: Record<string, string | number> = {}

  for (const [k, v] of Object.entries(pending)) {
    if (!v) continue
    if (k === "style") {
      conditions.push(`$style in style[]->title`)
      params.style = v
    } else if (RANGE_CONDITIONS[k]) {
      conditions.push(RANGE_CONDITIONS[k])
      params[k] = Number(v)
    } else {
      conditions.push(`${k} == $${k}`)
      params[k] = v
    }
  }

  const query = `count(*[${conditions.join(" && ")}])`
  return client.fetch<number>(query, params)
}

// ---- Презентационные части (общие для десктопа и дровера) ----

function ChipGroups({
  groups,
  isActive,
  onToggle,
}: {
  groups: ChipGroup[]
  isActive: (key: string, value: string) => boolean
  onToggle: (key: string, value: string) => void
}) {
  return (
    <>
      {groups.map((group) =>
        group.values.length === 0 ? null : (
          <div key={group.key} className={styles["filters__group"]}>
            <h3 className={styles["filters__title"]}>{group.label}</h3>
            <div className={styles["filters__tags"]}>
              {group.values.map((value) => (
                <button
                  key={value}
                  onClick={() => onToggle(group.key, value)}
                  className={`${styles["filters__tag"]} ${isActive(group.key, value) ? styles["filters__tag--active"] : ""}`}
                >
                  {group.formatValue ? group.formatValue(value) : value}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </>
  )
}

// Диапазон двумя контролируемыми инпутами «от — до». Плейсхолдеры — границы из товаров.
function RangeFilter({
  group,
  minStr,
  maxStr,
  onMin,
  onMax,
  onBlur,
}: {
  group: RangeGroup
  minStr: string
  maxStr: string
  onMin: (v: string) => void
  onMax: (v: string) => void
  onBlur?: () => void
}) {
  return (
    <div className={styles["filters__group"]}>
      <h3 className={styles["filters__title"]}>{group.label}</h3>
      <div className={styles["range"]}>
        <input
          type="number"
          inputMode="decimal"
          step={group.step}
          className={styles["range__input"]}
          placeholder={`${group.bounds.min}${group.suffix}`}
          value={minStr}
          onChange={(e) => onMin(e.target.value)}
          onBlur={onBlur}
          aria-label={`${group.label}: от`}
        />
        <span className={styles["range__dash"]}>—</span>
        <input
          type="number"
          inputMode="decimal"
          step={group.step}
          className={styles["range__input"]}
          placeholder={`${group.bounds.max}${group.suffix}`}
          value={maxStr}
          onChange={(e) => onMax(e.target.value)}
          onBlur={onBlur}
          aria-label={`${group.label}: до`}
        />
      </div>
    </div>
  )
}

// ===== Десктопный сайдбар =====
export const CatalogFilters = ({ filters }: { filters: CatalogFiltersData }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const chipGroups = buildChipGroups(filters)
  const rangeGroups = buildRangeGroups(filters)
  const allParamKeys = [
    ...chipGroups.map((g) => g.key),
    ...rangeGroups.flatMap((g) => [g.minParam, g.maxParam]),
  ]

  const [rangeDraft, setRangeDraft] = useState<Record<string, string>>(() => {
    const d: Record<string, string> = {}
    for (const def of RANGE_DEFS) {
      const mn = searchParams.get(def.minParam)
      if (mn) d[def.minParam] = mn
      const mx = searchParams.get(def.maxParam)
      if (mx) d[def.maxParam] = mx
    }
    return d
  })

  const toggleChip = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) params.delete(key)
    else params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const applyRanges = () => {
    const params = new URLSearchParams(searchParams.toString())
    rangeGroups.forEach((g) => applyRange(params, g, rangeDraft[g.minParam], rangeDraft[g.maxParam]))
    router.push(`${pathname}?${params.toString()}`)
  }

  const resetAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    allParamKeys.forEach((k) => params.delete(k))
    setRangeDraft({})
    router.push(`${pathname}?${params.toString()}`)
  }

  // Кнопку «Применить» показываем, только когда введённое отличается от применённого.
  const rangesDirty = rangeGroups.some((g) =>
    [g.minParam, g.maxParam].some((p) => normalizeRangeValue(rangeDraft[p]) !== searchParams.get(p))
  )
  const hasActive = allParamKeys.some((k) => searchParams.has(k))

  return (
    <aside className={styles["filters"]}>
      <ChipGroups groups={chipGroups} isActive={(k, v) => searchParams.get(k) === v} onToggle={toggleChip} />

      {rangeGroups.map((g) => (
        <RangeFilter
          key={g.key}
          group={g}
          minStr={rangeDraft[g.minParam] ?? ""}
          maxStr={rangeDraft[g.maxParam] ?? ""}
          onMin={(v) => setRangeDraft((p) => ({ ...p, [g.minParam]: v }))}
          onMax={(v) => setRangeDraft((p) => ({ ...p, [g.maxParam]: v }))}
        />
      ))}

      <div className={styles["filters__actions"]}>
        {rangesDirty && (
          <button className={styles["filters__apply"]} onClick={applyRanges}>
            Применить
          </button>
        )}
        {hasActive && (
          <button className={styles["filters__reset"]} onClick={resetAll}>
            Сбросить фильтры
          </button>
        )}
      </div>
    </aside>
  )
}

// ===== Мобильная кнопка + дровер =====
export const CatalogFiltersMobile = ({ filters }: { filters: CatalogFiltersData }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const chipGroups = buildChipGroups(filters)
  const rangeGroups = buildRangeGroups(filters)
  const chipKeys = chipGroups.map((g) => g.key)
  const allParamKeys = [...chipKeys, ...rangeGroups.flatMap((g) => [g.minParam, g.maxParam])]

  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState<Record<string, string>>({})
  const [foundCount, setFoundCount] = useState<number | null>(null)

  const open = async () => {
    const initial: Record<string, string> = {}
    allParamKeys.forEach((k) => {
      const v = searchParams.get(k)
      if (v) initial[k] = v
    })
    setPending(initial)
    setIsOpen(true)
    setFoundCount(await fetchCount(initial))
  }

  const togglePendingChip = async (key: string, value: string) => {
    const next =
      pending[key] === value
        ? Object.fromEntries(Object.entries(pending).filter(([k]) => k !== key))
        : { ...pending, [key]: value }
    setPending(next)
    setFoundCount(await fetchCount(next))
  }

  const setRange = (param: string, v: string) => setPending((p) => ({ ...p, [param]: v }))
  const recount = async () => setFoundCount(await fetchCount(pending))

  const reset = async () => {
    setPending({})
    setFoundCount(await fetchCount({}))
  }

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString())
    allParamKeys.forEach((k) => params.delete(k))
    chipKeys.forEach((k) => {
      if (pending[k]) params.set(k, pending[k])
    })
    rangeGroups.forEach((g) => applyRange(params, g, pending[g.minParam], pending[g.maxParam]))
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const hasActive = allParamKeys.some((k) => searchParams.has(k))
  const activeCount =
    chipKeys.filter((k) => searchParams.has(k)).length +
    rangeGroups.filter((g) => searchParams.has(g.minParam) || searchParams.has(g.maxParam)).length
  const hasPending = Object.keys(pending).some((k) => pending[k] !== "")

  return (
    <div className={styles["filters-mobile"]}>
      <button
        className={`${styles["filters-mobile__btn"]} ${hasActive ? styles["filters-mobile__btn--active"] : ""}`}
        onClick={open}
      >
        Фильтры {hasActive && `(${activeCount})`}
      </button>

      {isOpen &&
        createPortal(
          <div className={styles["drawer"]}>
            <div className={styles["drawer__overlay"]} onClick={() => setIsOpen(false)} />
            <div className={styles["drawer__panel"]}>
              <div className={styles["drawer__header"]}>
                <span className={styles["drawer__title"]}>Фильтры</span>
                <button className={styles["drawer__close"]} onClick={() => setIsOpen(false)}>
                  ✕
                </button>
              </div>
              <div className={styles["drawer__content"]}>
                <ChipGroups groups={chipGroups} isActive={(k, v) => pending[k] === v} onToggle={togglePendingChip} />
                {rangeGroups.map((g) => (
                  <RangeFilter
                    key={g.key}
                    group={g}
                    minStr={pending[g.minParam] ?? ""}
                    maxStr={pending[g.maxParam] ?? ""}
                    onMin={(v) => setRange(g.minParam, v)}
                    onMax={(v) => setRange(g.maxParam, v)}
                    onBlur={recount}
                  />
                ))}
              </div>
              <div className={styles["drawer__footer"]}>
                {hasPending && (
                  <button className={styles["filters__reset"]} onClick={reset}>
                    Сбросить фильтры
                  </button>
                )}
                <button className={styles["drawer__apply"]} onClick={apply}>
                  {foundCount !== null ? `Показать ${foundCount} товаров` : "Применить"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
