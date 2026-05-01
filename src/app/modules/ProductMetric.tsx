'use client'
import { useEffect } from 'react'

interface Props {
  name: string
  category: string
  price: number
}

export default function ProductTracker({ name, category, price }: Props) {
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, price })
    })
  }, [name, category, price])

  return null
}