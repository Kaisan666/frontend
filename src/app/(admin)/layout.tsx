import "@/styles/_reset.scss"
import "@/styles/index.scss"

export const metadata = {
  title: "Админ-панель — Shengen+",
  description: "Внутренняя статистика и управление",
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body style={{ background: "#FAF7EF", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  )
}
