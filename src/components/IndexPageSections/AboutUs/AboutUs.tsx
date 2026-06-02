import React from "react"
import Link from "next/link"
import styles from "./AboutUs.module.scss"
import { ReviewSwiper, type Review } from "@/components/Swipers/reviewsSwiper"

type Props = {
  reviews: Review[]
}

export const AboutUs = ({ reviews }: Props) => {
  return (
    <section className={styles["about-us"]}>
      <div className="section-header container">
        <h2 className={styles["about-us__title"]}>Что пишут о нас</h2>
        <Link href="/about" className="accent-link">
          Подробнее о нас →
        </Link>
      </div>
      <ReviewSwiper reviews={reviews} />
    </section>
  )
}
