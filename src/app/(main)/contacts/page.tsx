import styles from "./page.module.scss";
import { MapPin, Clock, Phone } from "lucide-react";
import { FaVk, FaTelegram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Контакты — Shengen+",
};

export default function ContactsPage() {
  return (
    <div className={`${styles.contacts} container`}>
      <h1 className={styles.contacts__title}>Контакты</h1>

      <div className={styles.contacts__grid}>
        <div className={styles.contacts__info}>

          <div className={styles.contacts__block}>
            <div className={styles.contacts__block_header}>
              <MapPin size={22} strokeWidth={2} />
              <h2>Адрес</h2>
            </div>
            <p>г. Краснодар, ул. Им. Яцкова, 17 к1</p>
          </div>

          <div className={styles.contacts__block}>
            <div className={styles.contacts__block_header}>
              <Clock size={22} strokeWidth={2} />
              <h2>Время работы</h2>
            </div>
            <p>Пн–Пт: 14:00 – 23:00</p>
            <p>Сб–Вс: 11:00 – 23:00</p>
          </div>

          <div className={styles.contacts__block}>
            <div className={styles.contacts__block_header}>
              <Phone size={22} strokeWidth={2} />
              <h2>Телефон</h2>
            </div>
            <a href="tel:+79181869600" className={styles.contacts__phone}>
              +7 (918) 186-96-00
            </a>
          </div>

          <div className={styles.contacts__block}>
            <h2 className={styles.contacts__social_title}>Следите за нами!</h2>
            <div className={styles.contacts__social}>
              <Link href="https://vk.com" target="_blank" className={styles.contacts__social_link}>
                <FaVk size={22} />
                ВКонтакте
              </Link>
              <Link href="https://t.me/shengenplus" target="_blank" className={styles.contacts__social_link}>
                <FaTelegram size={22} />
                Telegram
              </Link>
              <Link
                href="https://api.whatsapp.com/send/?phone=79181869600&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21&type=phone_number&app_absent=0"
                target="_blank"
                className={styles.contacts__social_link}
              >
                <FaWhatsapp size={22} />
                WhatsApp
              </Link>
            </div>
          </div>

        </div>

        <div className={styles.contacts__maps}>
          <h2 className={styles.contacts__maps_title}>Открыть на карте</h2>
          <div className={styles.contacts__maps_list}>
            <a href="https://yandex.ru/maps/-/CHdJjIQJ" target="_blank" className={styles.contacts__map_btn}>
              <Image src="/icons/yaMaps.svg" alt="Яндекс.Карты" width={40} height={40} />
              Яндекс.Карты
            </a>
            <a href="https://2gis.ru/krasnodar" target="_blank" className={styles.contacts__map_btn}>
              <Image src="/icons/2gis.svg" alt="2ГИС" width={40} height={40} />
              2ГИС
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
