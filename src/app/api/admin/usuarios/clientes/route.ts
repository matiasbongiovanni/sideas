import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/news.server"
import { isAdminEmail } from "@/lib/admin"
import { createPortalClient, listPortalClientsWithDetails, PortalAdminError } from "@/lib/portal/admin-queries"

async function assertAdmin() {
  const session = await requireAdminSession()
  if (!session || !isAdminEmail(session.user.email)) return null
  return session
}

export async function GET() {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const clients = await listPortalClientsWithDetails()
    return NextResponse.json(clients)
  } catch (error) {
    console.error("GET /api/admin/usuarios/clientes", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudieron cargar los clientes"
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(req: NextRequest) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const client = await createPortalClient({
      name: String(body.name ?? ""),
      slug: body.slug ? String(body.slug) : undefined,
    })
    return NextResponse.json(client)
  } catch (error) {
    console.error("POST /api/admin/usuarios/clientes", error)
    const status = error instanceof PortalAdminError ? error.status : 500
    const message = error instanceof PortalAdminError ? error.message : "No se pudo crear el cliente"
    return NextResponse.json({ error: message }, { status })
  }
}
