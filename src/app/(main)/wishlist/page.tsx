"use client"
import Link from "next/link"
import { useWishlist } from "@/lib/wishlist"
import { ProductCard } from "@/components/ProductCard"
import styles from "./page.module.scss"

export default function WishlistPage() {
  const items = useWishlist()

  return (
    <main className={`${styles["wishlist"]} container`}>
      <h1 className={styles["wishlist__title"]}>Избранное</h1>

      {items.length === 0 ? (
        <p className={styles["wishlist__empty"]}>
          В избранном пока пусто. Жми на сердечко у товара —{" "}
          <Link href="/catalog" className="accent-link">перейти в каталог</Link>.
        </p>
      ) : (
        <div className="catalog-layout">
          {items.map((p) => (
            <ProductCard
              key={p.slug}
              id={p.slug}
              slug={p.slug}
              name={p.name}
              price={p.price}
              category={p.category}
              imageUrl={p.imageUrl}
              country={p.country}
              unit={p.unit}
              quantity={p.quantity}
            />
          ))}
        </div>
      )}
    </main>
  )
}
