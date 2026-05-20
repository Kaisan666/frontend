// Утилиты для работы с датами в MSK-таймзоне.
//
// Сервер обычно работает в UTC (особенно serverless-окружения вроде Vercel/Edge).
// Если просто делать `new Date().toISOString().split("T")[0]`, получаем UTC-дату
// — это значит событие в 23:30 МСК (= 20:30 UTC) уйдёт под текущим днём,
// а событие в 01:00 МСК (= 22:00 UTC предыдущего дня) уедет на «вчера».
// Для пивного бара в Краснодаре (UTC+3) это будет рассинхрон до 3 часов.
//
// Используем `Intl.DateTimeFormat` с `timeZone: 'Europe/Moscow'` —
// это самый надёжный способ получить дату в нужной таймзоне.

const MSK_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Moscow",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

/**
 * Возвращает дату в формате `YYYY-MM-DD` по московскому времени.
 * По умолчанию — текущая дата.
 */
export function mskDate(d: Date = new Date()): string {
  return MSK_FORMATTER.format(d)
}

/**
 * Дата N дней назад по МСК в формате `YYYY-MM-DD`.
 * `daysAgo(0)` — сегодня, `daysAgo(1)` — вчера, и т.д.
 */
export function mskDateDaysAgo(daysAgo: number): string {
  const now = Date.now()
  const offsetMs = daysAgo * 24 * 60 * 60 * 1000
  return mskDate(new Date(now - offsetMs))
}
