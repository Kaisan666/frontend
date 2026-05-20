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

type Datum = { key: string; value: string; count: number }

// Человеческие подписи для фильтров каталога
const KEY_LABELS: Record<string, string> = {
  category: "Категория",
  country: "Страна",
  style: "Стиль",
  abv: "ABV",
  ibu: "IBU",
  minPrice: "Цена от",
  maxPrice: "Цена до",
}

const VALUE_LABELS: Record<string, Record<string, string>> = {
  category: {
    beer: "Пиво",
    food: "Еда",
    other: "Другое",
  },
}

function labelize(d: Datum): string {
  const keyLabel = KEY_LABELS[d.key] ?? d.key
  const valueLabel = VALUE_LABELS[d.key]?.[d.value] ?? d.value
  return `${keyLabel}: ${valueLabel}`
}

export const FiltersChart = ({ data }: { data: Datum[] }) => {
  if (data.length === 0) {
    return (
      <p style={{ opacity: 0.6 }}>
        Пока никто не пользовался фильтрами каталога
      </p>
    )
  }

  const chartData = data.map((d) => ({
    full: labelize(d),
    short: labelize(d).length > 22 ? labelize(d).slice(0, 20) + "…" : labelize(d),
    count: d.count,
  }))

  return (
    <div style={{ width: "100%", height: Math.max(220, chartData.length * 28) }}>
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
            width={140}
          />
          <Tooltip
            labelFormatter={(label, payload) =>
              (payload?.[0]?.payload?.full as string | undefined) ?? String(label ?? "")
            }
            contentStyle={{
              background: "#FAF7EF",
              border: "1px solid #E3E1DA",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="count" fill="#C25917" radius={[0, 6, 6, 0]} name="Применений" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
