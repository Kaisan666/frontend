// components/beerCard/BeerCard.tsx
import React from 'react'
import styles from "../productCard/ProductsCard.module.scss"
import Link from 'next/link'
import { Beer } from '@/types/product'

export const BeerCard = ({ id, name, price, image, country, volume, description, abv, style }: Beer) => {
  return (
    <div className={styles['product-card']}>
      <div className={styles['product-card__media']}>
        <div className={styles['product-card__media-overlay']}></div>
        <img src={image} alt={name} className={styles['product-card__media-img']} />
      </div>
      <div className={styles['product-card__main']}>
        <h2 className={styles['product-card__name']}>{name}</h2>
        {style && (
          <p className={styles['product-card__country']}>{style}</p>
        )}
        {country && (
          <p className={styles['product-card__country']}>Страна производитель: {country}</p>
        )}
        {abv && (
          <p className={styles['product-card__volume']}>{abv}% ABV</p>
        )}
        {volume && (
          <p className={styles['product-card__volume']}>Объём: {volume} л</p>
        )}
        <p className={styles['product-card__price']}>Цена: {price}₽</p>
      </div>
      <Link href={`/catalog/${id}`} className={`${styles["product-card__detail-link"]} accent-button`}>
        Подробнее
      </Link>
    </div>
  )
}
