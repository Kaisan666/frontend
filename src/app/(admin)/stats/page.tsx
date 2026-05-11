"use client"
import { useEffect, useState } from "react"
import styles from "./stats.module.scss"
import { PeriodFilter, type Period } from "./PeriodFilter"
import { TotalsCards } from "./TotalsCards"
import { ViewsByDayChart } from "./ViewsByDayChart"
import { CategoriesChart } from "./CategoriesChart"
import { TopProductsChart } from "./TopProductsChart"

type StatsData = {
  period: { from: string; to: string }
  totals: {
    views: number
    uniqueSessions: number
    avgTimeOnPageSec: number
    bookingClicks: number
    conversionRate: number
  }
  viewsByDay: { date: string; views: number }[]
  topCategories: { category: string; views: number }[]
  topProducts: { name: string; category: string; views: number }[]
}

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("month")
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/stats?period=${period}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false))
  }, [period])

  return (
    <div className={styles["stats"]}>
      <header className={styles["stats__header"]}>
        <h1 className={styles["stats__title"]}>Статистика</h1>
        <PeriodFilter value={period} onChange={setPeriod} />
      </header>

      {loading && <p className={styles["stats__state"]}>Загружаем…</p>}
      {error && (
        <p className={styles["stats__state"]} role="alert">
          Ошибка: {error}
        </p>
      )}

      {data && !loading && (
        <>
          <TotalsCards totals={data.totals} />

          <section className={styles["stats__section"]}>
            <h2 className={styles["stats__section-title"]}>Просмотры по дням</h2>
            <ViewsByDayChart data={data.viewsByDay} />
          </section>

          <div className={styles["stats__split"]}>
            <section className={styles["stats__section"]}>
              <h2 className={styles["stats__section-title"]}>Категории</h2>
              <CategoriesChart data={data.topCategories} />
            </section>

            <section className={styles["stats__section"]}>
              <h2 className={styles["stats__section-title"]}>Топ товаров</h2>
              <TopProductsChart data={data.topProducts} />
            </section>
          </div>

          <p className={styles["stats__period-info"]}>
            Период: {data.period.from} — {data.period.to}
          </p>
        </>
      )}
    </div>
  )
}
