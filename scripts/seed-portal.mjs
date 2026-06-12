// Seed del portal de clientes SIDEAS — Ingenia SA (Jesús María)
// Ejecutar: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... [PORTAL_EMAIL_DOMAIN=...] [PORTAL_CRED_SECRET=...] node scripts/seed-portal.mjs
// Idempotente: correr múltiples veces no duplica datos.

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto"

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const EMAIL_DOMAIN = process.env.PORTAL_EMAIL_DOMAIN || "portal.sideasconsultores.com.ar"
const PORTAL_CRED_SECRET = process.env.PORTAL_CRED_SECRET

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Requeridas: SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) + SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// ── Crypto (mismo algoritmo que src/lib/portal/crypto.ts) ───────────────────
const ALG = "aes-256-gcm"
const SEP = ":"

function deriveKey(salt) {
  if (!PORTAL_CRED_SECRET) return Buffer.alloc(32, 0)
  return scryptSync(PORTAL_CRED_SECRET, salt, 32)
}

function encryptSecret(plain) {
  if (!PORTAL_CRED_SECRET) {
    console.warn("⚠️  PORTAL_CRED_SECRET no seteada — credencial guardada en texto plano")
    return plain
  }
  const salt = randomBytes(16)
  const key = deriveKey(salt)
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALG, key, iv)
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  // Format: salt:iv:tag:ciphertext (matches src/lib/portal/crypto.ts)
  return [salt.toString("base64"), iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(SEP)
}

// ── Datos a seedear ─────────────────────────────────────────────────────────
// Passwords must be provided via env vars — never hardcode credentials
const SEED_PASSWORDS = {
  cmaria:    process.env.SEED_PASSWORD_CMARIA,
  etorres:   process.env.SEED_PASSWORD_ETORRES,
  grui:      process.env.SEED_PASSWORD_GRUI,
  pgonzalez: process.env.SEED_PASSWORD_PGONZALEZ,
}

const missingPasswords = Object.entries(SEED_PASSWORDS).filter(([, v]) => !v).map(([k]) => k)
if (missingPasswords.length > 0) {
  console.error(`❌  Faltan contraseñas en variables de entorno: ${missingPasswords.map(k => `SEED_PASSWORD_${k.toUpperCase()}`).join(", ")}`)
  process.exit(1)
}

const USERS = [
  { username: "cmaria",    full_name: "Carlos María",    password: SEED_PASSWORDS.cmaria    },
  { username: "etorres",   full_name: "Ezequiel Torres",  password: SEED_PASSWORDS.etorres   },
  { username: "grui",      full_name: "Gerardo Rui",      password: SEED_PASSWORDS.grui      },
  { username: "pgonzalez", full_name: "Pablo González",   password: SEED_PASSWORDS.pgonzalez },
]

const CLIENT = { name: "Ingenia SA — Jesús María", slug: "ingenia-jesus-maria" }

const ENDPOINTS = [
  {
    type:      "inventario",
    label:     "Inventario",
    base_url:  process.env.IMS_BASE_URL || "https://ims.sideasconsultores.com.ar/ocsreports",
    auth_mode: "per_user",
    sort:      0,
  },
  {
    type:      "zabbix",
    label:     "Monitoreo Zabbix",
    base_url:  process.env.ZABBIX_BASE_URL || "http://monitor.ingeniasa.com.ar:8080",
    auth_mode: "shared",
    sort:      1,
  },
]

const ZABBIX_SHARED_CRED = {
  username: process.env.ZABBIX_SHARED_USERNAME || (() => { throw new Error("ZABBIX_SHARED_USERNAME env var requerida") })(),
  password: process.env.ZABBIX_SHARED_PASSWORD || (() => { throw new Error("ZABBIX_SHARED_PASSWORD env var requerida") })(),
}

// ── Helpers HTTP ────────────────────────────────────────────────────────────
const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
}

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers: { ...headers, ...options.headers } })
  const body = await res.json().catch(() => ({}))
  return { status: res.status, body }
}

// ── Upsert helpers ───────────────────────────────────────────────────────────
async function upsertClient() {
  // Buscar por slug
  const { body: existing } = await supaFetch(`/rest/v1/portal_clients?slug=eq.${CLIENT.slug}&select=id`)
  if (existing?.[0]?.id) {
    console.log(`  ✓ Cliente ya existe: ${CLIENT.name} (${existing[0].id})`)
    return existing[0].id
  }
  const { status, body } = await supaFetch("/rest/v1/portal_clients", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ name: CLIENT.name, slug: CLIENT.slug }),
  })
  if (status !== 201) throw new Error(`Error creando cliente: ${JSON.stringify(body)}`)
  console.log(`  + Cliente creado: ${CLIENT.name} (${body[0].id})`)
  return body[0].id
}

