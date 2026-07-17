import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getEndpointForRequest, getCredential } from "@/lib/portal/queries"
import { getUpstreamCookie, proxyRequest } from "@/lib/portal/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Params = { type: string; path?: string[] }

async function handler(
  request: NextRequest,
  ctx: { params: Promise<Params> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { type, path } = await ctx.params

  const endpoint = await getEndpointForRequest(user.id, type)
  if (!endpoint) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const cred = await getCredential(user.id, endpoint)

  // Skip server-side login if the browser already has an upstream session cookie.
  // This avoids running loginUpstream for every CSS/JS/image sub-resource request.
  const sessionCookieName = type === "zabbix" ? "zbx_session" : "PHPSESSID"
  const browserCookies = request.headers.get("cookie") ?? ""
  const browserHasSession = browserCookies.includes(`${sessionCookieName}=`)
  const cookie = browserHasSession ? null : await getUpstreamCookie(endpoint, user.id, cred).catch(() => null)

  const upstreamPath = "/" + (path?.join("/") ?? "")

  return proxyRequest({
    endpoint,
    upstreamPath,
    request: request as unknown as Request,
    cookie,
    userId: user.id,
    cred,
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const HEAD = handler
