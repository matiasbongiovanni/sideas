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

  // Step 1: GET login page — extract session cookie, CSRF token (6.2+), and submit button value
  let initCookieStr = ""
  let csrfToken: string | undefined
  let enterValue = "Sign in"

  try {
    const getRes = await fetch(loginUrl, {
      headers: { Accept: "text/html" },
      redirect: "follow",
    })
    const html = await getRes.text()

    // CSRF token (Zabbix 6.2)
    const csrfMatch = html.match(/name="_csrf_token"\s+value="([^"]+)"/)
    csrfToken = csrfMatch?.[1]

    // Session cookie set on GET — Zabbix 7.x uses this as CSRF protection
    const initCookies = getRes.headers.getSetCookie?.() ?? []
    initCookieStr = initCookies.map((c) => c.split(";")[0]).join("; ")

    // Extract the real submit button value (locale-aware: "Sign in", "Acceder", etc.)
    const enterMatch = html.match(/name="enter"[^>]*value="([^"]+)"/) ||
                       html.match(/value="([^"]+)"[^>]*name="enter"/)
    if (enterMatch?.[1]) enterValue = enterMatch[1]
  } catch (e) {
    console.error("[zabbix-auth] GET failed:", e)
  }

  // Step 2: POST credentials + session cookie (Zabbix 7.x CSRF) + locale-aware enter value
  const formData = new URLSearchParams({
    name:         user,
    password:     pass,
    enter:        enterValue,
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
  } catch (e) {
    console.error("[zabbix-auth] POST failed:", e)
    throw new ZabbixAuthError("No se pudo conectar a Zabbix upstream", "upstream_down")
  }

  // Zabbix redirige al dashboard con Set-Cookie si el login fue exitoso
  const setCookie = res.headers.getSetCookie?.() ?? []
  const rawCookies = Array.isArray(setCookie) ? setCookie : [setCookie].filter(Boolean)
  const sessionCookies = rawCookies.map((c) => c.split(";")[0].trim())

  // Zabbix 7.x: la cookie de sesión se actualiza en el POST exitoso (redirect 302)
  // Zabbix 6.x: zbx_sessionid en redirect
  const hasSession = sessionCookies.some(
    (c) => c.startsWith("zbx_session") || c.startsWith("zbx_sessionid")
  )

  if (!hasSession) {
    console.error("[zabbix-auth] login fallido. POST status:", res.status, "enter value usado:", enterValue, "cookies:", sessionCookies)
    throw new ZabbixAuthError("Login a Zabbix fallido: sin cookie de sesión", "invalid_credentials")
  }

  // Combine initial cookies with session cookies so all subsequent requests are valid
  const allParts = [
    ...initCookieStr.split("; ").filter(Boolean),
    ...sessionCookies,
  ]
  return [...new Set(allParts)].join("; ")
}
