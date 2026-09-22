import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { emitirEvento } from "@/lib/asistente/webhooks"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

/** Lectura para el agente n8n: GET /api/asistente/contactos?q=juan&telefono=+549... */
export async function GET(req: NextRequest) {
  if (!requireN8nApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()
  const telefono = searchParams.get("telefono")?.trim()
  const email = searchParams.get("email")?.trim().toLowerCase()
  const limite = Math.min(Number(searchParams.get("limite") ?? 100) || 100, 500)

  const supabase = await createAdminClient()
  let query = supabase
    .from("ap_contactos")
    .select("*")
    .order("ultima_interaccion", { ascending: false, nullsFirst: false })
    .limit(limite)

  if (telefono) query = query.eq("telefono", telefono)
  if (email) query = query.eq("email", email)
  if (q) query = query.ilike("nombre", `%${q}%`)

  const { data, error } = await query

  if (error) {
    console.error("GET /api/asistente/contactos", error)
    return NextResponse.json({ error: "No se pudieron leer los contactos" }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  if (!requireN8nApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const nombre = String(body.nombre ?? "").trim()
  const telefono = body.telefono ? String(body.telefono).trim() : null
  const email = body.email ? String(body.email).trim().toLowerCase() : null

  if (!nombre) {
    return NextResponse.json({ error: "nombre es obligatorio" }, { status: 400 })
  }
  if (!telefono && !email) {
    return NextResponse.json({ error: "telefono o email es obligatorio para identificar el contacto" }, { status: 400 })
  }

  const supabase = await createAdminClient()

  let existenteId: string | null = null
  if (telefono) {
    const { data } = await supabase.from("ap_contactos").select("id").eq("telefono", telefono).maybeSingle()
    existenteId = data?.id ?? null
  }
  if (!existenteId && email) {
    const { data } = await supabase.from("ap_contactos").select("id").eq("email", email).maybeSingle()
    existenteId = data?.id ?? null
  }

  const payload = {
    nombre,
    telefono,
    email,
    notas: body.notas ? String(body.notas) : null,
    ultima_interaccion: new Date().toISOString(),
  }

  if (existenteId) {
    const { data, error } = await supabase
      .from("ap_contactos")
      .update(payload)
      .eq("id", existenteId)
      .select()
      .single()

    if (error) {
      console.error("PATCH /api/asistente/contactos", error)
      return NextResponse.json({ error: "No se pudo actualizar el contacto" }, { status: 500 })
    }
    after(() => emitirEvento("contacto.actualizado", data))
    return NextResponse.json(data)
  }

  const { data, error } = await supabase.from("ap_contactos").insert(payload).select().single()

  if (error) {
    console.error("POST /api/asistente/contactos", error)
    return NextResponse.json({ error: "No se pudo crear el contacto" }, { status: 500 })
  }
  after(() => emitirEvento("contacto.creado", data))
  return NextResponse.json(data)
}
