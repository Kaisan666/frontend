import React from 'react'
import styles from "./ProductsCard.module.scss"
import Link from 'next/link'
type Props = {
    id: number
    name: string,
    price: number,
    imgUrl?: string;
    // isAvailable: boolean;
    description?: string;
    country?: string;
    volume?: number;
    measurementUnit?: string;
    type: string;
}

export const ProductCard = ({id, name, price, imgUrl, country, volume, measurementUnit, type, description} : Props) => {
  return (
    <div className={styles['product-card']}>
        <div className={styles['product-card__media']}>
            {type === "beer" && (
              <div className={styles['product-card__media-overlay']}></div>
            )}
            <img src={imgUrl} alt="" className={styles['product-card__media-img']} />
        </div>
        <div className={styles['product-card__main']}>
          
        <h2 className={styles['product-card__name']}>{name}</h2>
        {country && (
          <p className={styles['product-card__country']}>Страна производитель: {country}</p>
        )}
        {volume && measurementUnit && (
          <p className={styles['product-card__volume']}>Объем: {volume}{measurementUnit}</p>
        )}
          <p className={styles['product-card__price']}>Цена: {price}₽</p>
        </div>
          <Link href={`/products/${name}`} className={`${styles["product-card__detail-link"]} accent-button`}>Подробнее</Link>
        
    </div>
  )
}
