import React from "react";
import styles from "./AboutUs.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ReviewSwiper } from "@/components/Swipers/reviewsSwiper";
import { reviews } from "@/app/data/Reviews";


export const AboutUs = () => {
  return (
    <section className={styles["about-us"]}>
      <div className="section-header container">
        <h2 className={`${styles["about-us__title"]} section-header__title`}>
          Место, где живёт настоящее пиво
        </h2>
      </div>
      <div className={`${styles["about-us__content"]} container`}>
        {/* <h3 className={styles["about-us__catchphras"]}>
          Место, где живёт настоящее пиво
        </h3> */}

        <div className={styles["about-us__main"]}>
          <div className={styles["about-us__description"]}>
            Shengen+ — пивной бар в Краснодара. Мы собрали более разнообразный
            ассортимент сортов крафтового и импортного пива из 18 стран — от
            бельгийских эллей до американских IPA. Приходи один или с компанией.
          </div>
          <ul className={styles["about-us__features"]}>
            <li className={styles["about-us__features-item"]}>
              <p className={styles["about-us__features-item-text"]}>
                Уютная атмосфера
              </p>
            </li>
            <li className={styles["about-us__features-item"]}>
              <p className={styles["about-us__features-item-text"]}>
                Разнообразный ассортимент
              </p>
            </li>
            <li className={styles["about-us__features-item"]}>
              <p className={styles["about-us__features-item-text"]}>
                Вкусная кухня до последнего гостя
              </p>
            </li>
            <li className={styles["about-us__features-item"]}>
              <p className={styles["about-us__features-item-text"]}>
                Открыты каждый день до 23:00
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className={`${styles["about-us__comments"]} container`}>
        <div className={styles["about-us__comments-title"]}>
          <h3 className={styles["about-us__comments-title-text"]}>
            Что пишут о нас
          </h3>
          <ReviewSwiper reviews={reviews}>
          </ReviewSwiper>
        </div>
      </div>
    </section>
  );
};
