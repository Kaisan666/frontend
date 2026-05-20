import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: false — потому что используем `next.revalidate` (ISR) в layout и
  // других местах. С `useCdn: true` Sanity CDN кэширует ответы на своей стороне,
  // и Next-ревалидация не подхватывает свежие данные вовремя.
  useCdn: false,
})
