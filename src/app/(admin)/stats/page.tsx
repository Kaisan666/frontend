"use client"
import { useEffect, useState } from "react"
import styles from "./stats.module.scss"
import { PeriodFilter, type Period } from "./PeriodFilter"
import { TotalsCards } from "./TotalsCards"
import { ViewsByDayChart } from "./ViewsByDayChart"
import { CategoriesChart } from "./CategoriesChart"
import { TopProductsChart } from "./TopProductsChart"
import { BottomProductsChart } from "./BottomProductsChart"
import { DevicesChart } from "./DevicesChart"
import { FiltersChart } from "./FiltersChart"
import { HeatmapChart } from "./HeatmapChart"
import { TimeDistributionChart } from "./TimeDistributionChart"
import { InsightCards } from "./InsightCards"
import { AiReportSection } from "./AiReportSection"

type Totals = {
  views: number
  uniqueSessions: number
  avgTimeOnPageSec: number
  bookingClicks: number
  conversionRate: number
}

type StatsData = {
  period: { from: string; to: string }
  totals: Totals
  previous: Totals
  viewsByDay: { date: string; views: number }[]
  topCategories: { category: string; views: number }[]
  topProducts: { name: string; category: string; views: number }[]
  bottomProducts: { name: string; category: string; views: number }[]
  devices: { mobile: number; tablet: number; desktop: number }
  topFilters: { key: string; value: string; count: number }[]
  newVsReturning: { new: number; returning: number }
  heatmap: number[][]
  timeDistribution: { bucket: string; count: number }[]
  bounceRate: number
}

type FetchState = {
  data: StatsData | null
  fetchedPeriod: Period | null
  error: string | null
}

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>("month")
  const [state, setState] = useState<FetchState>({
    data: null,
    fetchedPeriod: null,
    error: null,
  })

  // Грузим, пока фактически загруженный период не совпал с выбранным.
  const loading = state.fetchedPeriod !== period
  const { data, error } = state

  useEffect(() => {
    let cancelled = false
    fetch(`/api/stats?period=${period}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<StatsData>
      })
      .then((d) => {
        if (cancelled) return
        setState({ data: d, fetchedPeriod: period, error: null })
      })
      .catch((e) => {
        if (cancelled) return
        setState((prev) => ({
          ...prev,
          fetchedPeriod: period,
          error: String(e.message ?? e),
        }))
      })
    return () => {
      cancelled = true
    }
  }, [period])

  return (
    <div className={styles["stats"]}>
      <header className={styles["stats__header"]}>
        <h1 className={styles["stats__title"]}>Статистика</h1>
        <PeriodFilter value={period} onChange={setPeriod} />
      </header>

      {loading && <p className={styles["stats__state"]}>Загружаем…</p>}
      {error && !loading && (
        <p className={styles["stats__state"]} role="alert">
          Ошибка: {error}
        </p>
      )}

      {data && !loading && (
        <>
          <TotalsCards totals={data.totals} previous={data.previous} />

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
              <h2 className={styles["stats__section-title"]}>Устройства</h2>
              <DevicesChart data={data.devices} />
            </section>
          </div>

          <div className={styles["stats__split"]}>
            <section className={styles["stats__section"]}>
              <h2 className={styles["stats__section-title"]}>Топ товаров</h2>
              <TopProductsChart data={data.topProducts} />
            </section>

            <section className={styles["stats__section"]}>
              <h2 className={styles["stats__section-title"]}>Низкий интерес</h2>
              <BottomProductsChart data={data.bottomProducts} />
            </section>
          </div>

          <div className={styles["stats__split"]}>
            <section className={styles["stats__section"]}>
              <h2 className={styles["stats__section-title"]}>Применённые фильтры</h2>
              <FiltersChart data={data.topFilters} />
            </section>

            <section className={styles["stats__section"]}>
              <h2 className={styles["stats__section-title"]}>Поведение сессий</h2>
              <InsightCards
                bounceRate={data.bounceRate}
                newVsReturning={data.newVsReturning}
              />
            </section>
          </div>

          <section className={styles["stats__section"]}>
            <h2 className={styles["stats__section-title"]}>
              Активность по часам (МСК)
            </h2>
            <HeatmapChart data={data.heatmap} />
          </section>

          <section className={styles["stats__section"]}>
            <h2 className={styles["stats__section-title"]}>Время на странице</h2>
            <TimeDistributionChart data={data.timeDistribution} />
          </section>

          <p className={styles["stats__period-info"]}>
            Период: {data.period.from} — {data.period.to}
          </p>

          <AiReportSection />
        </>
      )}
    </div>
  )
}
