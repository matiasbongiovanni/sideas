export class ZabbixAuthError extends Error {
  constructor(
    message: string,
    public readonly code: "invalid_credentials" | "upstream_down" | "unknown"
  ) {
    super(message)
    this.name = "ZabbixAuthError"
  }
}

export async function loginZabbix(baseUrl: string, user: string, pass: string): Promise<string> {
  const loginUrl = `${baseUrl}/index.php`

  // Step 1: GET login page — extract CSRF token (Zabbix 6.2+) + initial cookies
  let initCookieStr = ""
  let csrfToken: string | undefined

  try {
    const getRes = await fetch(loginUrl, {
      headers: { Accept: "text/html" },
      redirect: "follow",
    })
    const html = await getRes.text()
    const csrfMatch = html.match(/name="_csrf_token"\s+value="([^"]+)"/)
    csrfToken = csrfMatch?.[1]
    const initCookies = getRes.headers.getSetCookie?.() ?? []
    initCookieStr = initCookies.map((c) => c.split(";")[0]).join("; ")
  } catch {
    // Continue without CSRF — older Zabbix versions don't require it
  }

  // Step 2: POST credentials + CSRF token + form fields
  const formData = new URLSearchParams({
    name:         user,
    password:     pass,
    enter:        "Sign in",
    autologin:    "1",
    request:      "",
    form_refresh: "1",
  })
  if (csrfToken) formData.set("_csrf_token", csrfToken)

  let res: Response
  try {
    res = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(initCookieStr ? { Cookie: initCookieStr } : {}),
      },
      body: formData,
      redirect: "manual",
    })
  } catch {
    throw new ZabbixAuthError("No se pudo conectar a Zabbix upstream", "upstream_down")
  }

  // Zabbix redirige al dashboard con Set-Cookie si el login fue exitoso
  const setCookie = res.headers.getSetCookie?.() ?? []
  const rawCookies = Array.isArray(setCookie) ? setCookie : [setCookie].filter(Boolean)
  const sessionCookies = rawCookies.map((c) => c.split(";")[0].trim())
  const hasSession = sessionCookies.some(
    (c) => c.startsWith("zbx_session") || c.startsWith("zbx_sessionid")
  )

  if (!hasSession) {
    throw new ZabbixAuthError("Login a Zabbix fallido: sin cookie de sesión", "invalid_credentials")
  }

  // Combine initial cookies with session cookies so all subsequent requests are valid
  const allParts = [
    ...initCookieStr.split("; ").filter(Boolean),
    ...sessionCookies,
  ]
  return [...new Set(allParts)].join("; ")
}
