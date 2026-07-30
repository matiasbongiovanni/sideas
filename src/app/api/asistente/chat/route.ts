import { NextRequest, NextResponse } from "next/server"
import { requireAsistenteSession } from "@/lib/asistente/auth"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const session = await requireAsistenteSession()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const webhookUrl = process.env.ASISTENTE_N8N_CHAT_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: "Chat no configurado (falta ASISTENTE_N8N_CHAT_WEBHOOK_URL)" }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const mensaje = String(body.mensaje ?? "").trim()
  if (!mensaje) {
    return NextResponse.json({ error: "mensaje es obligatorio" }, { status: 400 })
  }

  const sessionId = body.sessionId ? String(body.sessionId) : `mati-${Date.now()}`

  let n8nRes: Response
  try {
    n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje, sessionId, usuario: session.user.email }),
      signal: AbortSignal.timeout(45000),
    })
  } catch {
    return NextResponse.json({ error: "No se pudo contactar al agente n8n" }, { status: 502 })
  }

  if (!n8nRes.ok) {
    return NextResponse.json({ error: `Agente respondió ${n8nRes.status}` }, { status: 502 })
  }

  let data: unknown
  try {
    data = await n8nRes.json()
  } catch {
    return NextResponse.json({ error: "Respuesta inválida del agente" }, { status: 502 })
  }

  const respuesta =
    (Array.isArray(data) ? data[0]?.respuesta ?? data[0]?.output ?? data[0]?.message : (data as Record<string, unknown>)?.respuesta ?? (data as Record<string, unknown>)?.output ?? (data as Record<string, unknown>)?.message) ??
    "El agente no devolvió respuesta."

  return NextResponse.json({ respuesta, sessionId })
}
