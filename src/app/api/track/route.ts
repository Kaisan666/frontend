import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { name, category, price } = await request.json()

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase.rpc('increment_view', {
      p_name: name,
      p_category: category,
      p_price: price,
      p_date: today
    })

    if (error) throw error

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}