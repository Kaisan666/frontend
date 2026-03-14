import React from "react";
import { navLinks } from "@/app/data/Link";
import styles from "./Footer.module.scss";
import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";
import { FaVk, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';

export const Footer = () => {
  return (
    <footer className={styles["footer"]}>
      <div className={`${styles["footer__inner"]} container`}>
        <div className={styles["footer__main"]}>
          <Link href="/">
            <img src="" alt="логотип" />
          </Link>
          <div className={styles['footer__contacts']}>
            <ul className={styles["footer__info"]}>
            <li className={styles["footer__info-item"]}>
              <div className={styles["footer__info-item-content"]}>
                <MapPin size={24} strokeWidth={2}/>
                <p>г. Краснодар ул. Им. Яцкова, 17 к1</p>
              </div>
              
            </li>
            <li className={styles["footer__info-item"]}>
              <div className={styles["footer__info-item-content"]}>
                <Clock size={24} strokeWidth={2}/> время работы
                <p>
                  с 14:00 до 23:00 - Пн-Пт | с 11 до 23 - Сб-Вс
                </p>
              </div>
              
            </li>
            <li className={styles["footer__info-item"]}>
              <div className={styles["footer__info-item-content"]}>
                <Phone size={24} strokeWidth={2} />
                <p>+7 (918) 186-96-00</p>
              </div>
              
            </li>
            
              
          </ul>
          <div className={styles["footer__social"]}>
          <Link href="https://vk.com" target="_blank">
            <FaVk size={24} fill="#FAF7EF"/>

          </Link>
          <Link href="https://t.me/shengenplus" target="_blank">
            <FaTelegram size={24} fill="#FAF7EF"/>
          </Link>
          <Link
            href="https://api.whatsapp.com/send/?phone=79181869600&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D0%B8%D0%B7+%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F+2%D0%93%D0%98%D0%A1.%0A%0A&type=phone_number&app_absent=0"
            target="_blank"
          >
            <FaWhatsapp size={24} fill="#FAF7EF"/>
          </Link>
        </div>
          </div>
        </div>
        
        <div className={styles["footer__maps"]}>
          <a href="" target="_blank" className={styles['footer__maps-item']}>
            <img src="/icons/yaMaps.svg"  alt="я.карты"  />
            Яндекс.Карты
          </a>
          <a href="" target="_blank" className={styles['footer__maps-item']}>
            <img src="/icons/2gis.svg" alt="2ГИС"/>

            2ГИС
          </a>
          <a href="" target="_blank" className={styles['footer__maps-item']}>
            <SiGooglemaps size={40} />

            Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
};
