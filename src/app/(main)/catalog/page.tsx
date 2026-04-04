// app/catalog/page.tsx
import { CatalogFilters } from "@/components/Catalog/CatalogFilters";
import { CatalogGrid } from "@/components/Catalog/CatalogGrid";
import { CatalogTabs } from "@/components/Catalog/CatalogTabs";
import { fetchProducts } from "@/app/data/beers";
import styles from "./catalog.module.scss";
import { client } from "@/sanity/lib/client"
import { Product } from "@/types/product";
interface Props {
  searchParams: Promise<{  // ← тип теперь Promise
    category?: string;
    style?: string;
    country?: string;
    volume?: string;
    abvMax?: string;
    priceMax?: string;
  }>;
}


type SearchParams = {
  style?: string
    country?: string
    abv?: string
    search?: string
    page?: string
    minPrice?: string
    maxPrice?: string
}
type PageSearchProps = {
  searchParams: Promise<
    SearchParams
  >
}
export default async function CatalogPage({ searchParams }: PageSearchProps) {
  const products = await client.fetch<Product[]>(`
    *[_type == "product"]{
    ...,
    "id" : _id,
    "imageUrl": image.asset->url,
    "slug": slug.current
    }
    `)
    const filters = {
      categories : [...new Set(products.map(p => p.category).filter(Boolean))],
      styles: [...new Set(products.map(p => p.style).filter(Boolean))],
      country: [...new Set(products.map(p => p.country).filter(Boolean))],
      abv: [...new Set(products.map(p => p.abv).filter(Boolean))],
      ibu: [...new Set(products.map(p => p.ibu).filter(Boolean))],
    }
  let filteredProducts: Product[] = products
  console.log(filteredProducts, "filteredProducts")
  
  const params = await searchParams
  
  for (const key in params){
    filteredProducts = filteredProducts.filter((product) => {
        console.log(product, "product")
        if (key === "minPrice" && product.price >= Number(params[key])){
          return true
        }   
        if (key === "maxPrice" && product.price <= Number(params[key])){
          return true
        }
        if (product[key as keyof Product] === params[key as keyof SearchParams]){
          return true
        }
          return false
      } )
  }
  console.log(filteredProducts)

  console.log(params)
  console.log(filteredProducts, "filteredProducts")
  return (
    <main className={`${styles['catalog']} container`}>
      <CatalogGrid products={filteredProducts}></CatalogGrid>
    </main>
  );
}

