import React from 'react'
import styles from "./BeersMenu.module.scss"
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { Product } from '@/types/product';

type Props = {
  products: Product[]
}

export const BeersMenu = ({ products }: Props) => {
  if (products.length === 0) return null

  return (
    <section className={`${styles['beer-menu']} container`}>
      <div className={"section-header"}>
        <h2 className={"section-header__title"}>Популярное</h2>
        <Link className='accent-link' href={"/catalog?category=beer"}>В каталог →</Link>
      </div>
      <div className='catalog-layout'>
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            country={product.country}
            description={product.description}
            imageUrl={product.imageUrl}
            quantity={product.quantity}
            unit={product.unit}
            slug={product.slug}
            abv={product.abv}
            ibu={product.ibu}
            style={product.style}
          />
        ))}
      </div>
    </section>
  )
}
