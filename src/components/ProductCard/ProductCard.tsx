import React from 'react'
import styles from "./ProductsCard.module.scss"
import Link from 'next/link'
import { Product } from '@/types/product'
import { WishlistButton } from '@/components/WishlistButton'

export const ProductCard = ({category, imageUrl, unit, name, price, quantity, country, slug} : Product) => {
  return (
    <div className={styles['product-card']}>
        <div className={styles['product-card__media']}>
            {category === "beer" && (
              <div className={styles['product-card__media-overlay']}></div>
            )}
            <WishlistButton slug={slug} name={name} price={price} category={category} imageUrl={imageUrl} country={country} unit={unit} quantity={quantity} />
            {/* next/image с fill ломает flex-центровку и навязывает position:absolute. */}
            {/* Чтобы зайти сюда с next/image как надо — нужно тянуть размеры image.asset->metadata.dimensions из Sanity. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
