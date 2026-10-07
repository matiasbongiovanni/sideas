import type { SupabaseClient } from "@supabase/supabase-js"

// 2FA obligatorio (TOTP) para todo ingreso a zonas privadas: portal de clientes,
// admin y asistente. "ok" = sesión AAL2; "verificar" = tiene factor pero falta el
// código en esta sesión; "configurar" = todavía no dio de alta su app autenticadora.
export type EstadoMfa = "ok" | "verificar" | "configurar"

export async function estadoMfa(supabase: Pick<SupabaseClient, "auth">): Promise<EstadoMfa> {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  // Fail closed: ante cualquier error se exige el código
  if (error || !data) return "verificar"
  if (data.currentLevel === "aal2") return "ok"
  return data.nextLevel === "aal2" ? "verificar" : "configurar"
}

export async function tieneAal2(supabase: Pick<SupabaseClient, "auth">) {
  return (await estadoMfa(supabase)) === "ok"
}

// Solo rutas internas relativas — evita open redirect con ?next=//evil.com
export function sanitizarNext(next: string | null | undefined, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback
  if (next.startsWith("/2fa")) return fallback
  return next
}

export function loginParaRuta(next: string) {
  if (next.startsWith("/admin")) return "/admin/login"
  if (next.startsWith("/asistente")) return "/asistente/login"
  return "/login"
}
