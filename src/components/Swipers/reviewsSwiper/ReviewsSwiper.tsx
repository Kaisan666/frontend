"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./ReviewsSwiper.module.scss";

interface Review {
  text: string;
  service: string;
  date: string;
}

interface ReviewSwiperProps {
  reviews: Review[];
}

export const ReviewSwiper = ({ reviews }: ReviewSwiperProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={24}
      slidesPerView={3}
      className={styles.swiper}
    >
      {reviews.map((review, index) => (
        <SwiperSlide key={index} className={styles['reviews-swiper__slide']}>
          <p>{review.text}</p>
          <div className={styles['reviews-swiper__slider-footer']}>
            <span>{review.service}</span>
          <span>{review.date}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
