"use client"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type Datum = { date: string; views: number }

const formatDate = (iso: unknown): string => {
  // 2026-05-08 → 8 мая
  if (typeof iso !== "string") return String(iso ?? "")
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    })
  } catch {
    return iso
  }
}

export const ViewsByDayChart = ({ data }: { data: Datum[] }) => {
  if (data.length === 0) {
    return <p style={{ opacity: 0.6 }}>Нет данных за выбранный период</p>
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E3E1DA" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#341212"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#341212" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            labelFormatter={formatDate}
            contentStyle={{
              background: "#FAF7EF",
              border: "1px solid #E3E1DA",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#D65E12"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#D65E12" }}
            activeDot={{ r: 6 }}
            name="Просмотры"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
