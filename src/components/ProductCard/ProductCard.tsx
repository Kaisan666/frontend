import React from 'react'
import styles from "./ProductsCard.module.scss"
import Link from 'next/link'
// type Props = {
//     id: number
//     name: string,
//     price: number,
//     imgUrl?: string;
//     // isAvailable: boolean;
//     description?: string;
//     country?: string;
//     volume?: number;
//     measurementUnit?: string;
//     // category: "food" | "beer" | ;
// }

import { Product } from '@/types/product'

export const ProductCard = ({category, imageUrl, unit, name, price, quantity, abv, country, slug, description, ibu, style} : Product) => {
  return (
    <div className={styles['product-card']}>
        <div className={styles['product-card__media']}>
            {category === "beer" && (
              <div className={styles['product-card__media-overlay']}></div>
            )}
            <img src={imageUrl} alt="" className={styles['product-card__media-img']} />
        </div>
        <div className={styles['product-card__main']}>
          
        <h2 className={styles['product-card__name']}>{name}</h2>
        {country && (
          <p className={styles['product-card__country']}>Страна производитель: {country}</p>
        )}
        {(quantity && unit) &&  (
          <p className={styles['product-card__volume']}>Объем: {quantity}{unit}</p>
        )}
          <p className={styles['product-card__price']}>Цена: {price}₽</p>
        </div>
          <Link href={`/products/${slug}`} className={`${styles["product-card__detail-link"]} accent-button`}>Подробнее</Link>
        
    </div>
  )
}
