"use client"
import { useEffect, useState } from "react"
import styles from "./stats.module.scss"

type ReportPeriod = "day" | "week" | "month"

type Report = {
  id: string
  period: ReportPeriod
  periodFrom: string
  periodTo: string
  content: string
  modelName: string
  generatedAt: string
}

const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: "day", label: "За день" },
  { value: "week", label: "За неделю" },
  { value: "month", label: "За месяц" },
]

const PERIOD_LABEL: Record<ReportPeriod, string> = {
  day: "За день",
  week: "За неделю",
  month: "За месяц",
}

function formatGeneratedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export function AiReportSection() {
  const [history, setHistory] = useState<Report[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("week")
  const [isGenerating, setIsGenerating] = useState(false)
  const [openReportId, setOpenReportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  // Подгружаем историю отчётов из Supabase при первом монтировании.
  useEffect(() => {
    let cancelled = false
    fetch("/api/ai-reports")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<{ reports: Report[] }>
      })
      .then((data) => {
        if (cancelled) return
        setHistory(data.reports)
        setOpenReportId(data.reports[0]?.id ?? null)
      })
      .catch((e) => {
        if (cancelled) return
        console.error("[AiReportSection] failed to load history:", e)
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: selectedPeriod }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const report = (await res.json()) as Report
      setHistory((prev) => [report, ...prev])
      setOpenReportId(report.id)
      setIsModalOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сгенерировать отчёт")
    } finally {
      setIsGenerating(false)
    }
  }

  const activeReport = history.find((r) => r.id === openReportId) ?? null

  return (
    <section className={styles["ai-report"]}>
      <header className={styles["ai-report__header"]}>
        <div>
          <h2 className={styles["ai-report__title"]}>ИИ-отчёт по аналитике</h2>
          <p className={styles["ai-report__subtitle"]}>
            Текстовый отчёт на естественном языке с выводами и рекомендациями.
            Формируется языковой моделью GigaChat на основе данных дашборда.
          </p>
        </div>
        <button
          type="button"
          className={styles["ai-report__cta"]}
          onClick={() => setIsModalOpen(true)}
        >
          Сгенерировать отчёт
        </button>
      </header>

      <div className={styles["ai-report__body"]}>
        <aside className={styles["ai-report__history"]}>
          <h3 className={styles["ai-report__history-title"]}>История отчётов</h3>
          {historyLoading && (
            <p className={styles["ai-report__empty"]}>Загружаем…</p>
          )}
          {!historyLoading && history.length === 0 && (
            <p className={styles["ai-report__empty"]}>
              Пока пусто. Нажми «Сгенерировать отчёт».
            </p>
          )}
          <ul className={styles["ai-report__history-list"]}>
            {history.map((report) => (
              <li key={report.id}>
                <button
                  type="button"
                  className={
                    report.id === openReportId
                      ? `${styles["ai-report__history-item"]} ${styles["ai-report__history-item--active"]}`
                      : styles["ai-report__history-item"]
                  }
                  onClick={() => setOpenReportId(report.id)}
                >
                  <span className={styles["ai-report__history-period"]}>
                    {PERIOD_LABEL[report.period]}
                  </span>
                  <span className={styles["ai-report__history-date"]}>
                    {formatGeneratedAt(report.generatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <article className={styles["ai-report__view"]}>
          {activeReport ? (
            <>
              <div className={styles["ai-report__view-meta"]}>
                <span className={styles["ai-report__badge"]}>
                  {activeReport.modelName}
                </span>
                <span>
                  Отчёт {PERIOD_LABEL[activeReport.period].toLowerCase()} • сформирован{" "}
                  {formatGeneratedAt(activeReport.generatedAt)}
                </span>
              </div>
              <div className={styles["ai-report__content"]}>
                {renderReport(activeReport.content)}
              </div>
            </>
          ) : !historyLoading ? (
            <p className={styles["ai-report__empty"]}>
              Отчёты ещё не генерировались. Нажмите «Сгенерировать отчёт», чтобы получить первый.
            </p>
          ) : null}
        </article>
      </div>

      {isModalOpen && (
        <div
          className={styles["ai-report__modal-overlay"]}
          onClick={() => !isGenerating && setIsModalOpen(false)}
        >
          <div
            className={styles["ai-report__modal"]}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {!isGenerating ? (
              <>
                <h3 className={styles["ai-report__modal-title"]}>
                  Период анализа
                </h3>
                <p className={styles["ai-report__modal-hint"]}>
                  Выберите промежуток, по которому модель составит развёрнутый отчёт.
                </p>
                <div className={styles["ai-report__period-group"]}>
                  {PERIOD_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedPeriod(opt.value)}
                      className={
                        opt.value === selectedPeriod
                          ? `${styles["ai-report__period-btn"]} ${styles["ai-report__period-btn--active"]}`
                          : styles["ai-report__period-btn"]
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {error && (
                  <p className={styles["ai-report__error"]} role="alert">
                    {error}
                  </p>
                )}
                <div className={styles["ai-report__modal-actions"]}>
                  <button
                    type="button"
                    className={styles["ai-report__modal-cancel"]}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className={styles["ai-report__modal-confirm"]}
                    onClick={handleGenerate}
                  >
                    Сгенерировать
                  </button>
                </div>
              </>
            ) : (
              <div className={styles["ai-report__loading"]}>
                <div className={styles["ai-report__spinner"]} aria-hidden="true" />
                <p className={styles["ai-report__loading-title"]}>
                  Анализируем данные…
                </p>
                <p className={styles["ai-report__loading-hint"]}>
                  Языковая модель GigaChat обрабатывает агрегаты за выбранный период.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

// ---- Markdown-подобный рендерер ----

function renderReport(text: string) {
  const blocks = text.split(/\n\n+/)
  return blocks.map((block, i) => {
    if (block.startsWith("# ")) {
      return (
        <h3 key={i} className={styles["ai-report__h1"]}>
          {block.slice(2)}
        </h3>
      )
    }
    if (block.startsWith("## ")) {
      return (
        <h4 key={i} className={styles["ai-report__h2"]}>
          {block.slice(3)}
        </h4>
      )
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").map((line) => line.replace(/^- /, ""))
      return (
        <ul key={i} className={styles["ai-report__list"]}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    }
    if (/^\d+\.\s/.test(block)) {
      const items = block.split("\n").map((line) => line.replace(/^\d+\.\s/, ""))
      return (
        <ol key={i} className={styles["ai-report__list"]}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    }
    return (
      <p key={i} className={styles["ai-report__paragraph"]}>
        {renderInline(block)}
      </p>
    )
  })
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}
