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

// Дельта в процентах. Если предыдущий = 0 — отдаём null (показываем «—»).
function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className={styles["totals__delta"]} aria-label="нет данных">—</span>
  }
  const cls =
    value > 0
      ? styles["totals__delta--up"]
      : value < 0
        ? styles["totals__delta--down"]
        : styles["totals__delta--flat"]
  const arrow = value > 0 ? "↑" : value < 0 ? "↓" : "→"
  return (
    <span className={`${styles["totals__delta"]} ${cls}`}>
      {arrow} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

type Props = {
  totals: Totals
  previous: Totals
}

export const TotalsCards = ({ totals, previous }: Props) => {
  const cards = [
    {
      label: "Просмотры",
      value: totals.views.toLocaleString("ru-RU"),
      delta: delta(totals.views, previous.views),
    },
    {
      label: "Уникальные сессии",
      value: totals.uniqueSessions.toLocaleString("ru-RU"),
      delta: delta(totals.uniqueSessions, previous.uniqueSessions),
    },
    {
      label: "Среднее время на странице",
      value: formatTime(totals.avgTimeOnPageSec),
      delta: delta(totals.avgTimeOnPageSec, previous.avgTimeOnPageSec),
    },
    {
      label: "Клики «Забронировать»",
      value: totals.bookingClicks.toLocaleString("ru-RU"),
      delta: delta(totals.bookingClicks, previous.bookingClicks),
    },
    {
      label: "Конверсия в бронь",
      value: formatPercent(totals.conversionRate),
      delta: delta(totals.conversionRate, previous.conversionRate),
    },
  ]

  return (
    <div className={styles["totals"]}>
      {cards.map((c) => (
        <div key={c.label} className={styles["totals__card"]}>
          <div className={styles["totals__label"]}>{c.label}</div>
          <div className={styles["totals__value"]}>{c.value}</div>
          <DeltaBadge value={c.delta} />
        </div>
      ))}
    </div>
  )
}
