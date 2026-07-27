import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/quienes-somos": { es: "/about-us", en: "/quienes-somos" },
    "/servicios": { es: "/services", en: "/servicios" },
    "/proyectos": { es: "/projects", en: "/proyectos" },
    "/proyectos/[slug]": { es: "/projects/[slug]", en: "/proyectos/[slug]" },
    "/equipo": { es: "/team", en: "/equipo" },
    "/noticias": { es: "/news", en: "/noticias" },
    "/noticias/[slug]": { es: "/news/[slug]", en: "/noticias/[slug]" },
  },
})

export type AppLocale = (typeof routing.locales)[number]
