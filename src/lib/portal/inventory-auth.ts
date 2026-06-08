// Login programático a OCS Inventory NG.
// Defaults calibrados para OCS Inventory NG 2.x (LOGIN_ID / LOGIN_PASSWD / index.php).
// Sobrescribibles por env si la instalación difiere.
//
// Env vars:
//   IMS_LOGIN_PATH       — ruta del form login   (default: /index.php)
//   IMS_USER_FIELD       — campo de usuario        (default: LOGIN_ID)
//   IMS_PASS_FIELD       — campo de password       (default: LOGIN_PASSWD)
//   IMS_CSRF_SELECTOR    — regex para extraer CSRF (OCS no usa CSRF por defecto)

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
    /name="_token"\s+value="([^"]+)"/,
    /name="csrf_token"\s+value="([^"]+)"/,
    /<meta\s+name="csrf-token"\s+content="([^"]+)"/,
  ]
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
  const loginPath = process.env.IMS_LOGIN_PATH ?? "/login"
  const userField = process.env.IMS_USER_FIELD ?? "username"
  const passField = process.env.IMS_PASS_FIELD ?? "password"

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

  // Paso 2: POST credenciales
  const body = new URLSearchParams({ [userField]: user, [passField]: pass })
  if (csrfToken) body.set("_token", csrfToken)

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

  const sessionCookie = extractCookies(postRes)
  if (!sessionCookie) {
    throw new InventoryAuthError("Login al inventario fallido: sin cookie de sesión", "invalid_credentials")
  }

  // Si el IMS redirige (3xx) tras login exitoso, o devuelve 2xx, aceptamos la cookie
  if (postRes.status >= 400) {
    throw new InventoryAuthError(
      `Login al inventario devolvió ${postRes.status}`,
      "invalid_credentials"
    )
  }

  return sessionCookie
}
