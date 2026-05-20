"use client"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

type Devices = {
  mobile: number
  tablet: number
  desktop: number
}

const LABELS: Record<keyof Devices, string> = {
  mobile: "Мобильные",
  tablet: "Планшеты",
  desktop: "Десктоп",
}

const COLORS = ["#D65E12", "#DFBE37", "#341212"]

export const DevicesChart = ({ data }: { data: Devices }) => {
  const total = data.mobile + data.tablet + data.desktop
  if (total === 0) {
    return <p style={{ opacity: 0.6 }}>Нет данных за выбранный период</p>
  }

  const chartData = (Object.keys(data) as (keyof Devices)[])
    .map((key) => ({ name: LABELS[key], value: data[key] }))
    .filter((d) => d.value > 0)

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
