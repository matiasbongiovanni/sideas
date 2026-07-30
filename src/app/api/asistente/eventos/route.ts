import { NextRequest, NextResponse } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

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

  const supabase = await createAdminClient()

  if (body.eliminar) {
    if (!body.fuente_externa_id && !body.id) {
      return NextResponse.json({ error: "id o fuente_externa_id es obligatorio para eliminar" }, { status: 400 })
    }
    const query = supabase.from("ap_eventos").delete()
    const { error } = body.id
      ? await query.eq("id", String(body.id))
      : await query.eq("fuente_externa_id", String(body.fuente_externa_id))

    if (error) {
      console.error("DELETE /api/asistente/eventos", error)
      return NextResponse.json({ error: "No se pudo eliminar el evento" }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  const titulo = String(body.titulo ?? "").trim()
  const inicio = String(body.inicio ?? "").trim()
  const fin = String(body.fin ?? "").trim()

  if (!titulo || !inicio || !fin) {
    return NextResponse.json({ error: "titulo, inicio y fin son obligatorios" }, { status: 400 })
  }

  const payload = {
    titulo,
    descripcion: body.descripcion ? String(body.descripcion) : null,
    inicio,
    fin,
    ubicacion: body.ubicacion ? String(body.ubicacion) : null,
    fuente_externa_id: body.fuente_externa_id ? String(body.fuente_externa_id) : null,
    actualizado_en: new Date().toISOString(),
  }

  if (body.fuente_externa_id) {
    const { data, error } = await supabase
      .from("ap_eventos")
      .upsert(payload, { onConflict: "fuente_externa_id" })
      .select()
      .single()

    if (error) {
      console.error("UPSERT /api/asistente/eventos", error)
      return NextResponse.json({ error: "No se pudo guardar el evento" }, { status: 500 })
    }
    return NextResponse.json(data)
  }

  if (body.id) {
    const { data, error } = await supabase
      .from("ap_eventos")
      .update(payload)
      .eq("id", String(body.id))
      .select()
      .single()

    if (error) {
      console.error("PATCH /api/asistente/eventos", error)
      return NextResponse.json({ error: "No se pudo actualizar el evento" }, { status: 500 })
    }
    return NextResponse.json(data)
  }

  const { data, error } = await supabase.from("ap_eventos").insert(payload).select().single()

  if (error) {
    console.error("POST /api/asistente/eventos", error)
    return NextResponse.json({ error: "No se pudo crear el evento" }, { status: 500 })
  }
  return NextResponse.json(data)
}
