import styles from "./stats.module.scss"

type Totals = {
  views: number
  uniqueSessions: number
  avgTimeOnPageSec: number
  bookingClicks: number
  conversionRate: number
}

const formatTime = (sec: number) => {
  if (sec < 60) return `${sec} сек`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s > 0 ? `${m} мин ${s} сек` : `${m} мин`
}

const formatPercent = (rate: number) => `${(rate * 100).toFixed(1)}%`

export const TotalsCards = ({ totals }: { totals: Totals }) => {
  const cards = [
    { label: "Просмотры", value: totals.views.toLocaleString("ru-RU") },
    { label: "Уникальные сессии", value: totals.uniqueSessions.toLocaleString("ru-RU") },
    { label: "Среднее время на странице", value: formatTime(totals.avgTimeOnPageSec) },
    { label: "Клики «Забронировать»", value: totals.bookingClicks.toLocaleString("ru-RU") },
    { label: "Конверсия в бронь", value: formatPercent(totals.conversionRate) },
  ]

  return (
    <div className={styles["totals"]}>
      {cards.map((c) => (
        <div key={c.label} className={styles["totals__card"]}>
          <div className={styles["totals__label"]}>{c.label}</div>
          <div className={styles["totals__value"]}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}
