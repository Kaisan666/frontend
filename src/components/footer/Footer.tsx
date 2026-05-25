import React from "react"
import styles from "./Footer.module.scss"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Phone } from "lucide-react"
import { FaVk, FaTelegram, FaWhatsapp } from "react-icons/fa"
import { getSiteSettings, phoneForTel } from "@/sanity/lib/getSiteSettings"

export const Footer = async () => {
  const settings = await getSiteSettings()
  const { address, workingHours, phone, socials, maps } = settings

  return (
    <footer className={styles["footer"]}>
      <div className={`${styles["footer__inner"]} container`}>
        <div className={styles["footer__main"]}>
          {/* <Link href="/">
            <img src="" alt="логотип" />
          </Link> */}
          <div className={styles["footer__contacts"]}>
            <ul className={styles["footer__info"]}>
              {address && (
                <li className={styles["footer__info-item"]}>
                  <div className={styles["footer__info-item-content"]}>
                    <MapPin size={24} strokeWidth={2} />
                    <p>{address}</p>
                  </div>
                </li>
              )}
              {(workingHours?.weekdays || workingHours?.weekends) && (
                <li className={styles["footer__info-item"]}>
                  <div className={styles["footer__info-item-content"]}>
                    <Clock size={24} strokeWidth={2} /> время работы
                    <div>
                      {workingHours.weekdays && <p>{workingHours.weekdays}</p>}
                      {workingHours.weekends && <p>{workingHours.weekends}</p>}
                    </div>
                  </div>
                </li>
              )}
              {phone && (
                <li className={styles["footer__info-item"]}>
                  <div className={styles["footer__info-item-content"]}>
                    <Phone size={24} strokeWidth={2} />
                    <a href={phoneForTel(phone)}>{phone}</a>
                  </div>
                </li>
              )}
            </ul>

            <div className={styles["footer__social"]}>
              {socials?.vk && (
                <Link href={socials.vk} target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте">
                  <FaVk size={24} fill="#FAF7EF" />
                </Link>
              )}
              {socials?.telegram && (
                <Link href={socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <FaTelegram size={24} fill="#FAF7EF" />
                </Link>
              )}
              {socials?.whatsapp && (
                <Link href={socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <FaWhatsapp size={24} fill="#FAF7EF" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={styles["footer__maps"]}>
          {maps?.yandex && (
            <a href={maps.yandex} target="_blank" rel="noopener noreferrer" className={styles["footer__maps-item"]}>
              <Image src="/icons/yaMaps.svg" alt="я.карты" width={45} height={45} />
              Яндекс.Карты
            </a>
          )}
          {maps?.twoGis && (
            <a href={maps.twoGis} target="_blank" rel="noopener noreferrer" className={styles["footer__maps-item"]}>
              <Image src="/icons/2gis.svg" alt="2ГИС" width={45} height={45} />
              2ГИС
            </a>
          )}
          {/* <a href="" target="_blank" className={styles['footer__maps-item']}>
            <SiGooglemaps size={40} />
            Google Maps
          </a> */}
        </div>
      </div>
    </footer>
  )
}