async function upsertEndpoint(clientId, ep) {
  const { body: existing } = await supaFetch(
    `/rest/v1/portal_endpoints?client_id=eq.${clientId}&type=eq.${ep.type}&select=id`
  )
  if (existing?.[0]?.id) {
    console.log(`  ✓ Endpoint ya existe: ${ep.type} (${existing[0].id})`)
    return existing[0].id
  }
  const { status, body } = await supaFetch("/rest/v1/portal_endpoints", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...ep, client_id: clientId }),
  })
  if (status !== 201) throw new Error(`Error creando endpoint ${ep.type}: ${JSON.stringify(body)}`)
  console.log(`  + Endpoint creado: ${ep.type} (${body[0].id})`)
  return body[0].id
}

async function findAuthUserIdByEmail(email) {
  // /auth/v1/admin/users list may be broken; use generate_link which always returns the user object
  const { status, body } = await supaFetch("/auth/v1/admin/generate_link", {
    method: "POST",
    body: JSON.stringify({ type: "magiclink", email }),
  })
  if ((status === 200 || status === 201) && body?.id) return body.id
  return null
}

async function getOrCreateAuthUser(email, password) {
  const { status, body } = await supaFetch("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, password, email_confirm: true }),
  })
  if (status === 201 || status === 200) {
    console.log(`  + Usuario Auth creado: ${email}`)
    return body.id
  }
  if (status === 422) {
    // Ya existe — recuperar ID via generate_link (list endpoint no disponible)
    const uid = await findAuthUserIdByEmail(email)
    if (uid) {
      console.log(`  ✓ Usuario Auth ya existe: ${email} (${uid})`)
      return uid
    }
  }
  throw new Error(`Error creando usuario Auth ${email}: ${JSON.stringify(body)}`)
}

async function upsertProfile(userId, clientId, username, fullName) {
  const { status, body } = await supaFetch("/rest/v1/portal_profiles", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      user_id:   userId,
      client_id: clientId,
      username,
      full_name: fullName,
      role:      "portal",
    }),
  })
  if (status === 201 || status === 200) {
    console.log(`  ✓ Profile upsert: ${username}`)
    return
  }
  throw new Error(`Error upsert profile ${username}: ${JSON.stringify(body)}`)
}

async function upsertCredential(endpointId, userId, username, password) {
  // Check if exists first (NULL user_id can't use ON CONFLICT)
  const userFilter = userId ? `user_id=eq.${userId}` : `user_id=is.null`
  const { body: existing } = await supaFetch(
    `/rest/v1/portal_credentials?endpoint_id=eq.${endpointId}&${userFilter}&select=id`
  )
  const payload = { endpoint_id: endpointId, user_id: userId ?? null, username, password_enc: encryptSecret(password) }

  if (existing?.[0]?.id) {
    // Update existing
    const { status, body } = await supaFetch(
      `/rest/v1/portal_credentials?id=eq.${existing[0].id}`,
      { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ username, password_enc: encryptSecret(password) }) }
    )
    if (status === 204 || status === 200) {
      console.log(`  ✓ Credencial actualizada: endpoint=${endpointId} user=${userId ?? "shared"}`)
      return
    }
    throw new Error(`Error actualizando credencial: ${JSON.stringify(body)}`)
  }

  const { status, body } = await supaFetch("/rest/v1/portal_credentials", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  })
  if (status === 201) {
    console.log(`  ✓ Credencial creada: endpoint=${endpointId} user=${userId ?? "shared"}`)
    return
  }
  throw new Error(`Error upsert credential: ${JSON.stringify(body)}`)
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀  Seed portal SIDEAS — Ingenia SA (Jesús María)\n")

  console.log("1️⃣  Cliente...")
  const clientId = await upsertClient()

  console.log("\n2️⃣  Endpoints...")
  const endpointIds = {}
  for (const ep of ENDPOINTS) {
    endpointIds[ep.type] = await upsertEndpoint(clientId, ep)
  }

  console.log("\n3️⃣  Usuarios Auth + profiles + credenciales de inventario...")
  for (const u of USERS) {
    const email = `${u.username}@${EMAIL_DOMAIN}`
    console.log(`\n  👤  ${u.full_name} (${u.username})`)
    const userId = await getOrCreateAuthUser(email, u.password)
    await upsertProfile(userId, clientId, u.username, u.full_name)
    await upsertCredential(endpointIds["inventario"], userId, u.username, u.password)
  }

  console.log("\n4️⃣  Credencial compartida Zabbix...")
  await upsertCredential(endpointIds["zabbix"], null, ZABBIX_SHARED_CRED.username, ZABBIX_SHARED_CRED.password)

  console.log("\n✅  Seed completado.\n")
  console.log("Verificar en Supabase:")
  console.log("  - Auth > Users: 4 usuarios con email @" + EMAIL_DOMAIN)
  console.log("  - Table portal_profiles: 4 filas")
  console.log("  - Table portal_clients: 1 fila (ingenia-jesus-maria)")
  console.log("  - Table portal_endpoints: 2 filas (inventario + zabbix)")
  console.log("  - Table portal_credentials: 5 filas (4 per-user inventario + 1 shared zabbix)")
}

main().catch((err) => {
  console.error("\n❌  Error:", err.message)
  process.exit(1)
})
