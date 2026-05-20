import styles from "./stats.module.scss"

type Props = {
  bounceRate: number
  newVsReturning: { new: number; returning: number }
}

const formatPercent = (rate: number) => `${(rate * 100).toFixed(1)}%`

export const InsightCards = ({ bounceRate, newVsReturning }: Props) => {
  const total = newVsReturning.new + newVsReturning.returning
  const newPct = total > 0 ? newVsReturning.new / total : 0
  const retPct = total > 0 ? newVsReturning.returning / total : 0

  return (
    <div className={styles["insights"]}>
      <div className={styles["insights__card"]}>
        <div className={styles["insights__label"]}>Bounce Rate</div>
        <div className={styles["insights__value"]}>{formatPercent(bounceRate)}</div>
        <div className={styles["insights__hint"]}>
          Сессии, в которых посмотрели ровно один товар и ушли
        </div>
      </div>

      <div className={styles["insights__card"]}>
        <div className={styles["insights__label"]}>Новые vs Возвращающиеся</div>
        <div className={styles["insights__split"]}>
          <div>
            <span className={styles["insights__split-num"]}>
              {newVsReturning.new}
            </span>
            <span className={styles["insights__split-pct"]}>
              {formatPercent(newPct)}
            </span>
            <span className={styles["insights__split-label"]}>новых</span>
          </div>
          <div>
            <span className={styles["insights__split-num"]}>
              {newVsReturning.returning}
            </span>
            <span className={styles["insights__split-pct"]}>
              {formatPercent(retPct)}
            </span>
            <span className={styles["insights__split-label"]}>вернулись</span>
          </div>
        </div>

        <div className={styles["insights__bar"]}>
          <div
            className={`${styles["insights__bar-segment"]} ${styles["insights__bar-segment--new"]}`}
            style={{ width: `${newPct * 100}%` }}
          />
          <div
            className={`${styles["insights__bar-segment"]} ${styles["insights__bar-segment--returning"]}`}
            style={{ width: `${retPct * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
