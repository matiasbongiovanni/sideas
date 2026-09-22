import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { emitirEvento } from "@/lib/asistente/webhooks"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

const ESTADOS = ["pendiente", "en_progreso", "hecha", "cancelada"]
const PRIORIDADES = ["baja", "normal", "alta", "urgente"]

/** Lectura para el agente n8n: GET /api/asistente/tareas?estado=pendiente&limite=50 */
export async function GET(req: NextRequest) {
  if (!requireN8nApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const estado = searchParams.get("estado")
  const prioridad = searchParams.get("prioridad")
  const limite = Math.min(Number(searchParams.get("limite") ?? 100) || 100, 500)

  const supabase = await createAdminClient()
  let query = supabase
    .from("ap_tareas")
    .select("*")
    .order("fecha_limite", { ascending: true, nullsFirst: false })
    .limit(limite)

  if (estado && ESTADOS.includes(estado)) query = query.eq("estado", estado)
  if (prioridad && PRIORIDADES.includes(prioridad)) query = query.eq("prioridad", prioridad)

  const { data, error } = await query

  if (error) {
    console.error("GET /api/asistente/tareas", error)
    return NextResponse.json({ error: "No se pudieron leer las tareas" }, { status: 500 })
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

  const titulo = String(body.titulo ?? "").trim()
  if (!titulo) {
    return NextResponse.json({ error: "titulo es obligatorio" }, { status: 400 })
  }

  const estado = ESTADOS.includes(String(body.estado)) ? String(body.estado) : "pendiente"
  const prioridad = PRIORIDADES.includes(String(body.prioridad)) ? String(body.prioridad) : "normal"

  const payload = {
    titulo,
    descripcion: body.descripcion ? String(body.descripcion) : null,
    estado,
    prioridad,
    fecha_limite: body.fecha_limite ? String(body.fecha_limite) : null,
    actualizado_en: new Date().toISOString(),
  }

  const supabase = await createAdminClient()

  if (body.id) {
    const { data, error } = await supabase
      .from("ap_tareas")
      .update(payload)
      .eq("id", String(body.id))
      .select()
      .single()

    if (error) {
      console.error("PATCH /api/asistente/tareas", error)
      return NextResponse.json({ error: "No se pudo actualizar la tarea" }, { status: 500 })
    }
    after(() => emitirEvento("tarea.actualizada", data))
    return NextResponse.json(data)
  }

  const { data, error } = await supabase.from("ap_tareas").insert(payload).select().single()

  if (error) {
    console.error("POST /api/asistente/tareas", error)
    return NextResponse.json({ error: "No se pudo crear la tarea" }, { status: 500 })
  }
  after(() => emitirEvento("tarea.creada", data))
  return NextResponse.json(data)
}
