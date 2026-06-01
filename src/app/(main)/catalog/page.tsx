import { Suspense } from "react"
import { CatalogFilters } from "@/components/Catalog/CatalogFilters"
import { CatalogGrid } from "@/components/Catalog/CatalogGrid"
import { CatalogSort } from "@/components/Catalog/CatalogSort"
import { FilterContextCapture } from "@/components/FilterContextCapture"
import styles from "./catalog.module.scss"
import { client } from "@/sanity/lib/client"
import { Product } from "@/types/product"

type SearchParams = {
  style?: string
  country?: string
  category?: string
  abv?: string
  ibu?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
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

  const filters = {
    categories: [...new Set(products.map(p => p.category).filter(Boolean))] as string[],
    styles: beerStyles,
    country: [...new Set(products.map(p => p.country).filter(Boolean))] as string[],
    abv: [...new Set(products.map(p => p.abv).filter((v): v is number => v != null))],
    ibu: [...new Set(products.map(p => p.ibu).filter((v): v is number => v != null))],
  }

  const params = await searchParams
  let filteredProducts: Product[] = products

  for (const key in params) {
    const k = key as keyof SearchParams
    const value = params[k]
    if (!value) continue
    // sort — не фильтр; пропускаем, иначе цикл попытается фильтровать товары
    // по несуществующему полю и обнулит выдачу.
    if (k === "sort") continue

    filteredProducts = filteredProducts.filter(product => {
      if (k === "minPrice") return product.price >= Number(value)
      if (k === "maxPrice") return product.price <= Number(value)
      if (k === "style") return product.style?.includes(value) ?? false
      return String(product[k as keyof Product]) === value
    })
  }

  // Сортировка поверх отфильтрованного. Дефолт — порядок Sanity (без sort).
  // По названию — localeCompare('ru'), чтобы кириллица шла правильно (А, Б, В…).
  if (params.sort === "price_asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (params.sort === "price_desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (params.sort === "name_asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name, "ru"))
  } else if (params.sort === "name_desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name, "ru"))
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
        <CatalogSort />
        <CatalogGrid products={filteredProducts} />
      </div>
    </main>
  )
}

