import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  // /en muestra contenido en español y /es en inglés (swap pedido por el cliente): invertir el json cargado
  const contentLocale = locale === "en" ? "es" : "en"

  return {
    locale,
    messages: (await import(`../../messages/${contentLocale}.json`)).default,
  }
})
