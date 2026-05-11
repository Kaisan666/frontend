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

type Datum = { name: string; category: string; views: number }

export const TopProductsChart = ({ data }: { data: Datum[] }) => {
  if (data.length === 0) {
    return <p style={{ opacity: 0.6 }}>Нет данных за выбранный период</p>
  }

  // Обрезаем длинные названия чтобы уместились на оси
  const chartData = data.map((d) => ({
    ...d,
    short: d.name.length > 18 ? d.name.slice(0, 16) + "…" : d.name,
  }))

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E3E1DA" />
          <XAxis type="number" stroke="#341212" tick={{ fontSize: 12 }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="short"
            stroke="#341212"
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip
            labelFormatter={(label, payload) =>
              (payload?.[0]?.payload?.name as string | undefined) ?? String(label ?? "")
            }
            contentStyle={{
              background: "#FAF7EF",
              border: "1px solid #E3E1DA",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="views" fill="#D65E12" radius={[0, 6, 6, 0]} name="Просмотры" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
