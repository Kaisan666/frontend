import { Suspense } from "react"
import { unstable_cache } from "next/cache"
import Fuse from "fuse.js"
import { CatalogFilters, CatalogFiltersMobile } from "@/components/Catalog/CatalogFilters"
import { CatalogGrid } from "@/components/Catalog/CatalogGrid"
import { CatalogSort } from "@/components/Catalog/CatalogSort"
import { CatalogSearch } from "@/components/Catalog/CatalogSearch"
import { FilterContextCapture } from "@/components/FilterContextCapture"
import styles from "./catalog.module.scss"
import { client } from "@/sanity/lib/client"
import { supabase } from "@/lib/supabase"
import { Product } from "@/types/product"

// Популярность за 30 дней через агрегирующую RPC (см. tasks/sql/popular_products.sql).
// Возвращаем плоский массив (Map не сериализуется кешем), Map строим на месте.
async function fetchPopularityRows(): Promise<{ product_name: string; views: number }[]> {
  const { data, error } = await supabase.rpc("popular_products", { days: 30 })
  if (error) {
    console.error("[catalog] popular_products RPC failed:", error.message)
    return []
  }
  return (data ?? []) as { product_name: string; views: number }[]
}

// В проде кешируем на 10 минут — популярность меняется медленно, незачем дёргать
// БД на каждый заход. В деве кеш отключён: всегда свежие данные, чтобы не воевать
// с протухшим кешем при разработке.
const getPopularityRows =
  process.env.NODE_ENV === "production"
    ? unstable_cache(fetchPopularityRows, ["catalog-popularity-30d"], { revalidate: 600 })
    : fetchPopularityRows

type SearchParams = {
  style?: string
  country?: string
  category?: string
  abvMin?: string
  abvMax?: string
  ibuMin?: string
  ibuMax?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  q?: string
}

// Границы числовых фильтров (для слайдеров-диапазонов).
function numBounds(vals: number[], roundTo = 1) {
  if (!vals.length) return { min: 0, max: 0 }
  return {
    min: Math.floor(Math.min(...vals) / roundTo) * roundTo,
    max: Math.ceil(Math.max(...vals) / roundTo) * roundTo,
  }
}

type PageSearchProps = {
  searchParams: Promise<SearchParams>
}

export default async function CatalogPage({ searchParams }: PageSearchProps) {
  // Тянем товары и список стилей параллельно. Стили — источник правды теперь
  // коллекция beerStyle, а не уникальные значения из самих товаров.
  const [products, beerStyles] = await Promise.all([
    client.fetch<Product[]>(`
      *[_type == "product"]{
        ...,
        "id": _id,
        "imageUrl": image.asset->url,
        "slug": slug.current,
        "style": style[]->title
      }
    `),
    client.fetch<string[]>(`*[_type == "beerStyle"] | order(title asc).title`),
  ])

  const abvVals = products.map(p => p.abv).filter((v): v is number => v != null)
  const ibuVals = products.map(p => p.ibu).filter((v): v is number => v != null)
  const priceVals = products.map(p => p.price).filter((v): v is number => v != null)

  const filters = {
    categories: [...new Set(products.map(p => p.category).filter(Boolean))] as string[],
    styles: beerStyles,
    country: [...new Set(products.map(p => p.country).filter(Boolean))] as string[],
    abv: numBounds(abvVals, 1),
    ibu: numBounds(ibuVals, 1),
    price: numBounds(priceVals, 10),
  }

  const params = await searchParams
  let filteredProducts: Product[] = products

  for (const key in params) {
    const k = key as keyof SearchParams
    const value = params[k]
    if (!value) continue
    // sort и q — не фильтры; пропускаем, иначе цикл попытается фильтровать
    // товары по несуществующему полю и обнулит выдачу. (q обрабатывает Fuse ниже.)
    if (k === "sort" || k === "q") continue

    filteredProducts = filteredProducts.filter(product => {
      if (k === "minPrice") return product.price >= Number(value)
      if (k === "maxPrice") return product.price <= Number(value)
      if (k === "abvMin") return product.abv != null && product.abv >= Number(value)
      if (k === "abvMax") return product.abv != null && product.abv <= Number(value)
      if (k === "ibuMin") return product.ibu != null && product.ibu >= Number(value)
      if (k === "ibuMax") return product.ibu != null && product.ibu <= Number(value)
      if (k === "style") return product.style?.includes(value) ?? false
      return String(product[k as keyof Product]) === value
    })
  }

  // Поиск (fuzzy, Fuse.js) поверх отфильтрованного — до сортировки.
  // Только по name (решение v1). normalize: регистр + ё→е, чтобы
  // «жигулевское» находило «Жигулёвское». Индекс строим на запрос —
  // на 30-50 товарах это бесплатно.
  let result = filteredProducts
  const q = params.q?.trim()
  if (q) {
    const normalize = (s: string) => s.toLowerCase().replace(/ё/g, "е").trim()
    const fuse = new Fuse(result, {
      keys: [{ name: "name", getFn: (p) => normalize(p.name) }],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
    result = fuse.search(normalize(q)).map((r) => r.item)
  }

  // Сортировка поверх результата. Дефолт — порядок Sanity, либо порядок
  // релевантности Fuse, если активен поиск. Явный sort применяется и при
  // поиске (пользователь его выбрал). По названию — localeCompare('ru').
  if (params.sort === "price_asc") {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (params.sort === "price_desc") {
    result = [...result].sort((a, b) => b.price - a.price)
  } else if (params.sort === "name_asc") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ru"))
  } else if (params.sort === "name_desc") {
    result = [...result].sort((a, b) => b.name.localeCompare(a.name, "ru"))
  } else if (params.sort === "popular") {
    // Популярность подтягиваем только под этот режим — на обычных заходах в
    // каталог лишнего запроса в Supabase нет.
    const rows = await getPopularityRows()
    const views = new Map(rows.map(r => [r.product_name, r.views]))
    result = [...result].sort((a, b) => {
      const diff = (views.get(b.name) ?? 0) - (views.get(a.name) ?? 0)
      // Тай-брейк по имени — чтобы товары с равными (часто нулевыми)
      // просмотрами не «прыгали» от рендера к рендеру.
      return diff !== 0 ? diff : a.name.localeCompare(b.name, "ru")
    })
  }

  return (
    <main className={`${styles["catalog"]} container`}>
      {/* Захватываем применённые фильтры в sessionStorage, чтобы ProductMetric
          на странице товара мог их использовать. useSearchParams требует Suspense. */}
      <Suspense fallback={null}>
        <FilterContextCapture />
      </Suspense>
      <CatalogFilters filters={filters} />
      <div className={styles["catalog__content"]}>
        <div className={styles["catalog__toolbar"]}>
          <CatalogFiltersMobile filters={filters} />
          <CatalogSearch />
          <CatalogSort />
        </div>
        <CatalogGrid products={result} />
      </div>
    </main>
  )
}

