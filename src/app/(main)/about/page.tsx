import styles from "./page.module.scss";
import { Beer, CalendarDays, Globe } from "lucide-react";
import { ReviewSwiper, type Review } from "@/components/Swipers/reviewsSwiper";
import { ReviewForm } from "@/components/ReviewForm";
import { client } from "@/sanity/lib/client";

export const metadata = {
  title: "О нас — Shengen+",
};

const features = [
  {
    icon: Beer,
    title: "Крафт и импорт",
    text: "Более 150 сортов пива из 18 стран — от бельгийских элей до американских IPA и японских лагеров.",
  },
  {
    icon: CalendarDays,
    title: "Открыты каждый день",
    text: "Пн–Пт с 14:00, Сб–Вс с 11:00. Всегда ждём гостей — в будни и в праздники.",
  },
  {
    icon: Globe,
    title: "Уютная атмосфера",
    text: "Место без лишнего шума. Приходи один почитать или с компанией — здесь комфортно всем.",
  },
];

const stats = [
  { value: "18", label: "стран" },
  { value: "150+", label: "сортов пива" },
{ value: "23:00", label: "до закрытия" },
];

export default async function AboutPage() {
  const reviews = await client.fetch<Review[]>(`
    *[_type == "review"] | order(submittedAt desc) [0...20] {
      "id": _id,
      authorName,
      text,
      submittedAt
    }
  `);

  return (
    <div className={styles.about}>

      <section className={`${styles.about__hero} container`}>
        <h1 className={styles.about__hero_title}>
          Место, где живёт настоящее пиво
        </h1>
        <p className={styles.about__hero_text}>
          Shengen+ — пивной бар в Краснодаре. Мы собрали разнообразный
          ассортимент крафтового и импортного пива из 18 стран — от бельгийских
          элей до американских IPA. Приходи один с книгой или с большой
          компанией — мы рады всем.
        </p>
      </section>

      <section className={`${styles.about__stats} container`}>
        {stats.map((s) => (
          <div key={s.label} className={styles.about__stat}>
            <span className={styles.about__stat_value}>{s.value}</span>
            <span className={styles.about__stat_label}>{s.label}</span>
          </div>
        ))}
      </section>

      <section className={`${styles.about__features} container`}>
        <h2 className={styles.about__section_title}>Почему Shengen+</h2>
        <div className={styles.about__features_grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.about__feature}>
              <div className={styles.about__feature_icon}>
                <f.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className={styles.about__feature_title}>{f.title}</h3>
              <p className={styles.about__feature_text}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.about__reviews}>
        <div className={`${styles.about__reviews_header} container`}>
          <h2 className={styles.about__section_title}>Что пишут о нас</h2>
        </div>
        <ReviewSwiper reviews={reviews} />
        <div className="container">
          <ReviewForm />
        </div>
      </section>

    </div>
  );
}
