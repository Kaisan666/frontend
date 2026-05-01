'use client'
import { useEffect, useState } from 'react'

interface Stat {
  name: string
  category: string
  views: number
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
  }, [])

  return (
    <div>
      <h1>Топ товаров за 30 дней</h1>
      <table>
        <thead>
          <tr>
            <th>Товар</th>
            <th>Категория</th>
            <th>Просмотры</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(s => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.category}</td>
              <td>{s.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}