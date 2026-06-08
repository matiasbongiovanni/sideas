import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto"

const ALG = "aes-256-gcm"
const SEP = ":"

function deriveKey(): Buffer {
  const secret = process.env.PORTAL_CRED_SECRET
  if (!secret) {
    console.warn(
      "[portal/crypto] PORTAL_CRED_SECRET not set — credentials stored as plaintext. Set this env var in production."
    )
    return Buffer.alloc(32, 0)
  }
  // Deterministic key from secret; salt is fixed so we can decrypt without storing it
  return scryptSync(secret, "sideas-portal-salt", 32)
}

export function encryptSecret(plain: string): string {
  if (!process.env.PORTAL_CRED_SECRET) return plain

  const key = deriveKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALG, key, iv)
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(SEP)
}

export function decryptSecret(enc: string): string {
  if (!process.env.PORTAL_CRED_SECRET) return enc

  const parts = enc.split(SEP)
  if (parts.length !== 3) {
    // Legacy plaintext or bad format — return as-is
    return enc
  }

  const [ivB64, tagB64, dataB64] = parts
  const key = deriveKey()
  const iv = Buffer.from(ivB64, "base64")
  const tag = Buffer.from(tagB64, "base64")
  const data = Buffer.from(dataB64, "base64")

  const decipher = createDecipheriv(ALG, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(data) + decipher.final("utf8")
}
