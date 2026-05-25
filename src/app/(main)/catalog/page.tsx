import { CatalogFilters } from "@/components/Catalog/CatalogFilters"
import { CatalogGrid } from "@/components/Catalog/CatalogGrid"
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

    filteredProducts = filteredProducts.filter(product => {
      if (k === "minPrice") return product.price >= Number(value)
      if (k === "maxPrice") return product.price <= Number(value)
      if (k === "style") return product.style?.includes(value) ?? false
      return String(product[k as keyof Product]) === value
    })
  }

  return (
    <main className={`${styles["catalog"]} container`}>
      <CatalogFilters filters={filters} />
      <CatalogGrid products={filteredProducts} />
    </main>
  )
}

