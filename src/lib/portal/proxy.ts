import { loginZabbix } from "@/lib/portal/zabbix-auth"
import { loginInventory } from "@/lib/portal/inventory-auth"
import type { PortalEndpoint, PortalCredential } from "@/lib/portal/queries"

// ── Session cache (in-memory, best-effort — browser cookie is authoritative) ──
const SESSION_TTL_MS =
  (parseInt(process.env.PORTAL_SESSION_TTL ?? "1200", 10)) * 1000

type CachedSession = { cookie: string; expiresAt: number }
const sessionCache = new Map<string, CachedSession>()

function cacheKey(endpointId: string, userId: string | null): string {
  return `${endpointId}:${userId ?? "shared"}`
}

function getCachedCookie(key: string): string | null {
  const entry = sessionCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { sessionCache.delete(key); return null }
  return entry.cookie
}

function setCachedCookie(key: string, cookie: string) {
  sessionCache.set(key, { cookie, expiresAt: Date.now() + SESSION_TTL_MS })
}

function invalidateCache(key: string) { sessionCache.delete(key) }

// ── Auth upstream ─────────────────────────────────────────────────────────────
async function loginUpstream(endpoint: PortalEndpoint, cred: PortalCredential): Promise<string> {
  return endpoint.type === "zabbix"
    ? loginZabbix(endpoint.base_url, cred.username, cred.password)
    : loginInventory(endpoint.base_url, cred.username, cred.password)
}

export async function getUpstreamCookie(
  endpoint: PortalEndpoint,
  userId: string | null,
  cred: PortalCredential | null
): Promise<string | null> {
  if (endpoint.auth_mode === "none" || !cred) return null
  const key = cacheKey(endpoint.id, userId)
  const cached = getCachedCookie(key)
  if (cached) return cached
  const cookie = await loginUpstream(endpoint, cred)
  setCachedCookie(key, cookie)
  return cookie
}

// ── Headers ───────────────────────────────────────────────────────────────────
// Strip hop-by-hop transport headers + upstream framing headers.
// Upstream servers (Zabbix, IMS) may send X-Frame-Options or frame-ancestors CSP
// that would conflict with our same-origin proxy headers. We own those headers here.
const STRIP_RESPONSE_HEADERS = new Set([
  "content-encoding", "content-length", "transfer-encoding",
  "x-frame-options", "content-security-policy",
])

const STRIP_REQUEST_HEADERS = new Set([
  "host", "connection", "keep-alive", "upgrade", "te", "trailers",
  "transfer-encoding", "accept-encoding",
])

function rewriteSetCookie(raw: string, portalType: string): string {
  let rewritten = raw
    .replace(/Domain=[^;]+;?\s*/gi, "")
    .replace(/Path=[^;]*/gi, `Path=/portal/${portalType}`)
    .replace(/SameSite=[^;]*/gi, "SameSite=Lax")
  if (!/Secure/i.test(rewritten)) rewritten += "; Secure"
  if (!/HttpOnly/i.test(rewritten)) rewritten += "; HttpOnly"
  return rewritten
}

// ── HTML patching ─────────────────────────────────────────────────────────────
type PortalType = "zabbix" | "inventario" | string

function isLoginPage(html: string, type: PortalType): boolean {
  if (type === "zabbix") {
    return html.includes('name="enter"') &&
           html.includes('id="password"') &&
           html.includes('action="index.php"')
  }
  if (type === "inventario") {
    const hasLogin = html.includes('name="LOGIN"') || html.includes("name='LOGIN'")
    const hasPasswd = html.includes('name="PASSWD"') || html.includes("name='PASSWD'")
    return hasLogin && hasPasswd
  }
  return false
}

function injectOcsStyles(): string {
  // OCS Inventory NG 2.x = Bootstrap 3, layout de navbar superior (sin sidebar).
  // El navbar es el ÚNICO menú de navegación de OCS, así que NO se oculta:
  // sólo se quita la cromática redundante con el header de SIDEAS y se evita
  // que el usuario cierre la sesión OCS desde adentro del iframe (rompería el SSO).
  return `<style>
    /* ── OCS Inventory NG 2.x — modo embebido en iframe SIDEAS ── */

    /* Logo/brand de OCS: redundante con el header de SIDEAS */
    .navbar-brand.header-logo,
    .navbar-brand img,
    a.navbar-brand { display: none !important; }

    /* Cerrar sesión: lo gestiona SIDEAS, no debe romper el SSO desde el iframe */
    a[href*="logoff"],
    a[href*="logout"],
    li#logoff,
    .logoff { display: none !important; }

    /* Footer con versión de OCS */
    footer, .footer, #footer, .footer_text { display: none !important; }

    /* Reset de márgenes para que el contenido ocupe todo el iframe */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff;
      overflow-x: hidden;
      overflow-y: auto !important;
    }

    /* Navbar fijo (algunos temas usan navbar-fixed-top) → que no tape el contenido */
    body.navbar-fixed { padding-top: 0 !important; }

    /* Apretar el contenedor principal al ancho del iframe */
    .container-fluid { padding-left: 12px !important; padding-right: 12px !important; }
    #fwk_content, .main_content { margin: 0 !important; }
  </style>`
}

