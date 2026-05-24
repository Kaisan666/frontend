"use client"
import { useEffect, useState, useSyncExternalStore } from "react"
import styles from "./AgeGate.module.scss"

const STORAGE_KEY = "age_confirmed"

const subscribeStorage = (callback: () => void) => {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

const getStorageConfirmed = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
  } catch {
    // localStorage может бросать в приватном режиме — тогда показываем модал каждый раз.
    return false
  }
}

const getServerConfirmed = () => false

export const AgeGate = () => {
  const confirmedInStorage = useSyncExternalStore(
    subscribeStorage,
    getStorageConfirmed,
    getServerConfirmed,
  )
  const [confirmedNow, setConfirmedNow] = useState(false)
  const hidden = confirmedInStorage || confirmedNow

  // Блокируем скролл страницы только пока модал виден.
  useEffect(() => {
    if (hidden) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [hidden])

  if (hidden) return null

  const confirm = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // Если приватный режим — ничего не пишем, но и не падаем
    }
    setConfirmedNow(true)
  }

  const deny = () => {
    // Никакой записи в localStorage. Просто пытаемся вернуться назад.
    // Если истории нет — модал останется висеть, пользователь сам закроет вкладку.
    window.history.back()
  }

  return (
    <div
      className={styles["age-gate"]}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className={styles["age-gate__card"]}>
        <h1 id="age-gate-title" className={styles["age-gate__title"]}>
          Сайт содержит информацию об алкоголе
        </h1>
        <p className={styles["age-gate__text"]}>
          Подтвердите, что вам исполнилось 18 лет.
        </p>
        <div className={styles["age-gate__actions"]}>
          <button
            type="button"
            onClick={confirm}
            className={`${styles["age-gate__btn"]} accent-button`}
            autoFocus
          >
            Да, мне 18+
          </button>
          <button
            type="button"
            onClick={deny}
            className={styles["age-gate__btn-no"]}
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  )
}
