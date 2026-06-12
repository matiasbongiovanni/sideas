// Login programático a OCS Inventory NG.
// Calibrado para OCS Inventory NG 2.x con Cloudflare.
//
// Env vars:
//   IMS_LOGIN_PATH       — ruta del form login        (default: /index.php, relativa a base_url que incluye /ocsreports)
//   IMS_USER_FIELD       — campo de usuario            (default: LOGIN)
//   IMS_PASS_FIELD       — campo de password           (default: PASSWD)
//   IMS_SUBMIT_FIELD     — campo submit del form       (default: Valid_CNX)
//   IMS_SUBMIT_VALUE     — valor del campo submit      (default: Send)
//   IMS_CSRF_FIELD       — nombre del campo CSRF       (default: autodetect)
//   IMS_CSRF_SELECTOR    — regex para extraer CSRF     (default: patrón OCS CSRF_0)

export class InventoryAuthError extends Error {
  constructor(
    message: string,
    public readonly code: "invalid_credentials" | "upstream_down" | "csrf_error" | "unknown"
  ) {
    super(message)
    this.name = "InventoryAuthError"
  }
}

function getCsrfRegexes(): RegExp[] {
  const custom = process.env.IMS_CSRF_SELECTOR
  if (custom) return [new RegExp(custom)]
  return [
    // OCS Inventory NG: <input type='hidden' name='CSRF_0' ... value='abc123'>
    /name="CSRF_\d+"[^>]*value="([^"]+)"/,
    /name='CSRF_\d+'[^>]*value='([^']+)'/,
    /name="_token"\s+value="([^"]+)"/,
    /name="csrf_token"\s+value="([^"]+)"/,
    /<meta\s+name="csrf-token"\s+content="([^"]+)"/,
  ]
}

function getCsrfFieldName(html: string): string {
  const custom = process.env.IMS_CSRF_FIELD
  if (custom) return custom
  const match = html.match(/name="(CSRF_\d+)"/)
  return match?.[1] ?? "_token"
}

function extractCsrfToken(html: string): string | null {
  for (const regex of getCsrfRegexes()) {
    const match = html.match(regex)
    if (match?.[1]) return match[1]
  }
  return null
}

function extractCookies(res: Response): string {
  const setCookie = res.headers.getSetCookie?.() ?? []
  const raw = Array.isArray(setCookie) ? setCookie : [setCookie].filter(Boolean)
  return raw.map((c) => c.split(";")[0].trim()).join("; ")
}

export async function loginInventory(baseUrl: string, user: string, pass: string): Promise<string> {
  // base_url already includes /ocsreports — login is at /index.php relative to it
  const loginPath = process.env.IMS_LOGIN_PATH ?? "/index.php"
  const userField = process.env.IMS_USER_FIELD ?? "LOGIN"
  const passField = process.env.IMS_PASS_FIELD ?? "PASSWD"
  const submitField = process.env.IMS_SUBMIT_FIELD ?? "Valid_CNX"
  const submitValue = process.env.IMS_SUBMIT_VALUE ?? "Send"
  const language = process.env.IMS_LANGUAGE ?? "es"

  const loginUrl = `${baseUrl}${loginPath}`

  // Paso 1: GET login page — obtener CSRF token y cookie inicial
  let getRes: Response
  try {
    getRes = await fetch(loginUrl, { redirect: "manual" })
  } catch {
    throw new InventoryAuthError("No se pudo conectar al inventario upstream", "upstream_down")
  }

  const initialCookie = extractCookies(getRes)
  const html = await getRes.text().catch(() => "")
  const csrfToken = extractCsrfToken(html)
  const csrfField = getCsrfFieldName(html)

  // Paso 2: POST credenciales
  const body = new URLSearchParams({ [userField]: user, [passField]: pass, [submitField]: submitValue, LANGUAGE: language })
  if (csrfToken) body.set(csrfField, csrfToken)

  let postRes: Response
  try {
    postRes = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: initialCookie,
      },
      body,
      redirect: "manual",
    })
  } catch {
    throw new InventoryAuthError("Error en POST de login al inventario", "upstream_down")
  }

  if (postRes.status >= 400) {
    throw new InventoryAuthError(
      `Login al inventario devolvió ${postRes.status}`,
      "invalid_credentials"
    )
  }

  // OCS always sets PHPSESSID even on failed login — detect failure by checking
  // if the response HTML still contains the login form
  const responseHtml = await postRes.text().catch(() => "")
  const isStillLoginPage = responseHtml.includes('name="LOGIN"') && responseHtml.includes('name="PASSWD"')
  if (isStillLoginPage) {
    throw new InventoryAuthError("Login al inventario fallido: credenciales incorrectas", "invalid_credentials")
  }

  // Merge: use cookies from both GET and POST so the authenticated session is complete
  const cookieMap = new Map<string, string>()
  for (const raw of initialCookie.split("; ").filter(Boolean)) {
    const [name] = raw.split("="); cookieMap.set(name, raw)
  }
  for (const raw of extractCookies(postRes).split("; ").filter(Boolean)) {
    const [name] = raw.split("="); cookieMap.set(name, raw)
  }
  const sessionCookie = [...cookieMap.values()].join("; ")
  if (!sessionCookie) {
    throw new InventoryAuthError("Login al inventario fallido: sin cookie de sesión", "invalid_credentials")
  }

  return sessionCookie
}
