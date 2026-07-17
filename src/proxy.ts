import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"
import { isAdminEmail } from "@/lib/admin"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas (marketing): delega en next-intl para locale detection/redirect
  if (pathname === "/" || pathname.startsWith("/es") || pathname.startsWith("/en")) {
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

  return response
}

export const config = {
  matcher: [
    "/",
    "/(es|en)/:path*",
    "/dashboard/:path*",
    "/portal/:path*",
    "/admin/:path*",
  ],
}
