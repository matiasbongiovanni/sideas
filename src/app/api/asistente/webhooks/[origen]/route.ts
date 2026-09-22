import { NextRequest, NextResponse } from "next/server"
import { requireN8nApiKey } from "@/lib/asistente/auth"
import { verificarFirma } from "@/lib/asistente/webhooks"
import { createAdminClient } from "@/lib/supabase/server"

export const maxDuration = 30

const ORIGEN_RE = /^[a-z0-9-]{1,40}$/

/** Headers que se guardan en el log (el resto se descarta para no persistir secretos). */
const HEADERS_LOGUEADOS = ["content-type", "user-agent", "x-sideas-evento", "x-forwarded-for"]

/**
 * Receptor genérico de webhooks entrantes: /api/asistente/webhooks/{origen}
 * Ej: /api/asistente/webhooks/n8n, /api/asistente/webhooks/google-calendar
 *
 * Autenticación (cualquiera de las dos):
 *  - header `x-sideas-signature` con HMAC-SHA256 del cuerpo usando ASISTENTE_WEBHOOK_INBOUND_SECRET
 *  - header `x-api-key` con ASISTENTE_N8N_API_KEY
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ origen: string }> }) {
  const { origen } = await params

  if (!ORIGEN_RE.test(origen)) {
    return NextResponse.json({ error: "origen inválido" }, { status: 400 })
  }

  const cuerpo = await req.text()

  const secretoEntrante = process.env.ASISTENTE_WEBHOOK_INBOUND_SECRET ?? null
  const firmaValida = verificarFirma(cuerpo, req.headers.get("x-sideas-signature"), secretoEntrante)
  const apiKeyValida = requireN8nApiKey(req)

  if (!firmaValida && !apiKeyValida) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let payload: unknown = null
  if (cuerpo) {
    try {
      payload = JSON.parse(cuerpo)
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
    }
  }

  const headers: Record<string, string> = {}
  for (const nombre of HEADERS_LOGUEADOS) {
    const valor = req.headers.get(nombre)
    if (valor) headers[nombre] = valor
  }

  const evento =
    req.headers.get("x-sideas-evento") ??
    (payload && typeof payload === "object" && "evento" in payload
      ? String((payload as Record<string, unknown>).evento)
      : null)

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_webhook_entrantes")
    .insert({
      origen,
      evento,
      payload: payload ?? {},
      headers,
      firma_valida: firmaValida,
    })
    .select("id")
    .single()

  if (error) {
    console.error(`POST /api/asistente/webhooks/${origen}`, error)
    return NextResponse.json({ error: "No se pudo registrar el webhook" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id, origen, evento })
}
