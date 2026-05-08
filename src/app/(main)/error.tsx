"use client"

import { useEffect } from "react"
import styles from "./not-found.module.scss"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // В проде сюда можно повесить отправку в Sentry/любой error-tracker
    console.error(error)
  }, [error])

  return (
    <div className={`${styles["not-found"]} container`}>
      <div className={styles["not-found__inner"]}>
        <span className={styles["not-found__code"]}>!</span>
        <h1 className={styles["not-found__title"]}>Что-то пошло не так</h1>
        <p className={styles["not-found__text"]}>
          Похоже, страница не загрузилась как надо. Попробуй обновить — обычно
          это помогает. Если ошибка повторится — напиши нам в соцсети или
          позвони.
        </p>
        <div className={styles["not-found__actions"]}>
          <button onClick={reset} className="accent-button" type="button">
            Попробовать снова
          </button>
          <a href="/" className={styles["not-found__link-secondary"]}>
            На главную
          </a>
        </div>
      </div>
    </div>
  )
}
