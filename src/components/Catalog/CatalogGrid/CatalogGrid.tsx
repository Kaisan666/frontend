import React from 'react'
import styles from "./CatalogGrid.module.scss"
import { Product } from '@/types/product'
import { ProductCard } from '@/components/ProductCard'

type Products = Product[]


export const CatalogGrid = ({products}: {products: Products}) => {
  return (
    <div className={`${styles['catalog-grid']} catalog-layout`}>
      {products.map(product => (
        <ProductCard id={product.id} name={product.name} price={product.price} category={product.category} imageUrl={`${product.imageUrl}`} country={product.country} unit={product.unit} quantity={product.quantity} slug={product.slug} key={product.id}></ProductCard>
      ))}
    </div>
  )
}
