import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAsistenteEmail } from "@/lib/asistente/allowlist"

export async function requireAsistenteSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAsistenteEmail(user.email)) return null
  return { user }
}

export function requireN8nApiKey(req: NextRequest) {
  const configured = process.env.ASISTENTE_N8N_API_KEY
  if (!configured) return false

  const provided = req.headers.get("x-api-key")
  if (!provided) return false

  return timingSafeEqual(provided, configured)
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}
