import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { writeClient } from "@/sanity/lib/writeClient"

// Минимально допустимое время от mount формы до отправки.
// Боты обычно сабмитят форму мгновенно — три секунды отсекают самых тупых.
const MIN_FILL_TIME_MS = 3000

type Body = {
  authorName?: unknown
  text?: unknown
  website?: unknown // honeypot — поле скрыто на фронте, человек его не заполняет
  formMountedAt?: unknown // ms-timestamp, проставляется на клиенте при mount
}

function isString(v: unknown): v is string {
  return typeof v === "string"
}

export async function POST(req: Request) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    // Сервер не настроен — не отдаём наружу детали, просто 503.
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Honeypot — если заполнено, молча принимаем (бот думает, что прокатило).
  if (isString(body.website) && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  // Time check — форма должна была лежать на странице минимум MIN_FILL_TIME_MS.
  if (typeof body.formMountedAt === "number") {
    const elapsed = Date.now() - body.formMountedAt
    if (elapsed < MIN_FILL_TIME_MS) {
      // Не выдаём, что это анти-бот фильтр — притворяемся, что всё ок.
      return NextResponse.json({ ok: true })
    }
  }

  const authorName = isString(body.authorName) ? body.authorName.trim() : ""
  const text = isString(body.text) ? body.text.trim() : ""

  if (authorName.length < 2 || authorName.length > 60) {
    return NextResponse.json(
      { error: "Имя должно быть от 2 до 60 символов" },
      { status: 400 },
    )
  }
  if (text.length < 10 || text.length > 1000) {
    return NextResponse.json(
      { error: "Отзыв должен быть от 10 до 1000 символов" },
      { status: 400 },
    )
  }

  try {
    // Создаём как draft — _id с префиксом `drafts.` Sanity трактует как черновик.
    // Черновики не попадают в публичные GROQ-запросы. Владелец одобряет нажатием
    // Publish в Studio.
    await writeClient.create({
      _id: `drafts.${randomUUID()}`,
      _type: "review",
      authorName,
      text,
      submittedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[api/reviews] write failed", error)
    return NextResponse.json(
      { error: "Не удалось сохранить отзыв. Попробуй ещё раз позже." },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
