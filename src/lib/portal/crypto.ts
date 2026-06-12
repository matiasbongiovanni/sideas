import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto"

const ALG = "aes-256-gcm"
const SEP = ":"

function getSecret(): string {
  const s = process.env.PORTAL_CRED_SECRET
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("PORTAL_CRED_SECRET must be set in production")
  }
  return s ?? ""
}

function deriveKey(salt: Buffer): Buffer {
  const secret = getSecret()
  if (!secret) return Buffer.alloc(32, 0)
  return scryptSync(secret, salt, 32)
}

export function encryptSecret(plain: string): string {
  const secret = getSecret()
  if (!secret) {
    console.warn("[portal/crypto] PORTAL_CRED_SECRET not set — dev mode, storing plaintext")
    return plain
  }

  const salt = randomBytes(16)
  const key = deriveKey(salt)
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALG, key, iv)
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  // Format: salt:iv:tag:ciphertext (4 segments = encrypted; 3 segments = legacy format)
  return [
    salt.toString("base64"),
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(SEP)
}

export function decryptSecret(enc: string): string {
  const secret = getSecret()
  if (!secret) return enc

  const parts = enc.split(SEP)

  if (parts.length === 4) {
    // New format: salt:iv:tag:ciphertext
    const [saltB64, ivB64, tagB64, dataB64] = parts
    const salt = Buffer.from(saltB64, "base64")
    const key = deriveKey(salt)
    const iv = Buffer.from(ivB64, "base64")
    const tag = Buffer.from(tagB64, "base64")
    const data = Buffer.from(dataB64, "base64")
    const decipher = createDecipheriv(ALG, key, iv)
    decipher.setAuthTag(tag)
    return decipher.update(data) + decipher.final("utf8")
  }

  if (parts.length === 3) {
    // Legacy format (fixed salt): iv:tag:ciphertext — decrypt with fixed salt for migration
    const legacyKey = scryptSync(secret, "sideas-portal-salt", 32)
    const [ivB64, tagB64, dataB64] = parts
    const iv = Buffer.from(ivB64, "base64")
    const tag = Buffer.from(tagB64, "base64")
    const data = Buffer.from(dataB64, "base64")
    const decipher = createDecipheriv(ALG, legacyKey, iv)
    decipher.setAuthTag(tag)
    return decipher.update(data) + decipher.final("utf8")
  }

  // Plaintext (legacy dev data) — return as-is
  return enc
}
