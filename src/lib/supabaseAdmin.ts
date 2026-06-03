import "server-only"
import { createClient } from "@supabase/supabase-js"

// Серверный Supabase-клиент на service-role ключе. Обходит RLS — используется
// ТОЛЬКО в серверных ручках для приватных таблиц (events_log, ai_reports).
//
// НИКОГДА не импортировать в клиентские компоненты: `import "server-only"`
// превращает такой импорт в билд-ошибку, чтобы секретный ключ не утёк в
// браузерный бандл. Публичные данные (RPC popular_products) по-прежнему идут
// через анонимный клиент `@/lib/supabase`.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set")
}
if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY не задан — серверные ручки (/api/track, /api/stats, " +
      "/api/ai-reports, /api/generate-report) не смогут работать. Возьми ключ в " +
      "Supabase → Project Settings → API → service_role и добавь в .env.local (и в env хостинга)."
  )
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
