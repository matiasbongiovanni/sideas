import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/quienes-somos": "/quienes-somos",
    "/servicios": "/servicios",
    "/proyectos": "/proyectos",
    "/proyectos/[slug]": "/proyectos/[slug]",
    "/equipo": "/equipo",
    "/noticias": "/noticias",
    "/noticias/[slug]": "/noticias/[slug]",
  },
})

export type AppLocale = (typeof routing.locales)[number]
