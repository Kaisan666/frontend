import styles from "./loading.module.scss"

export default function Loading() {
  return (
    <div className={`${styles["loading"]} container`} aria-label="Загрузка" role="status">
      <div className={styles["loading__spinner"]} aria-hidden="true" />
      <p className={styles["loading__text"]}>Загружаем…</p>
    </div>
  )
}
