import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/news.server"
import { isAdminEmail } from "@/lib/admin"
import {
  createPortalEndpoint,
  setEndpointEnabled,
  PortalAdminError,
  type PortalAuthMode,
  type PortalEndpointType,
} from "@/lib/portal/admin-queries"

async function assertAdmin() {
  const session = await requireAdminSession()
  if (!session || !isAdminEmail(session.user.email)) return null
  return session
}

export async function POST(req: NextRequest) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const clientId = String(body.clientId ?? "").trim()
    if (!clientId) return NextResponse.json({ error: "clientId es obligatorio" }, { status: 400 })

    const endpoint = await createPortalEndpoint({
      clientId,
      type: String(body.type ?? "") as PortalEndpointType,
      label: String(body.label ?? ""),
      baseUrl: String(body.baseUrl ?? ""),
      authMode: String(body.authMode ?? "") as PortalAuthMode,
    })
    return NextResponse.json(endpoint)
  } catch (error) {
    console.error("POST /api/admin/usuarios/endpoints", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo crear el endpoint"
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const endpointId = String(body.endpointId ?? "").trim()
    if (!endpointId) return NextResponse.json({ error: "endpointId es obligatorio" }, { status: 400 })

    await setEndpointEnabled({ endpointId, enabled: Boolean(body.enabled) })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("PATCH /api/admin/usuarios/endpoints", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo actualizar el endpoint"
    return NextResponse.json({ error: message }, { status })
  }
}
