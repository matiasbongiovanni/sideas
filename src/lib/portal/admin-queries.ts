import { randomBytes } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/server"
import { encryptSecret } from "@/lib/portal/crypto"

const EMAIL_DOMAIN = process.env.PORTAL_EMAIL_DOMAIN || "portal.sideasconsultores.com.ar"

export type PortalEndpointType = "inventario" | "zabbix"
export type PortalAuthMode = "per_user" | "shared" | "none"

export type PortalUser = {
  user_id: string
  username: string
  full_name: string
  created_at: string
  email: string
}

export type PortalEndpointWithCred = {
  id: string
  type: PortalEndpointType
  label: string
  base_url: string
  auth_mode: PortalAuthMode
  enabled: boolean
  sort: number
  created_at: string
  has_shared_credential: boolean
}

export type PortalClientWithDetails = {
  id: string
  name: string
  slug: string
  created_at: string
  endpoints: PortalEndpointWithCred[]
  users: PortalUser[]
}

export class PortalAdminError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateRandomPassword(): string {
  return randomBytes(12).toString("base64url").slice(0, 16)
}

export function buildPortalEmail(username: string): string {
  return `${username}@${EMAIL_DOMAIN}`
}

export async function listPortalClientsWithDetails(): Promise<PortalClientWithDetails[]> {
  const supabase = await createAdminClient()

  const { data: clients, error: clientsError } = await supabase
    .from("portal_clients")
    .select("id, name, slug, created_at")
    .order("created_at", { ascending: false })
  if (clientsError) throw new PortalAdminError(clientsError.message, 500)

  const { data: endpoints, error: endpointsError } = await supabase
    .from("portal_endpoints")
    .select("id, client_id, type, label, base_url, auth_mode, enabled, sort, created_at")
    .order("sort", { ascending: true })
  if (endpointsError) throw new PortalAdminError(endpointsError.message, 500)

  const { data: profiles, error: profilesError } = await supabase
    .from("portal_profiles")
    .select("user_id, client_id, username, full_name, created_at")
    .order("created_at", { ascending: true })
  if (profilesError) throw new PortalAdminError(profilesError.message, 500)

  const { data: sharedCreds, error: credsError } = await supabase
    .from("portal_credentials")
    .select("endpoint_id, user_id")
    .is("user_id", null)
  if (credsError) throw new PortalAdminError(credsError.message, 500)

  const sharedEndpointIds = new Set((sharedCreds ?? []).map((c) => c.endpoint_id as string))

  return (clients ?? []).map((client) => ({
    id: client.id,
    name: client.name,
    slug: client.slug,
    created_at: client.created_at,
    endpoints: (endpoints ?? [])
      .filter((ep) => ep.client_id === client.id)
      .map((ep) => ({
        id: ep.id,
        type: ep.type as PortalEndpointType,
        label: ep.label,
        base_url: ep.base_url,
        auth_mode: ep.auth_mode as PortalAuthMode,
        enabled: ep.enabled,
        sort: ep.sort,
        created_at: ep.created_at,
        has_shared_credential: sharedEndpointIds.has(ep.id),
      })),
    users: (profiles ?? [])
      .filter((p) => p.client_id === client.id)
      .map((p) => ({
        user_id: p.user_id,
        username: p.username,
        full_name: p.full_name,
        created_at: p.created_at,
        email: buildPortalEmail(p.username),
      })),
  }))
}

export async function createPortalClient(input: { name: string; slug?: string }) {
  const name = input.name.trim()
  if (!name) throw new PortalAdminError("El nombre es obligatorio")

  const slug = slugify(input.slug?.trim() || name)
  if (!slug) throw new PortalAdminError("No se pudo generar un slug válido")

  const supabase = await createAdminClient()
  const { data: existing } = await supabase.from("portal_clients").select("id").eq("slug", slug).maybeSingle()
  if (existing) throw new PortalAdminError(`Ya existe un cliente con slug "${slug}"`, 409)

  const { data, error } = await supabase
    .from("portal_clients")
    .insert({ name, slug })
    .select("id, name, slug, created_at")
    .single()
  if (error) throw new PortalAdminError(error.message, 500)
  return data
}

export async function createPortalEndpoint(input: {
  clientId: string
  type: PortalEndpointType
  label: string
  baseUrl: string
  authMode: PortalAuthMode
}) {
  const label = input.label.trim()
  const baseUrl = input.baseUrl.trim()
  if (!label) throw new PortalAdminError("El label es obligatorio")
  if (!baseUrl) throw new PortalAdminError("La base URL es obligatoria")
  if (!["inventario", "zabbix"].includes(input.type)) {
    throw new PortalAdminError("Tipo de endpoint inválido")
  }
  if (!["per_user", "shared", "none"].includes(input.authMode)) {
    throw new PortalAdminError("auth_mode inválido")
  }

  const supabase = await createAdminClient()

  const { data: existing } = await supabase
    .from("portal_endpoints")
    .select("id")
    .eq("client_id", input.clientId)
    .eq("type", input.type)
    .maybeSingle()
  if (existing) throw new PortalAdminError(`Este cliente ya tiene un endpoint de tipo "${input.type}"`, 409)

  const { data, error } = await supabase
    .from("portal_endpoints")
    .insert({
      client_id: input.clientId,
      type: input.type,
      label,
      base_url: baseUrl,
      auth_mode: input.authMode,
    })
    .select("id, type, label, base_url, auth_mode, enabled, sort, created_at")
    .single()
  if (error) throw new PortalAdminError(error.message, 500)
  return data
}

