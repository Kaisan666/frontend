import { randomUUID } from "node:crypto"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { Agent, fetch as undiciFetch } from "undici"

// Sber GigaChat — серверный клиент.
//
// Доки: https://developers.sber.ru/docs/ru/gigachat/api/overview
//
// Авторизация — двухшаговая:
//  1. Получаем access_token через OAuth (Basic <base64(client_id:client_secret)>)
//  2. Используем токен в Bearer-заголовке для chat/completions
//
// Токен живёт 30 минут — кэшируем в памяти процесса, обновляем по таймауту.

const AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
const CHAT_URL = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"

// SSL nuance: GigaChat использует Russian Trusted Root CA (минцифры).
// Если Node не доверяет цепочке — fetch падает с self-signed cert error.
// Workaround: подкладываем сертификат минцифры в undici Agent и ходим undici
// fetch-ом (не Next-патченый глобальный fetch — тот не всегда прокидывает
// опцию `dispatcher`). Сам сертификат публичный, не секрет.
//
// Сертификат отдаём одним из двух способов (приоритет у inline-переменной):
//  1. GIGA_CHAT_CA_CERT — сам PEM-текст в env. Нужен для serverless (Vercel),
//     где нет постоянной ФС, а gitignore-нутый .pem в бандл не попадает.
//  2. GIGA_CHAT_CA_PATH — путь к .pem-файлу. Удобно локально и на VPS.

let cachedDispatcher: Agent | null | undefined

function loadCaBundle(): string | null {
  const inline = process.env.GIGA_CHAT_CA_CERT
  if (inline && inline.trim()) {
    console.log(`[gigachat] CA-bundle из GIGA_CHAT_CA_CERT (${inline.length} байт)`)
    return inline
  }

  const caPath = process.env.GIGA_CHAT_CA_PATH
  if (!caPath) {
    console.warn(
      "[gigachat] ни GIGA_CHAT_CA_CERT, ни GIGA_CHAT_CA_PATH не заданы — используется системный TLS"
    )
    return null
  }

  const absolutePath = resolve(process.cwd(), caPath)
  if (!existsSync(absolutePath)) {
    console.error(`[gigachat] файл сертификата не найден: ${absolutePath}`)
    return null
  }

  try {
    const ca = readFileSync(absolutePath, "utf-8")
    console.log(`[gigachat] загружен CA-bundle из файла: ${absolutePath} (${ca.length} байт)`)
    return ca
  } catch (e) {
    console.error("[gigachat] не удалось прочитать файл сертификата:", e)
    return null
  }
}

function getDispatcher(): Agent | null {
  if (cachedDispatcher !== undefined) return cachedDispatcher

  const ca = loadCaBundle()
  if (!ca) {
    cachedDispatcher = null
    return null
  }

  try {
    cachedDispatcher = new Agent({ connect: { ca } })
    return cachedDispatcher
  } catch (e) {
    console.error("[gigachat] не удалось инициализировать dispatcher:", e)
    cachedDispatcher = null
    return null
  }
}

// ---- Token cache ----

type CachedToken = { accessToken: string; expiresAt: number }
let tokenCache: CachedToken | null = null

async function fetchAccessToken(): Promise<string> {
  const authKey = process.env.GIGA_CHAT_AUTH_KEY
  if (!authKey) {
    throw new Error("GIGA_CHAT_AUTH_KEY is not set")
  }

  const scope = process.env.GIGA_CHAT_SCOPE ?? "GIGACHAT_API_PERS"
  const dispatcher = getDispatcher()

  const response = await undiciFetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      RqUID: randomUUID(),
      Authorization: `Basic ${authKey}`,
    },
    body: new URLSearchParams({ scope }).toString(),
    ...(dispatcher ? { dispatcher } : {}),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`GigaChat auth failed: ${response.status} ${text}`)
  }

  const data = (await response.json()) as { access_token: string; expires_at: number }
  return data.access_token
}

async function getAccessToken(): Promise<string> {
  // Кешируем с запасом — обновляем за минуту до фактического expires_at.
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken
  }
  const accessToken = await fetchAccessToken()
  // GigaChat возвращает expires_at в ms; на всякий случай страхуемся 25-мин TTL.
  tokenCache = { accessToken, expiresAt: Date.now() + 25 * 60_000 }
  return accessToken
}

// ---- Chat completion ----

export type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export type ChatCompletionOptions = {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  topP?: number
  maxTokens?: number
}

export type ChatCompletionResult = {
  content: string
  // Фактическая модель, которой сгенерирован ответ — чтобы вызывающий код
  // мог сохранить честное имя в историю, а не догадываться по дефолту.
  model: string
}

export async function chatCompletion(
  options: ChatCompletionOptions
): Promise<ChatCompletionResult> {
  const accessToken = await getAccessToken()
  const dispatcher = getDispatcher()

  // Приоритет: явный параметр в вызове → env-переменная → дефолт.
  // GigaChat-2 — базовая модель нового поколения, лучшее качество.
  // Тарифицируется в основной квоте 1M токенов/год.
  const model = options.model ?? process.env.GIGA_CHAT_MODEL ?? "GigaChat-2"

  const response = await undiciFetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.6,
      // top_p 0.5 — режем длинный хвост маловероятных токенов, оставляем
      // только «здравомыслящий» спектр. Хорошо для аналитических отчётов.
      top_p: options.topP ?? 0.5,
      max_tokens: options.maxTokens ?? 1500,
    }),
    ...(dispatcher ? { dispatcher } : {}),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`GigaChat completion failed: ${response.status} ${text}`)
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[]
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("GigaChat returned empty completion")
  }
  return { content: content.trim(), model }
}
