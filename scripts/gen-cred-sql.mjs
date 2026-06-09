#!/usr/bin/env node
// Script one-time: genera el INSERT SQL para portal_credentials con la password encriptada.
// Uso: PORTAL_CRED_SECRET=... node scripts/gen-cred-sql.mjs
import { createCipheriv, randomBytes, scryptSync } from "node:crypto"

const secret = process.env.PORTAL_CRED_SECRET
if (!secret) {
  console.error("ERROR: PORTAL_CRED_SECRET no está seteada.")
  process.exit(1)
}

function encrypt(plain) {
  const key = scryptSync(secret, "sideas-portal-salt", 32)
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(":")
}

const encPass = encrypt("B3t1t0.2026")

console.log(`
-- ── Credencial compartida Zabbix para portal de clientes SIDEAS ──────────────
-- Ejecutar en el SQL Editor de Supabase (proyecto de SIDEAS)

-- Si ya existe, borrar primero:
DELETE FROM portal_credentials
WHERE endpoint_id = (SELECT id FROM portal_endpoints WHERE type = 'zabbix')
  AND user_id IS NULL;

-- Insertar credencial compartida (user_id NULL = compartida para todos los usuarios del cliente):
INSERT INTO portal_credentials (id, endpoint_id, user_id, username, password_enc)
SELECT
  gen_random_uuid(),
  e.id,
  NULL,
  'racevedo',
  '${encPass}'
FROM portal_endpoints e
WHERE e.type = 'zabbix';

-- Verificar:
SELECT pc.username, pe.type, pe.base_url, pc.user_id
FROM portal_credentials pc
JOIN portal_endpoints pe ON pe.id = pc.endpoint_id
WHERE pe.type = 'zabbix';
`)
