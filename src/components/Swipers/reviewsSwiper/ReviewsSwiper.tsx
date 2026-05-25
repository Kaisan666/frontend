"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./ReviewsSwiper.module.scss";

export type Review = {
  id: string;
  authorName: string;
  text: string;
  submittedAt: string;
}

interface ReviewSwiperProps {
  reviews: Review[];
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const ReviewSwiper = ({ reviews }: ReviewSwiperProps) => {
  if (!reviews.length) return null;

  return (
    <div className={`${styles['reviews-swiper__outer']}`}>
      <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={24}
      slidesPerView={"auto"}
      className={`${styles.swiper} container`}
    >
      {reviews.map((review) => (
        <SwiperSlide key={review.id} className={styles['reviews-swiper__slide']}>
          <p>{review.text}</p>
          <div className={styles['reviews-swiper__slide-footer']}>
            <span>{review.authorName}</span>
            <span>{formatDate(review.submittedAt)}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}
