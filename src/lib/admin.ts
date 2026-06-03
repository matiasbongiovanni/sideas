const DEFAULT_ADMIN_EMAILS = ["hola.sideas.ia@gmail.com"]

function parseEmails(value: string | undefined | null) {
  return (value ?? "")
    .split(/[,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function getAdminEmails() {
  const configured = parseEmails(process.env.ADMIN_ALLOWED_EMAILS)
  return configured.length > 0 ? configured : DEFAULT_ADMIN_EMAILS
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  return getAdminEmails().includes(email.trim().toLowerCase())
}

