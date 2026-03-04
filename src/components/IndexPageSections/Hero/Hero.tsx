import React from 'react'
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
        
        <div className={styles['hero__annotation']}>
            200+ сортов | 18 стран | Открыты каждый день
        </div>
        </div>
    </section>
  )
}
