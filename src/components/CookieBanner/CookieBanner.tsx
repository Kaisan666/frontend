"use client"
import { useEffect, useState } from "react"
import styles from "./CookieBanner.module.scss"

const STORAGE_KEY = "cookies_accepted"

// TODO: заменить href="#" на ссылку на PDF с политикой использования cookies
// (положить файл в public/ и указать путь, например "/cookies-policy.pdf",
// либо вставить внешний URL).
const POLICY_LINK = "#"

export const CookieBanner = () => {
  const [hidden, setHidden] = useState(true) // SSR: спрятан, на mount решаем

  useEffect(() => {
    let accepted = false
    try {
      accepted = window.localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      // приватный режим — показываем баннер каждый раз
    }
    setHidden(accepted)
  }, [])

  if (hidden) return null

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // приватный режим — просто скрываем без сохранения
    }
    setHidden(true)
  }

  return (
    <div className={styles["cookie-banner"]} role="region" aria-label="Уведомление о cookies">
      <p className={styles["cookie-banner__text"]}>
        Пользуясь нашим сайтом, вы соглашаетесь с тем, что мы{" "}
        <a
          href={POLICY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["cookie-banner__link"]}
        >
          используем cookies
        </a>
      </p>
      <button
        type="button"
        onClick={accept}
        className={styles["cookie-banner__btn"]}
      >
        Понятно
      </button>
    </div>
  )
}
