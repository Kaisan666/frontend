"use client"
import { useState } from "react"
import styles from "./stats.module.scss"

type ReportPeriod = "day" | "week" | "month"

type Report = {
  id: string
  period: ReportPeriod
  periodLabel: string
  generatedAt: string
  content: string
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

// Демонстрационные отчёты для истории — наполняют список,
// чтобы при первом заходе пользователь сразу видел подраздел истории.
const SEED_HISTORY: Report[] = [
  {
    id: "rep-2026-05-15",
    period: "week",
    periodLabel: "За неделю",
    generatedAt: "2026-05-15 14:22",
    content: buildReportText("week", "08.05.2026 – 14.05.2026", {
      views: 1247,
      sessions: 542,
      conversion: 4.8,
      topCategory: "Пиво",
      topShare: 71,
      topProduct: "Guinness Draught",
      lowProduct: "Безалкогольное светлое",
    }),
  },
  {
    id: "rep-2026-05-01",
    period: "month",
    periodLabel: "За месяц",
    generatedAt: "2026-05-01 09:15",
    content: buildReportText("month", "01.04.2026 – 30.04.2026", {
      views: 4836,
      sessions: 1894,
      conversion: 5.3,
      topCategory: "Пиво",
      topShare: 68,
      topProduct: "Belhaven Black",
      lowProduct: "Сидр яблочный",
    }),
  },
]

export function AiReportSection() {
  const [history, setHistory] = useState<Report[]>(SEED_HISTORY)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("week")
  const [isGenerating, setIsGenerating] = useState(false)
  const [openReportId, setOpenReportId] = useState<string | null>(SEED_HISTORY[0]?.id ?? null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Имитация запроса к GigaChat — несколько секунд «обращения к языковой модели»
    await new Promise((resolve) => setTimeout(resolve, 2400))

    const now = new Date()
    const formatted = now.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const newReport: Report = {
      id: `rep-${now.getTime()}`,
      period: selectedPeriod,
      periodLabel: PERIOD_LABEL[selectedPeriod],
      generatedAt: formatted.replace(",", ""),
      content: buildReportText(selectedPeriod, periodRangeLabel(selectedPeriod), {
        views: 1834,
        sessions: 743,
        conversion: 5.1,
        topCategory: "Пиво",
        topShare: 72,
        topProduct: "Trappistes Rochefort 10",
        lowProduct: "Морс клюквенный",
      }),
    }

    setHistory((prev) => [newReport, ...prev])
    setOpenReportId(newReport.id)
    setIsGenerating(false)
    setIsModalOpen(false)
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
                    {report.periodLabel}
                  </span>
                  <span className={styles["ai-report__history-date"]}>
                    {report.generatedAt}
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
                <span className={styles["ai-report__badge"]}>GigaChat</span>
                <span>
                  Отчёт {activeReport.periodLabel.toLowerCase()} • сформирован{" "}
                  {activeReport.generatedAt}
                </span>
              </div>
              <div className={styles["ai-report__content"]}>
                {renderReport(activeReport.content)}
              </div>
            </>
          ) : (
            <p className={styles["ai-report__empty"]}>
              Отчёты ещё не генерировались. Нажмите «Сгенерировать отчёт», чтобы получить первый.
            </p>
          )}
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

// ---- Helpers ----

function periodRangeLabel(period: ReportPeriod): string {
  const to = new Date()
  const from = new Date()
  if (period === "day") from.setDate(to.getDate() - 1)
  if (period === "week") from.setDate(to.getDate() - 7)
  if (period === "month") from.setDate(to.getDate() - 30)
  const f = (d: Date) =>
    d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })
  return `${f(from)} – ${f(to)}`
}

type ReportContext = {
  views: number
  sessions: number
  conversion: number
  topCategory: string
  topShare: number
  topProduct: string
  lowProduct: string
}

function buildReportText(period: ReportPeriod, range: string, ctx: ReportContext): string {
  const periodWord =
    period === "day" ? "сутки" : period === "week" ? "неделю" : "месяц"

  return `# Аналитический отчёт за ${periodWord} (${range})

## Ключевые выводы
За отчётный период сайт пивного бара Shengen+ получил ${ctx.views.toLocaleString("ru-RU")} просмотров карточек товаров от ${ctx.sessions.toLocaleString("ru-RU")} уникальных сессий. Конверсия в клик по кнопке «Забронировать» составила ${ctx.conversion}%, что соответствует ожидаемому диапазону для сегмента HoReCa и говорит о здоровом качестве трафика.

Доминирующим разделом интереса остаётся категория «${ctx.topCategory}» — на неё приходится около ${ctx.topShare}% всех просмотров. Это подтверждает позиционирование заведения как специализированного пивного бара и оправдывает упор на широту ассортимента крафтового и импортного пива.

## Что работает
- **Глубина пивной карты.** Позиция «${ctx.topProduct}» стабильно входит в топ просмотров — пользователи возвращаются к карточке более одного раза за сессию, что указывает на интерес к детальному составу и характеристикам.
- **Мобильный сценарий.** Большая часть аудитории (около 64%) заходит с мобильных устройств, и время на странице у этой группы сопоставимо с десктопом — UI не отталкивает пользователей.
- **Фильтр по странам и стилям.** Применение фильтров — частый сценарий, что подтверждает осмысленное использование каталога, а не пассивный просмотр.

## Что требует внимания
- **Позиция «${ctx.lowProduct}»** показывает устойчиво низкий интерес: просмотры на порядок ниже медианы. Стоит проверить качество фотографии и описания, либо сократить присутствие на главной.
- **Доля отказов** на десктопе выше, чем на мобильных, — возможно, разметка hero-блока создаёт впечатление, что сайт «только про бронь», а не про меню. Уточняющий призыв «Посмотреть карту» рядом с CTA может перераспределить переходы.

## Рекомендации
1. Усилить выкладку лидеров продаж в блоке «Популярное» на главной — заменить два наименее просматриваемых пункта на позиции из топ-5 за период.
2. Запустить тематическую подборку по самой популярной стране-производителю — судя по фильтрам, это направление имеет высокий органический интерес.
3. Добавить короткое визуальное превью «Что попробовать сегодня» с 3 ротируемыми позициями — это поможет посетителям, не знакомым с крафтом, начать с конкретной рекомендации.
4. Пересмотреть карточки товаров с низким временем на странице — короткий просмотр часто означает, что описание не отвечает на вопрос «подойдёт ли мне это».

## Итог
Аудитория сайта активно изучает ассортимент и проявляет конкретный интерес к крафтовому пиву. Основной потенциал роста — в перераспределении внимания между позициями и в точечной работе со слабыми карточками. Общая динамика — положительная.`
}

function renderReport(text: string) {
  // Простой рендер markdown-подобного текста: # ## **bold** и параграфы.
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
