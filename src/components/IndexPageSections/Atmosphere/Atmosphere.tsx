"use client"
import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import styles from "./Atmosphere.module.scss"

type GalleryImage = {
  url: string
  width: number
  height: number
}

type Props = {
  images: GalleryImage[]
}

// Sanity CDN умеет ресайз через query-параметры — строим srcSet прямо из url,
// без urlFor (нам хватает базового url + размеров). Zoom-плагин YARL плохо
// дружит с next/image, поэтому для лайтбокса отдаём srcSet, а не <Image>.
const SRCSET_WIDTHS = [640, 1024, 1600, 2048]
const sanityUrl = (url: string, w: number) => `${url}?w=${w}&fit=max&auto=format`

export const Atmosphere = ({ images }: Props) => {
  const [index, setIndex] = useState(-1)

  if (!images?.length) return null

  const slides = images.map((img) => ({
    src: sanityUrl(img.url, 1600),
    alt: "Атмосфера Shengen+",
    width: img.width,
    height: img.height,
    srcSet: SRCSET_WIDTHS.map((w) => ({
      src: sanityUrl(img.url, w),
      width: w,
      height: Math.round((img.height / img.width) * w),
    })),
  }))

  return (
    <section className={styles["atmosphere"]}>
      <div className="section-header container">
        <h2 className="section-header__title">Наша атмосфера</h2>
      </div>

      {/* «Плёнка»: слайды одной высоты, ширина — по пропорции фото (slidesPerView:
          "auto"), без обрезки. Обёртка overflow:hidden клипает торчащие слайды,
          padding-left выравнивает первый по контенту. Клик → зум-лайтбокс. */}
      <div className={styles["atmosphere__outer"]}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          breakpoints={{
            765: { spaceBetween: 24 },
          }}
          className={styles["atmosphere__swiper"]}
        >
          {images.map((img, i) => (
            <SwiperSlide
              key={img.url + i}
              className={styles["atmosphere__slide"]}
              onClick={() => setIndex(i)}
            >
              <Image
                src={img.url}
                alt="Атмосфера Shengen+"
                width={img.width}
                height={img.height}
                sizes="(max-width: 764px) 60vw, 30vw"
                className={styles["atmosphere__img"]}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Lightbox
        open={index >= 0}
        index={index < 0 ? 0 : index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Counter, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3, doubleTapDelay: 250 }}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        }}
      />
    </section>
  )
}
