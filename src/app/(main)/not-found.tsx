import Link from "next/link"
import styles from "./not-found.module.scss"

export const metadata = {
  title: "Страница не найдена — Shengen+",
}

export default function NotFound() {
  return (
    <div className={`${styles["not-found"]} container`}>
      <div className={styles["not-found__inner"]}>
        <span className={styles["not-found__code"]}>404</span>
        <h1 className={styles["not-found__title"]}>Такой страницы нет</h1>
        <p className={styles["not-found__text"]}>
          Возможно, ссылка устарела или вы попали сюда по ошибке. Загляните в
          каталог или вернитесь на главную.
        </p>
        <div className={styles["not-found__actions"]}>
          <Link href="/" className="accent-button">
            На главную
          </Link>
          <Link href="/catalog" className={styles["not-found__link-secondary"]}>
            В каталог
          </Link>
        </div>
      </div>
    </div>
  )
}
