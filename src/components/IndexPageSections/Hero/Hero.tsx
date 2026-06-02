import React from 'react'
import Link from "next/link"
import styles from "./Hero.module.scss"
export const Hero = () => {
  return (
    <section className={`${styles["hero"]}`}>
        <div className={styles['hero__overlay']}></div>
        <div className={`${styles['hero__content']} container`}>
            <div className={styles['hero__content-main']}>
                <h1 className={styles['hero__title']}>SHENGEN+</h1>
        <h2 className={styles['hero__subtitle']}>Бар импортного пива</h2>
            </div>

        <div className={styles['hero__bottom']}>
            <div className={styles['hero__annotation']}>
                150+ сортов | 18 стран | Открыты каждый день
            </div>
            <Link href="/catalog" className={`${styles['hero__cta']} accent-button`}>
                Смотреть меню
            </Link>
        </div>
        </div>
    </section>
  )
}
