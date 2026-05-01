import { supabase } from '@/lib/supabase'

export async function GET() {
  // данные за последние 30 дней
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('product_stats')
    .select('*')
    .gte('date', thirtyDaysAgo)

  if (error) return Response.json({ error }, { status: 500 })

  // суммируем просмотры по товарам за период
  const totals: Record<string, { views: number, category: string }> = {}

  data.forEach(row => {
    if (!totals[row.product_name]) {
      totals[row.product_name] = { views: 0, category: row.category }
    }
    totals[row.product_name].views += row.views
  })

  const sorted = Object.entries(totals)
    .map(([name, info]) => ({ name, ...info }))
    .sort((a, b) => b.views - a.views)

  return Response.json(sorted)
}                                                                                                                                                                           