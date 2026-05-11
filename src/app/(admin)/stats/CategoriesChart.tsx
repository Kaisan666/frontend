"use client"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

type Datum = { category: string; views: number }

const CATEGORY_LABELS: Record<string, string> = {
  beer: "Пиво",
  food: "Еда",
  other: "Другое",
}

const COLORS = ["#D65E12", "#DFBE37", "#341212", "#C25917", "#E3E1DA"]

export const CategoriesChart = ({ data }: { data: Datum[] }) => {
  if (data.length === 0) {
    return <p style={{ opacity: 0.6 }}>Нет данных за выбранный период</p>
  }

  const chartData = data.map((d) => ({
    name: CATEGORY_LABELS[d.category] ?? d.category,
    value: d.views,
  }))

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#FAF7EF",
              border: "1px solid #E3E1DA",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
