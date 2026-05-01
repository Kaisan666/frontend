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
  const products = await client.fetch<Product[]>(`
    *[_type == "product"]{
      ...,
      "id": _id,
      "imageUrl": image.asset->url,
      "slug": slug.current
    }
  `)

  const filters = {
    categories: [...new Set(products.map(p => p.category).filter(Boolean))] as string[],
    styles: [...new Set(
      products.flatMap(p =>
        p.style ? p.style.split(/[,\/]/).map(s => s.trim()).filter(Boolean) : []
      )
    )],
    country: [...new Set(products.map(p => p.country).filter(Boolean))] as string[],
    abv: [...new Set(products.map(p => p.abv).filter((v): v is number => v != null))],
    ibu: [...new Set(products.map(p => p.ibu).filter((v): v is number => v != null))],
  }

  const params = await searchParams
  let filteredProducts: Product[] = products

  for (const key in params) {
    const k = key as keyof SearchParams
    filteredProducts = filteredProducts.filter(product => {
      if (k === "minPrice") return product.price >= Number(params[k])
      if (k === "maxPrice") return product.price <= Number(params[k])
      return String(product[k as keyof Product]) === params[k]
    })
  }

  return (
    <main className={`${styles["catalog"]} container`}>
      <CatalogFilters filters={filters} />
      <CatalogGrid products={filteredProducts} />
    </main>
  )
}

