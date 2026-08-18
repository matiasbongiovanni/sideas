import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/news.server"
import { isAdminEmail } from "@/lib/admin"
import { createPortalUser, deletePortalUser, PortalAdminError } from "@/lib/portal/admin-queries"

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

    const user = await createPortalUser({
      clientId,
      username: String(body.username ?? ""),
      fullName: String(body.fullName ?? ""),
      password: body.password ? String(body.password) : undefined,
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error("POST /api/admin/usuarios/usuarios", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo crear el usuario"
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "userId es obligatorio" }, { status: 400 })

    await deletePortalUser(userId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE /api/admin/usuarios/usuarios", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo eliminar el usuario"
    return NextResponse.json({ error: message }, { status })
  }
}
