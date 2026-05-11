"use client"
import styles from "./stats.module.scss"

export type Period = "day" | "week" | "month"

const OPTIONS: { value: Period; label: string }[] = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
]

type Props = {
  value: Period
  onChange: (p: Period) => void
}

export const PeriodFilter = ({ value, onChange }: Props) => {
  return (
    <div className={styles["period-filter"]} role="group" aria-label="Период">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`${styles["period-filter__btn"]} ${
            value === opt.value ? styles["period-filter__btn--active"] : ""
          }`}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
