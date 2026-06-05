"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { createPortal } from "react-dom"
import { client } from "@/sanity/lib/client"
import styles from "./CatalogFilters.module.scss"

type Range = { min: number; max: number }
type CatScope = "beer" | "food"

export type CatalogFiltersData = {
  categories: string[]
  styles: string[]
  country: string[]
  foodType: string[]
  abv: Range
  ibu: Range
  pl: Range
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
  onlyCategory?: CatScope
}

type RangeGroup = {
  key: "abv" | "ibu" | "pl" | "price"
  label: string
  minParam: string
  maxParam: string
  step: number
  suffix: string
  bounds: Range
  onlyCategory?: CatScope
}

// onlyCategory помечает измерения, относящиеся к конкретной категории
// (скрытие/очистка/авто-категория выводятся отсюда). Цена — общая (без onlyCategory).
const RANGE_DEFS: {
  key: "abv" | "ibu" | "pl" | "price"
  label: string
  minParam: string
  maxParam: string
  step: number
  suffix: string
  onlyCategory?: CatScope
}[] = [
  { key: "abv", label: "Крепость (ABV)", minParam: "abvMin", maxParam: "abvMax", step: 0.1, suffix: "%", onlyCategory: "beer" },
  { key: "ibu", label: "Горечь (IBU)", minParam: "ibuMin", maxParam: "ibuMax", step: 1, suffix: "", onlyCategory: "beer" },
  { key: "pl", label: "Плотность (°P)", minParam: "plMin", maxParam: "plMax", step: 0.5, suffix: "°P", onlyCategory: "beer" },
  { key: "price", label: "Цена", minParam: "minPrice", maxParam: "maxPrice", step: 10, suffix: " ₽" },
]

const RANGE_CONDITIONS: Record<string, string> = {
  abvMin: "abv >= $abvMin",
  abvMax: "abv <= $abvMax",
  ibuMin: "ibu >= $ibuMin",
  ibuMax: "ibu <= $ibuMax",
  plMin: "pl >= $plMin",
  plMax: "pl <= $plMax",
  minPrice: "price >= $minPrice",
  maxPrice: "price <= $maxPrice",
}

// Дефиниции чип-фильтров: значения тянем из данных каталога, onlyCategory привязывает
// измерение к категории. Единственное место, где объявляется чип-фильтр.
const CHIP_DEFS: {
  key: string
  label: string
  values: (f: CatalogFiltersData) => string[]
  formatValue?: (v: string) => string
  onlyCategory?: CatScope
}[] = [
  { key: "category", label: "Категория", values: (f) => f.categories, formatValue: (v) => categoryLabels[v] ?? v },
  { key: "style", label: "Стиль", values: (f) => f.styles, onlyCategory: "beer" },
  { key: "country", label: "Страна", values: (f) => f.country, onlyCategory: "beer" },
  { key: "foodType", label: "Тип", values: (f) => f.foodType, onlyCategory: "food" },
]

function buildChipGroups(f: CatalogFiltersData): ChipGroup[] {
  return CHIP_DEFS.map((d) => ({
    key: d.key,
    label: d.label,
    values: d.values(f),
    formatValue: d.formatValue,
    onlyCategory: d.onlyCategory,
  }))
}

// Диапазон не нужен, если значение одно (min == max) — отфильтровываем.
function buildRangeGroups(f: CatalogFiltersData): RangeGroup[] {
  return RANGE_DEFS.map((d) => ({ ...d, bounds: f[d.key] })).filter((g) => g.bounds.max > g.bounds.min)
}

// ---- Контекстные фильтры по категории ----
// Измерения с onlyCategory (CHIP_DEFS/RANGE_DEFS) относятся к своей категории —
// единственный источник правды. Карта «URL-параметр → категория» выводится из
// дефиниций; добавил новый onlyCategory-фильтр — скрытие/очистка/авто-категория
// подхватываются сами.
const SCOPED_PARAMS: { param: string; cat: CatScope }[] = [
  ...CHIP_DEFS.filter((d) => d.onlyCategory).map((d) => ({ param: d.key, cat: d.onlyCategory as CatScope })),
  ...RANGE_DEFS.filter((d) => d.onlyCategory).flatMap((d) => [
    { param: d.minParam, cat: d.onlyCategory as CatScope },
    { param: d.maxParam, cat: d.onlyCategory as CatScope },
  ]),
]

