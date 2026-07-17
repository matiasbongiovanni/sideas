import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/quienes-somos": { es: "/quienes-somos", en: "/about-us" },
    "/servicios": { es: "/servicios", en: "/services" },
    "/proyectos": { es: "/proyectos", en: "/projects" },
    "/proyectos/[slug]": { es: "/proyectos/[slug]", en: "/projects/[slug]" },
    "/equipo": { es: "/equipo", en: "/team" },
    "/noticias": { es: "/noticias", en: "/news" },
    "/noticias/[slug]": { es: "/noticias/[slug]", en: "/news/[slug]" },
  },
})

export type AppLocale = (typeof routing.locales)[number]
