"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAsistenteSession } from "@/lib/asistente/auth"

export async function marcarTareaHecha(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("ap_tareas")
    .update({ estado: "hecha", actualizado_en: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/asistente/tareas")
  revalidatePath("/asistente")
}

export async function cancelarTarea(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("ap_tareas")
    .update({ estado: "cancelada", actualizado_en: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/asistente/tareas")
  revalidatePath("/asistente")
}

export async function reabrirTarea(id: string) {
  const session = await requireAsistenteSession()
  if (!session) throw new Error("No autorizado")

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("ap_tareas")
    .update({ estado: "pendiente", actualizado_en: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
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
