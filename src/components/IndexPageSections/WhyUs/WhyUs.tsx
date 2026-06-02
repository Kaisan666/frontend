import React from "react"
import { Beer, CalendarDays, Globe } from "lucide-react"
import styles from "./WhyUs.module.scss"

const features = [
  {
    icon: Beer,
    title: "Крафт и импорт",
    text: "150+ сортов из 18 стран — от бельгийских элей до американских IPA.",
  },
  {
    icon: CalendarDays,
    title: "Открыты каждый день",
    text: "Пн–Пт с 14:00, Сб–Вс с 11:00. Всегда до 23:00.",
  },
  {
    icon: Globe,
    title: "Уютная атмосфера",
    text: "Без лишнего шума — комфортно и одному, и компанией.",
  },
]

export const WhyUs = () => {
  return (
    <section className={`${styles["why-us"]} container`}>
      <div className={styles["why-us__grid"]}>
        {features.map((f) => (
          <div key={f.title} className={styles["why-us__item"]}>
            <div className={styles["why-us__icon"]}>
              <f.icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className={styles["why-us__title"]}>{f.title}</h3>
            <p className={styles["why-us__text"]}>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
