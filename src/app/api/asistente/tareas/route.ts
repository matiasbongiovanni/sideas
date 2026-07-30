import { NextRequest, NextResponse } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

const ESTADOS = ["pendiente", "en_progreso", "hecha", "cancelada"]
const PRIORIDADES = ["baja", "normal", "alta", "urgente"]

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
    return NextResponse.json(data)
  }

  const { data, error } = await supabase.from("ap_tareas").insert(payload).select().single()

  if (error) {
    console.error("POST /api/asistente/tareas", error)
    return NextResponse.json({ error: "No se pudo crear la tarea" }, { status: 500 })
  }
  return NextResponse.json(data)
}
