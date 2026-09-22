import { createHmac, timingSafeEqual as nodeTimingSafeEqual } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/server"

/** Eventos que el módulo emite hacia los webhooks salientes registrados. */
export const EVENTOS_WEBHOOK = [
  "tarea.creada",
  "tarea.actualizada",
  "tarea.completada",
  "tarea.cancelada",
  "tarea.reabierta",
  "contacto.creado",
  "contacto.actualizado",
  "correo.registrado",
  "evento.creado",
  "evento.actualizado",
  "evento.eliminado",
  "usuario.actualizado",
] as const

export type EventoWebhook = (typeof EVENTOS_WEBHOOK)[number]

export type Webhook = {
  id: string
  nombre: string
  url: string
  eventos: string[]
  secreto: string | null
  activo: boolean
  creado_en: string
  actualizado_en: string
}

export type WebhookEntrega = {
  id: string
  webhook_id: string | null
  evento: string
  payload: Record<string, unknown>
  status_code: number | null
  ok: boolean
  error: string | null
  duracion_ms: number | null
  creado_en: string
}

export type WebhookEntrante = {
  id: string
  origen: string
  evento: string | null
  payload: Record<string, unknown>
  headers: Record<string, unknown>
  firma_valida: boolean
  procesado: boolean
  creado_en: string
}

const TIMEOUT_MS = 10000

export function firmarPayload(cuerpo: string, secreto: string) {
  return `sha256=${createHmac("sha256", secreto).update(cuerpo).digest("hex")}`
}

export function verificarFirma(cuerpo: string, firma: string | null, secreto: string | null) {
  if (!secreto) return false
  if (!firma) return false

  const esperada = Buffer.from(firmarPayload(cuerpo, secreto))
  const recibida = Buffer.from(firma)
  if (esperada.length !== recibida.length) return false
  return nodeTimingSafeEqual(esperada, recibida)
}

function suscripto(webhook: Webhook, evento: string) {
  const eventos = webhook.eventos ?? []
  return eventos.includes("*") || eventos.includes(evento)
}

/**
 * Entrega un evento a todos los webhooks activos suscriptos y registra el
 * resultado en ap_webhook_entregas. Nunca lanza: un webhook caído no debe
 * romper la operación que lo disparó.
 *
 * Llamar dentro de `after()` para no bloquear la respuesta HTTP.
 */
export async function emitirEvento(evento: EventoWebhook | string, datos: unknown) {
  try {
    const supabase = await createAdminClient()
    const { data, error } = await supabase.from("ap_webhooks").select("*").eq("activo", true)

    if (error) {
      console.error("emitirEvento: no se pudieron leer los webhooks", error)
      return
    }

    const destinos = ((data ?? []) as Webhook[]).filter((w) => suscripto(w, evento))
    if (destinos.length === 0) return

    const payload = {
      evento,
      emitido_en: new Date().toISOString(),
      origen: "sideas-asistente",
      datos,
    }
    const cuerpo = JSON.stringify(payload)

    await Promise.all(destinos.map((destino) => entregar(destino, evento, payload, cuerpo)))
  } catch (err) {
    console.error("emitirEvento", err)
  }
}

async function entregar(
  webhook: Webhook,
  evento: string,
  payload: Record<string, unknown>,
  cuerpo: string,
) {
  const secreto = webhook.secreto ?? process.env.ASISTENTE_WEBHOOK_SECRET ?? null
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-sideas-evento": evento,
  }
  if (secreto) headers["x-sideas-signature"] = firmarPayload(cuerpo, secreto)

  const inicio = Date.now()
  let statusCode: number | null = null
  let ok = false
  let mensajeError: string | null = null

  try {
    const res = await fetch(webhook.url, {
      method: "POST",
      headers,
      body: cuerpo,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    statusCode = res.status
    ok = res.ok
    if (!ok) mensajeError = `HTTP ${res.status}`
  } catch (err) {
    mensajeError = err instanceof Error ? err.message : "Error desconocido"
  }

  try {
    const supabase = await createAdminClient()
    await supabase.from("ap_webhook_entregas").insert({
      webhook_id: webhook.id,
      evento,
      payload,
      status_code: statusCode,
      ok,
      error: mensajeError,
      duracion_ms: Date.now() - inicio,
    })
  } catch (err) {
    console.error("entregar: no se pudo loguear la entrega", err)
  }
}

export async function getWebhooks(): Promise<Webhook[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("ap_webhooks").select("*").order("creado_en", { ascending: false })

  if (error) throw error
  return (data ?? []) as Webhook[]
}

export async function getEntregas(limite = 50): Promise<WebhookEntrega[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_webhook_entregas")
    .select("*")
    .order("creado_en", { ascending: false })
    .limit(limite)

  if (error) throw error
  return (data ?? []) as WebhookEntrega[]
}

export async function getEntrantes(limite = 50): Promise<WebhookEntrante[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_webhook_entrantes")
    .select("*")
    .order("creado_en", { ascending: false })
    .limit(limite)

  if (error) throw error
  return (data ?? []) as WebhookEntrante[]
}
