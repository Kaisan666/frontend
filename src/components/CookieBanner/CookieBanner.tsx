"use client"
import { useState, useSyncExternalStore } from "react"
import styles from "./CookieBanner.module.scss"

const STORAGE_KEY = "cookies_accepted"

// TODO: заменить href="#" на ссылку на PDF с политикой использования cookies
// (положить файл в public/ и указать путь, например "/cookies-policy.pdf",
// либо вставить внешний URL).
const POLICY_LINK = "#"

const subscribeStorage = (callback: () => void) => {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

const getStorageAccepted = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
  } catch {
    // приватный режим — показываем баннер каждый раз
    return false
  }
}

// SSR / начальная гидрация: считаем «принято», чтобы баннер не мигал у тех,
// кто уже подтвердил. После гидрации snapshot переключается на реальное значение.
const getServerAccepted = () => true

export const CookieBanner = () => {
  const acceptedInStorage = useSyncExternalStore(
    subscribeStorage,
    getStorageAccepted,
    getServerAccepted,
  )
  const [acceptedNow, setAcceptedNow] = useState(false)
  const hidden = acceptedInStorage || acceptedNow

  if (hidden) return null

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // приватный режим — просто скрываем без сохранения
    }
    setAcceptedNow(true)
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
