"use server"

import { revalidatePath } from "next/cache"
import { randomBytes } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAsistenteSession } from "@/lib/asistente/auth"
import { EVENTOS_WEBHOOK, emitirEvento } from "@/lib/asistente/webhooks"

export async function marcarTareaHecha(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_tareas")
    .update({ estado: "hecha", actualizado_en: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  await emitirEvento("tarea.completada", data)
  revalidatePath("/asistente/tareas")
  revalidatePath("/asistente")
}

export async function cancelarTarea(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_tareas")
    .update({ estado: "cancelada", actualizado_en: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  await emitirEvento("tarea.cancelada", data)
  revalidatePath("/asistente/tareas")
  revalidatePath("/asistente")
}

export async function reabrirTarea(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_tareas")
    .update({ estado: "pendiente", actualizado_en: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  await emitirEvento("tarea.reabierta", data)
  revalidatePath("/asistente/tareas")
  revalidatePath("/asistente")
}

export async function actualizarNotaContacto(id: string, formData: FormData) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const nota = String(formData.get("nota") ?? "")

  const supabase = await createAdminClient()
  const { error } = await supabase.from("ap_contactos").update({ notas: nota }).eq("id", id)

  if (error) throw error
  revalidatePath("/asistente/contactos")
}

/** Edición manual del perfil/contexto que lee el agente n8n. */
export async function actualizarPerfilUsuario(formData: FormData) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const nombre = String(formData.get("nombre") ?? "").trim()
  const zona_horaria = String(formData.get("zona_horaria") ?? "").trim()
  const preferenciasRaw = String(formData.get("preferencias") ?? "").trim()

  if (!nombre || !zona_horaria) throw new Error("nombre y zona_horaria son obligatorios")

  let preferencias: Record<string, unknown> = {}
  if (preferenciasRaw) {
    try {
      const parsed = JSON.parse(preferenciasRaw)
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("preferencias debe ser un objeto JSON")
      }
      preferencias = parsed as Record<string, unknown>
    } catch {
      throw new Error("preferencias no es JSON válido")
    }
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_usuario")
    .update({ nombre, zona_horaria, preferencias, actualizado_en: new Date().toISOString() })
    .eq("id", "mati")
    .select()
    .single()

  if (error) throw error
  await emitirEvento("usuario.actualizado", data)
  revalidatePath("/asistente/usuario")
}

// ── Webhooks salientes ────────────────────────────────────────────────────────

export async function crearWebhook(formData: FormData) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const nombre = String(formData.get("nombre") ?? "").trim()
  const url = String(formData.get("url") ?? "").trim()
  const eventosSeleccionados = formData.getAll("eventos").map(String)

  if (!nombre) throw new Error("nombre es obligatorio")

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error("URL inválida")
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("La URL debe ser http(s)")
  }

  const eventos =
    eventosSeleccionados.length === 0 || eventosSeleccionados.includes("*")
      ? ["*"]
      : eventosSeleccionados.filter((e) => (EVENTOS_WEBHOOK as readonly string[]).includes(e))

  if (eventos.length === 0) throw new Error("Seleccioná al menos un evento válido")

  const secretoManual = String(formData.get("secreto") ?? "").trim()
  const secreto = secretoManual || randomBytes(24).toString("hex")

  const supabase = await createAdminClient()
  const { error } = await supabase.from("ap_webhooks").insert({ nombre, url, eventos, secreto, activo: true })

  if (error) throw error
  revalidatePath("/asistente/webhooks")
}

export async function alternarWebhook(id: string, activo: boolean) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("ap_webhooks")
    .update({ activo, actualizado_en: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/asistente/webhooks")
}

export async function eliminarWebhook(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { error } = await supabase.from("ap_webhooks").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/asistente/webhooks")
}

/** Dispara un evento de prueba contra los webhooks activos y lo deja logueado. */
export async function probarWebhooks() {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  await emitirEvento("tarea.creada", {
    prueba: true,
    titulo: "Evento de prueba desde el panel",
    disparado_por: session.user.email,
    disparado_en: new Date().toISOString(),
  })

  revalidatePath("/asistente/webhooks")
}
