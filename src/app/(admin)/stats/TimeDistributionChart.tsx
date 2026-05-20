"use client"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type Datum = { bucket: string; count: number }

const BUCKET_LABELS: Record<string, string> = {
  "<10s": "< 10 сек",
  "10-30s": "10–30 сек",
  "30-60s": "30–60 сек",
  "1-3min": "1–3 мин",
  "3-5min": "3–5 мин",
  ">5min": "> 5 мин",
}

export const TimeDistributionChart = ({ data }: { data: Datum[] }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  if (total === 0) {
    return <p style={{ opacity: 0.6 }}>Нет данных за выбранный период</p>
  }

  const chartData = data.map((d) => ({
    label: BUCKET_LABELS[d.bucket] ?? d.bucket,
    count: d.count,
  }))

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E3E1DA" />
          <XAxis dataKey="label" stroke="#341212" tick={{ fontSize: 12 }} />
          <YAxis stroke="#341212" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "#FAF7EF",
              border: "1px solid #E3E1DA",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="count" fill="#D65E12" radius={[6, 6, 0, 0]} name="Сессий" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