function patchHtml(html: string, endpoint: PortalEndpoint, cred?: PortalCredential | null): string {
  const portalPath = `/portal/${endpoint.type}`
  const upstreamSubpath = new URL(endpoint.base_url).pathname.replace(/\/$/, "")

  let out = html

  void cred

  try {
    const origin = new URL(endpoint.base_url).origin
    if (upstreamSubpath) out = out.split(`${origin}${upstreamSubpath}`).join(portalPath)
    out = out.split(`${origin}/`).join(`${portalPath}/`)
    out = out.replace(new RegExp(origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[\"' ])", "g"), portalPath)
  } catch { /* ignore */ }

  if (upstreamSubpath) {
    out = out.split(`${upstreamSubpath}/`).join(`${portalPath}/`)
    out = out.split(`${upstreamSubpath}"`).join(`${portalPath}"`)
    out = out.split(`${upstreamSubpath}'`).join(`${portalPath}'`)
  }

  const base = `<base href="${portalPath}/">`
  out = out.replace(/(<head[^>]*>)/i, `$1${base}`)

  if (endpoint.type === "inventario") {
    out = out.replace(/(<\/head>)/i, `${injectOcsStyles()}$1`)
  }

  return out
}

// ── Main proxy ────────────────────────────────────────────────────────────────
export async function proxyRequest({
  endpoint,
  upstreamPath,
  request,
  cookie,
  userId,
  cred,
}: {
  endpoint: PortalEndpoint
  upstreamPath: string
  request: Request
  cookie: string | null
  userId: string | null
  cred: PortalCredential | null
}): Promise<Response> {
  const reqUrl = new URL(request.url)
  const targetUrl = `${endpoint.base_url}${upstreamPath}${reqUrl.search}`

  // Build forward headers
  const forwardHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (!STRIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value
    }
  })
  forwardHeaders["accept-encoding"] = "identity"
  if (endpoint.type === "inventario" || endpoint.type === "zabbix") {
    forwardHeaders["accept-language"] = "es-AR,es;q=0.9"
  }

  // Cookie strategy:
  // - If the browser already has a session cookie for this portal, prefer it.
  //   It was set on a previous authenticated request and is stored at the right path.
  // - Only fall back to server-side login cookie when the browser has none.
  const browserCookies = request.headers.get("cookie") ?? ""
  const sessionCookieName = endpoint.type === "zabbix" ? "zbx_session" : "PHPSESSID"
  const browserHasSession = browserCookies.includes(`${sessionCookieName}=`)

  if (!browserHasSession && cookie) {
    forwardHeaders["cookie"] = cookie
  }
  // else: browser cookies already in forwardHeaders from forEach above

  const fetchOptions: RequestInit = {
    method: request.method,
    headers: forwardHeaders,
    redirect: "manual",
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    // @ts-expect-error — Node fetch supports duplex
    duplex: "half",
  }

  let upstreamRes: Response
  try {
    upstreamRes = await fetch(targetUrl, fetchOptions)
  } catch {
    return new Response(upstreamDownHtml(), {
      status: 502,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  // 401 or redirect-to-login → invalidate cache and retry once with fresh session
  const location = upstreamRes.headers.get("location") ?? ""
  const isAuthFailure =
    upstreamRes.status === 401 ||
    (upstreamRes.status >= 300 && upstreamRes.status < 400 && location.includes("login"))

  if (isAuthFailure && cred && userId !== undefined) {
    const key = cacheKey(endpoint.id, userId)
    invalidateCache(key)
    try {
      const newCookie = await loginUpstream(endpoint, cred)
      setCachedCookie(key, newCookie)
      forwardHeaders["cookie"] = newCookie
      upstreamRes = await fetch(targetUrl, { ...fetchOptions, headers: forwardHeaders })
    } catch { /* serve original response */ }
  }

  // Build response headers
  const responseHeaders = new Headers()
  const upstreamOrigin = new URL(endpoint.base_url).origin
  const upstreamSubpathForRedirect = new URL(endpoint.base_url).pathname.replace(/\/$/, "")
  const portalPathForRedirect = `/portal/${endpoint.type}`

  upstreamRes.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (STRIP_RESPONSE_HEADERS.has(lower)) return
    if (lower === "set-cookie") {
      responseHeaders.append(key, rewriteSetCookie(value, endpoint.type))
      return
    }
    if (lower === "location") {
      // Rewrite redirect Location so the browser stays within the proxy
      let loc = value
      if (upstreamSubpathForRedirect) loc = loc.split(`${upstreamOrigin}${upstreamSubpathForRedirect}`).join(portalPathForRedirect)
      loc = loc.split(`${upstreamOrigin}/`).join(`${portalPathForRedirect}/`)
      if (upstreamSubpathForRedirect) loc = loc.split(`${upstreamSubpathForRedirect}/`).join(`${portalPathForRedirect}/`)
      responseHeaders.set(key, loc)
      return
    }
    responseHeaders.set(key, value)
  })

  // If we used a server-side login cookie and the upstream didn't send Set-Cookie,
  // inject it so the browser stores it for future sub-resource requests.
  if (!browserHasSession && cookie) {
    if (endpoint.type === "zabbix") {
      const zbxPart = cookie.split("; ").find(c => c.startsWith("zbx_session="))
      if (zbxPart) {
        const alreadySet = responseHeaders.getSetCookie?.().some(c => c.startsWith("zbx_session="))
        if (!alreadySet) {
          responseHeaders.append("set-cookie",
            `${zbxPart}; Path=/portal/${endpoint.type}; SameSite=Lax; HttpOnly`)
        }
      }
    } else if (endpoint.type === "inventario") {
      const phpPart = cookie.split("; ").find(c => c.startsWith("PHPSESSID="))
      if (phpPart) {
        const alreadySet = responseHeaders.getSetCookie?.().some(c => c.startsWith("PHPSESSID="))
        if (!alreadySet) {
          responseHeaders.append("set-cookie",
            `${phpPart}; Path=/portal/${endpoint.type}; SameSite=Lax; HttpOnly; Secure`)
        }
      }
    }
  }

  const contentType = upstreamRes.headers.get("content-type") ?? ""
  const isHtml = contentType.includes("text/html")

  if (isHtml) {
    const html = await upstreamRes.text()

    // OCS puede devolver 200 con la página de login cuando la sesión expiró.
    // En ese caso, forzamos un re-login server-side y reintentamos una sola vez.
    if (endpoint.type === "inventario" && isLoginPage(html, "inventario") && cred && userId !== undefined) {
      const key = cacheKey(endpoint.id, userId)
      invalidateCache(key)
      try {
        const newCookie = await loginUpstream(endpoint, cred)
        setCachedCookie(key, newCookie)
        forwardHeaders["cookie"] = newCookie
        const retryRes = await fetch(targetUrl, { ...fetchOptions, headers: forwardHeaders })
        const retryHtml = await retryRes.text()
        const phpPart = newCookie.split("; ").find(c => c.startsWith("PHPSESSID="))
        if (phpPart) responseHeaders.set("set-cookie",
          `${phpPart}; Path=/portal/${endpoint.type}; SameSite=Lax; HttpOnly`)
        return new Response(patchHtml(retryHtml, endpoint, cred),
          { status: retryRes.status, headers: responseHeaders })
      } catch { /* fall through to serve original */ }
    }

    const patched = patchHtml(html, endpoint, cred)
    return new Response(patched, { status: upstreamRes.status, headers: responseHeaders })
  }

  return new Response(upstreamRes.body, { status: upstreamRes.status, headers: responseHeaders })
}

function upstreamDownHtml(): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Portal no disponible</title></head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc">
  <div style="text-align:center;max-width:400px;padding:2rem">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" stroke-width="1.5" style="margin:0 auto 1rem">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
    </svg>
    <h1 style="font-size:1.25rem;font-weight:700;color:#1e293b;margin:0 0 .5rem">Portal en mantenimiento</h1>
    <p style="color:#64748b;font-size:.875rem;margin:0">Estamos trabajando para restablecerlo. Por favor, intentá más tarde.</p>
  </div>
</body>
</html>`
}
