import styles from "./page.module.scss";
import { MapPin, Clock, Phone } from "lucide-react";
import { FaVk, FaTelegram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, phoneForTel } from "@/sanity/lib/getSiteSettings";

export const metadata = {
  title: "Контакты — Shengen+",
};

export default async function ContactsPage() {
  const { address, workingHours, phone, socials, maps } = await getSiteSettings();

  return (
    <div className={`${styles.contacts} container`}>
      <h1 className={styles.contacts__title}>Контакты</h1>

      <div className={styles.contacts__grid}>
        <div className={styles.contacts__info}>
          {address && (
            <div className={styles.contacts__block}>
              <div className={styles.contacts__block_header}>
                <MapPin size={22} strokeWidth={2} />
                <h2>Адрес</h2>
              </div>
              <p>{address}</p>
            </div>
          )}

          {(workingHours?.weekdays || workingHours?.weekends) && (
            <div className={styles.contacts__block}>
              <div className={styles.contacts__block_header}>
                <Clock size={22} strokeWidth={2} />
                <h2>Время работы</h2>
              </div>
              {workingHours.weekdays && <p>{workingHours.weekdays}</p>}
              {workingHours.weekends && <p>{workingHours.weekends}</p>}
            </div>
          )}

          {phone && (
            <div className={styles.contacts__block}>
              <div className={styles.contacts__block_header}>
                <Phone size={22} strokeWidth={2} />
                <h2>Телефон</h2>
              </div>
              <a href={phoneForTel(phone)} className={styles.contacts__phone}>
                {phone}
              </a>
            </div>
          )}

          {(socials?.vk || socials?.telegram || socials?.whatsapp) && (
            <div className={styles.contacts__block}>
              <h2 className={styles.contacts__social_title}>Следите за нами!</h2>
              <div className={styles.contacts__social}>
                {socials.vk && (
                  <Link href={socials.vk} target="_blank" rel="noopener noreferrer" className={styles.contacts__social_link}>
                    <FaVk size={22} />
                    ВКонтакте
                  </Link>
                )}
                {socials.telegram && (
                  <Link href={socials.telegram} target="_blank" rel="noopener noreferrer" className={styles.contacts__social_link}>
                    <FaTelegram size={22} />
                    Telegram
                  </Link>
                )}
                {socials.whatsapp && (
                  <Link href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.contacts__social_link}>
                    <FaWhatsapp size={22} />
                    WhatsApp
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {(maps?.yandex || maps?.twoGis || maps?.google) && (
          <div className={styles.contacts__maps}>
            <h2 className={styles.contacts__maps_title}>Открыть на карте</h2>
            <div className={styles.contacts__maps_list}>
              {maps.yandex && (
                <a href={maps.yandex} target="_blank" rel="noopener noreferrer" className={styles.contacts__map_btn}>
                  <Image src="/icons/yaMaps.svg" alt="Яндекс.Карты" width={40} height={40} />
                  Яндекс.Карты
                </a>
              )}
              {maps.twoGis && (
                <a href={maps.twoGis} target="_blank" rel="noopener noreferrer" className={styles.contacts__map_btn}>
                  <Image src="/icons/2gis.svg" alt="2ГИС" width={40} height={40} />
                  2ГИС
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
