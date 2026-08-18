import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/news.server"
import { isAdminEmail } from "@/lib/admin"
import { resetPortalUserPassword, PortalAdminError } from "@/lib/portal/admin-queries"

async function assertAdmin() {
  const session = await requireAdminSession()
  if (!session || !isAdminEmail(session.user.email)) return null
  return session
}

export async function POST(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { userId } = await context.params
    const body = await req.json().catch(() => ({}))
    const result = await resetPortalUserPassword({
      userId,
      newPassword: body.newPassword ? String(body.newPassword) : undefined,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("POST /api/admin/usuarios/usuarios/[userId]/password", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo resetear el password"
    return NextResponse.json({ error: message }, { status })
  }
}
