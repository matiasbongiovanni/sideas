import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/news.server"
import { isAdminEmail } from "@/lib/admin"
import { upsertSharedCredential, PortalAdminError } from "@/lib/portal/admin-queries"

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
    const endpointId = String(body.endpointId ?? "").trim()
    if (!endpointId) return NextResponse.json({ error: "endpointId es obligatorio" }, { status: 400 })

    await upsertSharedCredential({
      endpointId,
      username: String(body.username ?? ""),
      password: String(body.password ?? ""),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("POST /api/admin/usuarios/credenciales", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo guardar la credencial"
    return NextResponse.json({ error: message }, { status })
  }
}
