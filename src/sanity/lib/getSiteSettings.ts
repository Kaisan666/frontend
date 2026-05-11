import { cache } from "react"
import { client } from "./client"

export type SiteSettings = {
  address?: string
  workingHours?: {
    weekdays?: string
    weekends?: string
  }
  phone?: string
  socials?: {
    vk?: string
    telegram?: string
    whatsapp?: string
  }
  maps?: {
    yandex?: string
    twoGis?: string
    google?: string
  }
}

const QUERY = `*[_type == "siteSettings"][0]{
  address,
  workingHours,
  phone,
  socials,
  maps
}`

// Дефолты — на случай если документ ещё не создан в Studio.
// Сайт продолжит работать с этими значениями, без падения.
const DEFAULTS: SiteSettings = {
  address: "г. Краснодар, ул. Им. Яцкова, 17 к1",
  workingHours: {
    weekdays: "Пн–Пт: 14:00 – 23:00",
    weekends: "Сб–Вс: 11:00 – 23:00",
  },
  phone: "+7 (918) 186-96-00",
  socials: {
    vk: "https://vk.com",
    telegram: "https://t.me/shengenplus",
    whatsapp:
      "https://api.whatsapp.com/send/?phone=79181869600&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21",
  },
  maps: {
    yandex: "https://yandex.com/maps/-/CPS~zNni",
    twoGis: "https://2gis.ru/krasnodar/firm/70000001064246130",
  },
}

/**
 * Возвращает настройки сайта из Sanity. Заворачивает результат в `cache()`
 * (React Server Components memoization) — несколько вызовов внутри одного
 * рендера ходят к Sanity только один раз.
 *
 * Если документ siteSettings ещё не создан — возвращает дефолты.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const data = await client.fetch<SiteSettings | null>(
      QUERY,
      {},
      { next: { revalidate: 300 } }
    )
    if (!data) return DEFAULTS
    // Точечный merge: если в Studio заполнены только некоторые поля —
    // остальные подтянутся из дефолтов
    return {
      address: data.address ?? DEFAULTS.address,
      workingHours: { ...DEFAULTS.workingHours, ...(data.workingHours ?? {}) },
      phone: data.phone ?? DEFAULTS.phone,
      socials: { ...DEFAULTS.socials, ...(data.socials ?? {}) },
      maps: { ...DEFAULTS.maps, ...(data.maps ?? {}) },
    }
  } catch (err) {
    console.error("getSiteSettings failed, using defaults:", err)
    return DEFAULTS
  }
})

/**
 * Превращает «человеческий» формат телефона `+7 (918) 186-96-00`
 * в формат для `tel:`-ссылки `+79181869600`.
 */
export function phoneForTel(phone?: string): string {
  if (!phone) return ""
  return `tel:${phone.replace(/[^\d+]/g, "")}`
}