export async function setEndpointEnabled(input: { endpointId: string; enabled: boolean }) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("portal_endpoints")
    .update({ enabled: input.enabled })
    .eq("id", input.endpointId)
  if (error) throw new PortalAdminError(error.message, 500)
}

export async function createPortalUser(input: {
  clientId: string
  username: string
  fullName: string
  password?: string
}): Promise<{ user_id: string; username: string; full_name: string; email: string; password: string }> {
  const username = input.username.trim().toLowerCase()
  const fullName = input.fullName.trim()
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    throw new PortalAdminError("Username inválido — solo minúsculas, números, punto, guion, guion bajo (3-32 caracteres)")
  }
  if (!fullName) throw new PortalAdminError("El nombre completo es obligatorio")

  const password = input.password?.trim() || generateRandomPassword()
  if (password.length < 8) throw new PortalAdminError("El password debe tener al menos 8 caracteres")

  const supabase = await createAdminClient()
  const email = buildPortalEmail(username)

  const { data: existingProfile } = await supabase
    .from("portal_profiles")
    .select("user_id")
    .eq("username", username)
    .maybeSingle()
  if (existingProfile) throw new PortalAdminError(`Ya existe un usuario con username "${username}"`, 409)

  const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (createUserError || !createdUser?.user) {
    throw new PortalAdminError(createUserError?.message ?? "No se pudo crear el usuario en Supabase Auth", 500)
  }
  const userId = createdUser.user.id

  const { error: profileError } = await supabase.from("portal_profiles").insert({
    user_id: userId,
    client_id: input.clientId,
    username,
    full_name: fullName,
    role: "portal",
  })
  if (profileError) {
    await supabase.auth.admin.deleteUser(userId)
    throw new PortalAdminError(profileError.message, 500)
  }

  const { data: inventarioEndpoint } = await supabase
    .from("portal_endpoints")
    .select("id, auth_mode")
    .eq("client_id", input.clientId)
    .eq("type", "inventario")
    .maybeSingle()

  if (inventarioEndpoint && inventarioEndpoint.auth_mode === "per_user") {
    const { error: credError } = await supabase.from("portal_credentials").insert({
      endpoint_id: inventarioEndpoint.id,
      user_id: userId,
      username,
      password_enc: encryptSecret(password),
    })
    if (credError) throw new PortalAdminError(credError.message, 500)
  }

  return { user_id: userId, username, full_name: fullName, email, password }
}

export async function resetPortalUserPassword(input: { userId: string; newPassword?: string }) {
  const newPassword = input.newPassword?.trim() || generateRandomPassword()
  if (newPassword.length < 8) throw new PortalAdminError("El password debe tener al menos 8 caracteres")

  const supabase = await createAdminClient()

  const { data: profile, error: profileError } = await supabase
    .from("portal_profiles")
    .select("username")
    .eq("user_id", input.userId)
    .maybeSingle()
  if (profileError) throw new PortalAdminError(profileError.message, 500)
  if (!profile) throw new PortalAdminError("Usuario no encontrado", 404)

  const { error: updateError } = await supabase.auth.admin.updateUserById(input.userId, {
    password: newPassword,
  })
  if (updateError) throw new PortalAdminError(updateError.message, 500)

  const { data: existingCred } = await supabase
    .from("portal_credentials")
    .select("id")
    .eq("user_id", input.userId)
    .maybeSingle()

  if (existingCred) {
    const { error: credError } = await supabase
      .from("portal_credentials")
      .update({ username: profile.username, password_enc: encryptSecret(newPassword) })
      .eq("id", existingCred.id)
    if (credError) throw new PortalAdminError(credError.message, 500)
  }

  return { password: newPassword }
}

export async function upsertSharedCredential(input: { endpointId: string; username: string; password: string }) {
  const username = input.username.trim()
  const password = input.password.trim()
  if (!username || !password) throw new PortalAdminError("Username y password son obligatorios")

  const supabase = await createAdminClient()

  const { data: endpoint, error: endpointError } = await supabase
    .from("portal_endpoints")
    .select("id, auth_mode")
    .eq("id", input.endpointId)
    .maybeSingle()
  if (endpointError) throw new PortalAdminError(endpointError.message, 500)
  if (!endpoint) throw new PortalAdminError("Endpoint no encontrado", 404)
  if (endpoint.auth_mode !== "shared") {
    throw new PortalAdminError("Este endpoint no está configurado como credencial compartida (auth_mode=shared)")
  }

  const { data: existing } = await supabase
    .from("portal_credentials")
    .select("id")
    .eq("endpoint_id", input.endpointId)
    .is("user_id", null)
    .maybeSingle()

  const password_enc = encryptSecret(password)

  if (existing) {
    const { error } = await supabase
      .from("portal_credentials")
      .update({ username, password_enc })
      .eq("id", existing.id)
    if (error) throw new PortalAdminError(error.message, 500)
    return
  }

  const { error } = await supabase.from("portal_credentials").insert({
    endpoint_id: input.endpointId,
    user_id: null,
    username,
    password_enc,
  })
  if (error) throw new PortalAdminError(error.message, 500)
}

export async function deletePortalUser(userId: string) {
  const supabase = await createAdminClient()

  const { error: credError } = await supabase.from("portal_credentials").delete().eq("user_id", userId)
  if (credError) throw new PortalAdminError(credError.message, 500)

  const { error: profileError } = await supabase.from("portal_profiles").delete().eq("user_id", userId)
  if (profileError) throw new PortalAdminError(profileError.message, 500)

  const { error: authError } = await supabase.auth.admin.deleteUser(userId)
  if (authError) throw new PortalAdminError(authError.message, 500)
}
