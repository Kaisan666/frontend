import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Shengen+ — пивной бар в Краснодаре"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #341212 0%, #1E1312 60%, #D65E12 130%)",
          color: "#FAF7EF",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#D65E12",
            display: "flex",
          }}
        >
          SHENGEN+
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            marginTop: 24,
            opacity: 0.95,
            display: "flex",
          }}
        >
          Пивной бар в Краснодаре
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            marginTop: 28,
            opacity: 0.75,
            display: "flex",
          }}
        >
          150+ сортов · 18 стран · открыты каждый день
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
