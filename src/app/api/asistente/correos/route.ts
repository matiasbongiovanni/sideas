import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { emitirEvento } from "@/lib/asistente/webhooks"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

const ESTADOS = ["enviado", "fallido", "programado"]

/** Lectura para el agente n8n: GET /api/asistente/correos?contacto_id=...&estado_envio=enviado */
export async function GET(req: NextRequest) {
  if (!requireN8nApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const contactoId = searchParams.get("contacto_id")
  const estado = searchParams.get("estado_envio")
  const desde = searchParams.get("desde")
  const limite = Math.min(Number(searchParams.get("limite") ?? 100) || 100, 500)

  const supabase = await createAdminClient()
  let query = supabase.from("ap_correos").select("*").order("enviado_en", { ascending: false }).limit(limite)

  if (contactoId) query = query.eq("contacto_id", contactoId)
  if (estado && ESTADOS.includes(estado)) query = query.eq("estado_envio", estado)
  if (desde) query = query.gte("enviado_en", desde)

  const { data, error } = await query

  if (error) {
    console.error("GET /api/asistente/correos", error)
    return NextResponse.json({ error: "No se pudieron leer los correos" }, { status: 500 })
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

  const destinatario_email = String(body.destinatario_email ?? "").trim().toLowerCase()
  const asunto = String(body.asunto ?? "").trim()

  if (!destinatario_email || !asunto) {
    return NextResponse.json({ error: "destinatario_email y asunto son obligatorios" }, { status: 400 })
  }

  const estado_envio = ESTADOS.includes(String(body.estado_envio)) ? String(body.estado_envio) : "enviado"

  const supabase = await createAdminClient()

  let contacto_id = body.contacto_id ? String(body.contacto_id) : null
  if (!contacto_id) {
    const { data } = await supabase.from("ap_contactos").select("id").eq("email", destinatario_email).maybeSingle()
    contacto_id = data?.id ?? null
  }

  const payload = {
    contacto_id,
    destinatario_email,
    asunto,
    cuerpo: body.cuerpo ? String(body.cuerpo) : null,
    estado_envio,
    enviado_en: body.enviado_en ? String(body.enviado_en) : new Date().toISOString(),
  }

  const { data, error } = await supabase.from("ap_correos").insert(payload).select().single()

  if (error) {
    console.error("POST /api/asistente/correos", error)
    return NextResponse.json({ error: "No se pudo registrar el correo" }, { status: 500 })
  }
  after(() => emitirEvento("correo.registrado", data))
  return NextResponse.json(data)
}
