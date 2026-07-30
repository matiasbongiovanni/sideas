import { createAdminClient } from "@/lib/supabase/server"

export type TareaEstado = "pendiente" | "en_progreso" | "hecha" | "cancelada"
export type TareaPrioridad = "baja" | "normal" | "alta" | "urgente"

export type Tarea = {
  id: string
  titulo: string
  descripcion: string | null
  estado: TareaEstado
  prioridad: TareaPrioridad
  fecha_limite: string | null
  creado_en: string
  actualizado_en: string
}

export type Contacto = {
  id: string
  nombre: string
  telefono: string | null
  email: string | null
  notas: string | null
  ultima_interaccion: string | null
  creado_en: string
}

export type Correo = {
  id: string
  contacto_id: string | null
  destinatario_email: string
  asunto: string
  cuerpo: string | null
  estado_envio: "enviado" | "fallido" | "programado"
  enviado_en: string
}

export type Evento = {
  id: string
  titulo: string
  descripcion: string | null
  inicio: string
  fin: string
  ubicacion: string | null
  fuente_externa_id: string | null
  creado_en: string
  actualizado_en: string
}

export type UsuarioPerfil = {
  id: string
  nombre: string
  zona_horaria: string
  preferencias: Record<string, unknown>
  actualizado_en: string
}

export async function getTareas(): Promise<Tarea[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_tareas")
    .select("*")
    .order("fecha_limite", { ascending: true, nullsFirst: false })
    .order("creado_en", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getContactos(): Promise<Contacto[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_contactos")
    .select("*")
    .order("ultima_interaccion", { ascending: false, nullsFirst: false })

  if (error) throw error
  return data ?? []
}

export async function getContacto(id: string): Promise<Contacto | null> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("ap_contactos").select("*").eq("id", id).maybeSingle()

  if (error) throw error
  return data
}

export async function getCorreosPorContacto(contactoId: string): Promise<Correo[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_correos")
    .select("*")
    .eq("contacto_id", contactoId)
    .order("enviado_en", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getCorreos(): Promise<Correo[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("ap_correos")
    .select("*")
    .order("enviado_en", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getEventos(desde?: string, hasta?: string): Promise<Evento[]> {
  const supabase = await createAdminClient()
  let query = supabase.from("ap_eventos").select("*").order("inicio", { ascending: true })

  if (desde) query = query.gte("inicio", desde)
  if (hasta) query = query.lte("inicio", hasta)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getUsuario(): Promise<UsuarioPerfil> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("ap_usuario").select("*").eq("id", "mati").single()

  if (error) throw error
  return data
}

export async function getResumen() {
  const supabase = await createAdminClient()

  const ahora = new Date()
  const en7dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)
  const inicioHoy = new Date(ahora)
  inicioHoy.setHours(0, 0, 0, 0)
  const inicioSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [tareasPendientes, proximosEventos, correosHoy, correosSemana, contactos] = await Promise.all([
    supabase.from("ap_tareas").select("id", { count: "exact", head: true }).in("estado", ["pendiente", "en_progreso"]),
    supabase
      .from("ap_eventos")
      .select("*")
      .gte("inicio", ahora.toISOString())
      .lte("inicio", en7dias.toISOString())
      .order("inicio", { ascending: true })
      .limit(5),
    supabase.from("ap_correos").select("id", { count: "exact", head: true }).gte("enviado_en", inicioHoy.toISOString()),
    supabase.from("ap_correos").select("id", { count: "exact", head: true }).gte("enviado_en", inicioSemana.toISOString()),
    supabase.from("ap_contactos").select("id", { count: "exact", head: true }),
  ])

  return {
    tareasPendientes: tareasPendientes.count ?? 0,
    proximosEventos: (proximosEventos.data ?? []) as Evento[],
    correosHoy: correosHoy.count ?? 0,
    correosSemana: correosSemana.count ?? 0,
    contactosTotales: contactos.count ?? 0,
  }
}
