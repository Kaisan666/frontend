"use client"

import { useEffect } from "react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ padding: "40px 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Ошибка в админке</h1>
      <p>{error.message || "Что-то пошло не так."}</p>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: 12,
          padding: "8px 16px",
          background: "#D65E12",
          color: "#FAF7EF",
          border: "none",
          cursor: "pointer",
        }}
      >
        Попробовать снова
      </button>
    </div>
  )
}
