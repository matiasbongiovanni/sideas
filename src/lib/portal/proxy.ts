import { loginZabbix } from "@/lib/portal/zabbix-auth"
import { loginInventory } from "@/lib/portal/inventory-auth"
import type { PortalEndpoint, PortalCredential } from "@/lib/portal/queries"

// ── Session cache ────────────────────────────────────────────────────────────
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
  if (Date.now() > entry.expiresAt) {
    sessionCache.delete(key)
    return null
  }
  return entry.cookie
}

function setCachedCookie(key: string, cookie: string) {
  sessionCache.set(key, { cookie, expiresAt: Date.now() + SESSION_TTL_MS })
}

function invalidateCache(key: string) {
  sessionCache.delete(key)
}

// ── Auth upstream ────────────────────────────────────────────────────────────
async function loginUpstream(
  endpoint: PortalEndpoint,
  cred: PortalCredential
): Promise<string> {
  if (endpoint.type === "zabbix") {
    return loginZabbix(endpoint.base_url, cred.username, cred.password)
  }
  return loginInventory(endpoint.base_url, cred.username, cred.password)
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

// ── Headers to strip/rewrite ─────────────────────────────────────────────────
const STRIP_RESPONSE_HEADERS = new Set([
  "x-frame-options",
  "strict-transport-security",
  "content-security-policy",
  "x-content-type-options",
  // Stripped for HTML responses since we decompress+modify the body
  "content-encoding",
  "content-length",
  "transfer-encoding",
])

const STRIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "upgrade",
  "te",
  "trailers",
  "transfer-encoding",
  // Force uncompressed response so the proxy can read and modify HTML
  "accept-encoding",
])

function rewriteSetCookie(raw: string, portalType: string): string {
  return raw
    .replace(/Domain=[^;]+;?\s*/gi, "")
    .replace(/Path=[^;]*/gi, `Path=/portal/${portalType}`)
    .replace(/SameSite=[^;]*/gi, "SameSite=Lax")
}

function patchHtml(html: string, endpoint: PortalEndpoint): string {
  const portalPath = `/portal/${endpoint.type}`
  // Extract the upstream subpath (e.g. "/ocsreports" from the base_url)
  const upstreamSubpath = new URL(endpoint.base_url).pathname.replace(/\/$/, "")

  let out = html

  // 1. Replace full origin references: https://upstream-host/subpath → /portal/type
  try {
    const origin = new URL(endpoint.base_url).origin
    out = out.split(`${origin}${upstreamSubpath}`).join(portalPath)
    out = out.split(origin).join("")
  } catch { /* ignore */ }

  // 2. Replace absolute subpath references: /ocsreports/ → /portal/type/
  if (upstreamSubpath) {
    out = out.split(`${upstreamSubpath}/`).join(`${portalPath}/`)
    out = out.split(`${upstreamSubpath}"`).join(`${portalPath}"`)
    out = out.split(`${upstreamSubpath}'`).join(`${portalPath}'`)
  }

  // 3. Inject base tag for remaining relative paths
  const base = `<base href="${portalPath}/">`
  out = out.replace(/(<head[^>]*>)/i, `$1${base}`)

  return out
}

// ── Main proxy ───────────────────────────────────────────────────────────────
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
  const targetUrl = `${endpoint.base_url}${upstreamPath}${
    request.url.includes("?") ? "?" + request.url.split("?")[1] : ""
  }`

  // Forward headers (strip hop-by-hop + host)
  const forwardHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (!STRIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value
    }
  })
  forwardHeaders["accept-encoding"] = "identity"
  if (cookie) forwardHeaders["cookie"] = cookie

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

  // Si upstream devuelve 401 o redirige al login → re-autenticar una vez
  const isAuthFailure =
    upstreamRes.status === 401 ||
    (upstreamRes.status >= 300 &&
      upstreamRes.status < 400 &&
      (upstreamRes.headers.get("location") ?? "").includes("login"))

  if (isAuthFailure && cred && userId !== undefined) {
    const key = cacheKey(endpoint.id, userId)
    invalidateCache(key)
    try {
      const newCookie = await loginUpstream(endpoint, cred)
      setCachedCookie(key, newCookie)
      forwardHeaders["cookie"] = newCookie
      upstreamRes = await fetch(targetUrl, { ...fetchOptions, headers: forwardHeaders })
    } catch {
      // Re-auth falló — devolver la respuesta original
    }
  }

  // Construir headers de respuesta
  const responseHeaders = new Headers()
  upstreamRes.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (STRIP_RESPONSE_HEADERS.has(lower)) return
    if (lower === "set-cookie") {
      responseHeaders.append(key, rewriteSetCookie(value, endpoint.type))
      return
    }
    responseHeaders.set(key, value)
  })

  const contentType = upstreamRes.headers.get("content-type") ?? ""
  const isHtml = contentType.includes("text/html")

  if (isHtml) {
    const html = await upstreamRes.text()
    const patched = patchHtml(html, endpoint)
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