// Группа видна, если у неё нет привязки, либо категория не выбрана, либо совпадает.
function visibleChipGroups(groups: ChipGroup[], cat: string | null | undefined): ChipGroup[] {
  return groups.filter((g) => !g.onlyCategory || !cat || cat === g.onlyCategory)
}
function visibleRangeGroups(groups: RangeGroup[], cat: string | null | undefined): RangeGroup[] {
  return groups.filter((g) => !g.onlyCategory || !cat || cat === g.onlyCategory)
}

// Согласует параметры: выбрана категория → сносим параметры фильтров ЧУЖИХ
// категорий; категория не выбрана, но есть привязанный фильтр → ставим его категорию.
// Мутирует переданный URLSearchParams.
function applyCategoryRules(params: URLSearchParams) {
  const cat = params.get("category")
  if (cat) {
    SCOPED_PARAMS.forEach(({ param, cat: scope }) => {
      if (scope !== cat) params.delete(param)
    })
  } else {
    const hit = SCOPED_PARAMS.find(({ param }) => params.has(param))
    if (hit) params.set("category", hit.cat)
  }
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
    } else if (k === "foodType") {
      conditions.push(`foodType->title == $foodType`)
      params.foodType = v
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

// Сколько значений показывать в группе до сворачивания. Кнопка «Показать ещё»
// появляется только если значений больше — иначе список как был.
const CHIP_VISIBLE_LIMIT = 8

function ChipGroupItem({
  group,
  isActive,
  onToggle,
}: {
  group: ChipGroup
  isActive: (key: string, value: string) => boolean
  onToggle: (key: string, value: string) => void
}) {
  const overflow = group.values.length - CHIP_VISIBLE_LIMIT
  // Если активное значение спрятано под лимитом — сразу разворачиваем,
  // чтобы выбранный фильтр не «исчезал» (например, при заходе по ссылке).
  const hasHiddenActive =
    overflow > 0 && group.values.slice(CHIP_VISIBLE_LIMIT).some((v) => isActive(group.key, v))
  const [expanded, setExpanded] = useState(hasHiddenActive)

  const shown = expanded ? group.values : group.values.slice(0, CHIP_VISIBLE_LIMIT)

  return (
    <div className={styles["filters__group"]}>
      <h3 className={styles["filters__title"]}>{group.label}</h3>
      <div className={styles["filters__tags"]}>
        {shown.map((value) => (
          <button
            key={value}
            onClick={() => onToggle(group.key, value)}
            className={`${styles["filters__tag"]} ${isActive(group.key, value) ? styles["filters__tag--active"] : ""}`}
          >
            {group.formatValue ? group.formatValue(value) : value}
          </button>
        ))}
      </div>
      {overflow > 0 && (
        <button
          type="button"
          className={styles["filters__more"]}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Свернуть" : `Показать ещё ${overflow}`}
        </button>
      )}
    </div>
  )
}

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
          <ChipGroupItem key={group.key} group={group} isActive={isActive} onToggle={onToggle} />
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
    applyCategoryRules(params)
    router.push(`${pathname}?${params.toString()}`)
  }

  const applyRanges = () => {
    const params = new URLSearchParams(searchParams.toString())
    rangeGroups.forEach((g) => applyRange(params, g, rangeDraft[g.minParam], rangeDraft[g.maxParam]))
    applyCategoryRules(params)
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
      <ChipGroups
        groups={visibleChipGroups(chipGroups, searchParams.get("category"))}
        isActive={(k, v) => searchParams.get(k) === v}
        onToggle={toggleChip}
      />

      {visibleRangeGroups(rangeGroups, searchParams.get("category")).map((g) => (
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
    const raw: Record<string, string> =
      pending[key] === value
        ? Object.fromEntries(Object.entries(pending).filter(([k]) => k !== key))
        : { ...pending, [key]: value }
    // те же контекстные правила, что и на десктопе (через URLSearchParams)
    const params = new URLSearchParams(raw)
    applyCategoryRules(params)
    const next = Object.fromEntries(params.entries())
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
    applyCategoryRules(params)
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
                <ChipGroups
                  groups={visibleChipGroups(chipGroups, pending["category"])}
                  isActive={(k, v) => pending[k] === v}
                  onToggle={togglePendingChip}
                />
                {visibleRangeGroups(rangeGroups, pending["category"]).map((g) => (
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
