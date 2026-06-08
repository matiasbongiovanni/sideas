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
  const url = `${baseUrl}/index.php`

  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name:      user,
        password:  pass,
        enter:     "Sign in",
        autologin: "1",
      }),
      redirect: "manual",
    })
  } catch {
    throw new ZabbixAuthError("No se pudo conectar a Zabbix upstream", "upstream_down")
  }

  // Zabbix redirige al dashboard si el login fue exitoso
  const setCookie = res.headers.getSetCookie?.() ?? []
  const rawCookies = Array.isArray(setCookie) ? setCookie : [setCookie].filter(Boolean)

  const sessionCookie = rawCookies
    .map((c) => c.split(";")[0].trim())
    .find((c) => c.startsWith("zbx_session") || c.startsWith("zbx_sessionid"))

  if (!sessionCookie) {
    // No se recibió cookie de sesión — credenciales inválidas o login page sin redirect
    throw new ZabbixAuthError("Login a Zabbix fallido: sin cookie de sesión", "invalid_credentials")
  }

  return sessionCookie
}
