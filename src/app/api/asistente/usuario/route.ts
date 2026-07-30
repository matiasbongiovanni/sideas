import { NextRequest, NextResponse } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function GET(req: NextRequest) {
  if (!requireN8nApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("ap_usuario").select("*").eq("id", "mati").single()

  if (error) {
    console.error("GET /api/asistente/usuario", error)
    return NextResponse.json({ error: "No se pudo leer el perfil" }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!requireN8nApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const payload: Record<string, unknown> = { actualizado_en: new Date().toISOString() }
  if (body.nombre) payload.nombre = String(body.nombre)
  if (body.zona_horaria) payload.zona_horaria = String(body.zona_horaria)
  if (body.preferencias && typeof body.preferencias === "object") payload.preferencias = body.preferencias

  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("ap_usuario").update(payload).eq("id", "mati").select().single()

  if (error) {
    console.error("PATCH /api/asistente/usuario", error)
    return NextResponse.json({ error: "No se pudo actualizar el perfil" }, { status: 500 })
  }
  return NextResponse.json(data)
}
