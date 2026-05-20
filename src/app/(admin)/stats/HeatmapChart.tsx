"use client"
import styles from "./stats.module.scss"

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

type Props = {
  data: number[][] // [7][24] — день недели × час
}

export const HeatmapChart = ({ data }: Props) => {
  const flat = data.flat()
  const max = flat.reduce((m, v) => (v > m ? v : m), 0)

  if (max === 0) {
    return <p style={{ opacity: 0.6 }}>Недостаточно данных за выбранный период</p>
  }

  return (
    <div className={styles["heatmap"]}>
      <div className={styles["heatmap__grid"]}>
        {/* Угол + часы */}
        <div className={styles["heatmap__corner"]} />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className={styles["heatmap__hour-label"]}>
            {h % 3 === 0 ? h : ""}
          </div>
        ))}

        {/* Строки: день недели + 24 ячейки */}
        {DAY_LABELS.map((day, dayIdx) => (
          <Row key={day} day={day} row={data[dayIdx]} max={max} />
        ))}
      </div>
      <div className={styles["heatmap__legend"]}>
        <span>Меньше</span>
        <div className={styles["heatmap__legend-scale"]}>
          {[0.15, 0.35, 0.55, 0.75, 1].map((alpha) => (
            <div
              key={alpha}
              style={{ background: `rgba(214, 94, 18, ${alpha})` }}
            />
          ))}
        </div>
        <span>Больше</span>
      </div>
    </div>
  )
}

function Row({ day, row, max }: { day: string; row: number[]; max: number }) {
  return (
    <>
      <div className={styles["heatmap__day-label"]}>{day}</div>
      {row.map((value, h) => {
        const intensity = max > 0 ? value / max : 0
        const bg = value === 0
          ? "transparent"
          : `rgba(214, 94, 18, ${0.15 + intensity * 0.85})`
        return (
          <div
            key={h}
            className={styles["heatmap__cell"]}
            style={{ background: bg }}
            title={`${day} ${h}:00 — ${value} событий`}
          />
        )
      })}
    </>
  )
}
