import { createAdminClient } from "@/lib/supabase/server"
import { decryptSecret } from "@/lib/portal/crypto"

export type PortalEndpoint = {
  id: string
  client_id: string
  type: "inventario" | "zabbix"
  label: string
  base_url: string
  auth_mode: "per_user" | "shared" | "none"
  enabled: boolean
  sort: number
}

export type PortalProfile = {
  user_id: string
  client_id: string
  username: string
  full_name: string
  role: string
}

export type PortalClient = {
  id: string
  name: string
  slug: string
}

export type PortalContext = {
  profile: PortalProfile
  client: PortalClient
  endpoints: PortalEndpoint[]
}

export type PortalCredential = {
  username: string
  password: string
}

export async function getPortalContext(userId: string): Promise<PortalContext | null> {
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from("portal_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!profile) return null

  const { data: client } = await supabase
    .from("portal_clients")
    .select("*")
    .eq("id", profile.client_id)
    .single()

  if (!client) return null

  const { data: endpoints } = await supabase
    .from("portal_endpoints")
    .select("*")
    .eq("client_id", profile.client_id)
    .eq("enabled", true)
    .order("sort")

  return {
    profile: profile as PortalProfile,
    client: client as PortalClient,
    endpoints: (endpoints ?? []) as PortalEndpoint[],
  }
}

export async function getEndpointForRequest(
  userId: string,
  type: string
): Promise<PortalEndpoint | null> {
  const supabase = await createAdminClient()

  // Verificar que el usuario tiene un profile
  const { data: profile } = await supabase
    .from("portal_profiles")
    .select("client_id")
    .eq("user_id", userId)
    .single()

  if (!profile) return null

  const { data: endpoint } = await supabase
    .from("portal_endpoints")
    .select("*")
    .eq("client_id", profile.client_id)
    .eq("type", type)
    .eq("enabled", true)
    .single()

  return (endpoint as PortalEndpoint) ?? null
}

export async function getCredential(
  userId: string,
  endpoint: PortalEndpoint
): Promise<PortalCredential | null> {
  if (endpoint.auth_mode === "none") return null

  const supabase = await createAdminClient()

  let query = supabase
    .from("portal_credentials")
    .select("username, password_enc")
    .eq("endpoint_id", endpoint.id)

  if (endpoint.auth_mode === "per_user") {
    query = query.eq("user_id", userId)
  } else {
    // shared — user_id IS NULL
    query = query.is("user_id", null)
  }

  const { data } = await query.single()
  if (!data) return null

  return {
    username: data.username,
    password: decryptSecret(data.password_enc),
  }
}
