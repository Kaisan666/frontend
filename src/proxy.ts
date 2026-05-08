import { NextRequest, NextResponse } from "next/server"

// HTTP Basic Auth для админ-дашборда статистики.
// Защищает и страницу /stats, и API /api/stats — иначе данные можно
// было бы получить напрямую через fetch без UI.
//
// В Next.js 16 файловая конвенция переименована: middleware.ts → proxy.ts,
// функция middleware() → proxy(). API остаётся прежним.

const REALM = "Shengen+ Stats"

export function proxy(req: NextRequest) {
  const user = process.env.STATS_USER
  const pass = process.env.STATS_PASSWORD

  // Без env-переменных доступ закрыт целиком — это безопасный дефолт.
  if (!user || !pass) {
    return new NextResponse(
      "Stats authentication is not configured. Set STATS_USER and STATS_PASSWORD env vars.",
      { status: 503 }
    )
  }

  const header = req.headers.get("authorization")
  if (!header?.startsWith("Basic ")) {
    return unauthorized()
  }

  let decoded: string
  try {
    decoded = atob(header.slice(6))
  } catch {
    return unauthorized()
  }

  const idx = decoded.indexOf(":")
  if (idx < 0) return unauthorized()
  const providedUser = decoded.slice(0, idx)
  const providedPass = decoded.slice(idx + 1)

  if (providedUser !== user || providedPass !== pass) {
    return unauthorized()
  }

  return NextResponse.next()
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  })
}

export const config = {
  matcher: ["/stats/:path*", "/api/stats/:path*"],
}
