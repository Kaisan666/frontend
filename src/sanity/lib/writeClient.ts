import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Серверный клиент с write-токеном. Используется только в API-роутах для записи
// (например, отправка отзывов как draft). Никогда не должен импортироваться
// в client components — токен серверный.
//
// Токен создаётся в Sanity Manage → API → Tokens, права — Editor.
// Положить в .env.local как SANITY_API_WRITE_TOKEN (без NEXT_PUBLIC_).
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
