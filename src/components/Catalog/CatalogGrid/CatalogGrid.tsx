import React from 'react'
import styles from "./CatalogGrid.module.scss"
import { Product } from '@/types/product'

type Products = Product[]


const CatalogGrid = ({products}: {products: Products}) => {
  return (
    <div className={`${styles['catalog-grid']} catalog-layout`}>
      
    </div>
  )
}

export default CatalogGrid