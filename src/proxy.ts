import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"
import { isAdminEmail } from "@/lib/admin"
import { isAsistenteEmail } from "@/lib/asistente/allowlist"
import { estadoMfa, loginParaRuta, sanitizarNext } from "@/lib/mfa"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas (marketing): delega en next-intl para locale detection/redirect
  if (pathname === "/" || pathname.startsWith("/es")) {
    return handleI18nRouting(request)
  }

  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect que conserva las cookies de sesión refrescadas por getUser()
  const redirigir = (url: URL) => {
    const res = NextResponse.redirect(url)
    response.cookies.getAll().forEach((c) => res.cookies.set(c))
    return res
  }

  // Pantallas de 2FA: requieren sesión (AAL1); si ya está en AAL2 vuelven al destino
  if (pathname.startsWith("/2fa")) {
    const next = sanitizarNext(request.nextUrl.searchParams.get("next"))
    if (!user) return redirigir(new URL(loginParaRuta(next), request.url))
    const estado = await estadoMfa(supabase)
    if (estado === "ok") return redirigir(new URL(next, request.url))
    const destino = `/2fa/${estado}`
    if (pathname !== destino) {
      const url = new URL(destino, request.url)
      url.searchParams.set("next", next)
      return redirigir(url)
    }
    return response
  }

  // Rutas protegidas sin sesión → login
  if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/portal"))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  // Usuarios de portal no pueden acceder al panel admin
  if (user && pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAdminEmail(user.email)) {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = "/dashboard"
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Módulo Asistente Personal: sin sesión → login propio
  if (!user && pathname.startsWith("/asistente") && !pathname.startsWith("/asistente/login")) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/asistente/login"
    return NextResponse.redirect(loginUrl)
  }

  // Allowlist separada del admin de SIDEAS — es de uso exclusivo de Mati
  if (user && pathname.startsWith("/asistente") && !pathname.startsWith("/asistente/login")) {
    if (!isAsistenteEmail(user.email)) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/asistente/login"
      return NextResponse.redirect(loginUrl)
    }
  }

  // 2FA obligatorio en toda zona privada
  const zonaPrivada =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/portal") ||
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
    (pathname.startsWith("/asistente") && !pathname.startsWith("/asistente/login"))

  if (user && zonaPrivada) {
    const estado = await estadoMfa(supabase)
    if (estado !== "ok") {
      const url = new URL(`/2fa/${estado}`, request.url)
      url.searchParams.set("next", pathname + request.nextUrl.search)
      return redirigir(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/",
    "/(es)/:path*",
    "/dashboard/:path*",
    "/portal/:path*",
    "/admin/:path*",
    "/asistente/:path*",
    "/2fa/:path*",
  ],
}
