import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

// Список истории сгенерированных ИИ-отчётов. Защищён proxy.ts.
// Возвращает максимум 50 последних отчётов — для дашборда хватит за глаза.

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("ai_reports")
    .select("id, period, period_from, period_to, content, model_name, generated_at")
    .order("generated_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[api/ai-reports] select failed:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const reports = (data ?? []).map((r) => ({
    id: r.id as string,
    period: r.period as "day" | "week" | "month",
    periodFrom: r.period_from as string,
    periodTo: r.period_to as string,
    content: r.content as string,
    modelName: r.model_name as string,
    generatedAt: r.generated_at as string,
  }))

  return NextResponse.json({ reports })
}
