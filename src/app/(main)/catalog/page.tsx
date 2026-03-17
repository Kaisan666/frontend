// app/catalog/page.tsx
import { CatalogFilters } from "@/components/Catalog/CatalogFilters";
import { CatalogGrid } from "@/components/Catalog/CatalogGrid";
import { CatalogTabs } from "@/components/Catalog/CatalogTabs";
import { fetchProducts } from "@/app/data/beers";
import styles from "./catalog.module.scss";

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


export default async function CatalogPage({ searchParams }: Props) {
  const resolvedParams = await searchParams; // ← Next.js 15: searchParams — Promise

  const category = resolvedParams.category === 'food' ? 'food' : 'beer';

  const products = await fetchProducts({ // ← был пропущен await
    category,
    style: resolvedParams.style,
    country: resolvedParams.country,
    volume: resolvedParams.volume ? Number(resolvedParams.volume) : undefined,
    abvMax: resolvedParams.abvMax ? Number(resolvedParams.abvMax) : undefined,
    priceMax: resolvedParams.priceMax ? Number(resolvedParams.priceMax) : undefined,
  });

  return (
    <main className={`${styles['catalog']} container`}>
      <h1 className={styles['catalog__title']}>Каталог</h1>
      <CatalogTabs activeCategory={category} />
      <div className={styles['catalog__inner']}>
        <CatalogFilters activeCategory={category} />
        <CatalogGrid products={products} />
      </div>
    </main>
  );
}

