const DEFAULT_ASISTENTE_EMAILS = ["matiasweschta@gmail.com"]

function parseEmails(value: string | undefined | null) {
  return (value ?? "")
    .split(/[,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function getAsistenteEmails() {
  const configured = parseEmails(process.env.ASISTENTE_ALLOWED_EMAILS)
  return configured.length > 0 ? configured : DEFAULT_ASISTENTE_EMAILS
}

export function isAsistenteEmail(email: string | null | undefined) {
  if (!email) return false
  return getAsistenteEmails().includes(email.trim().toLowerCase())
}
