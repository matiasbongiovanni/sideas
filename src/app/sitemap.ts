import type { MetadataRoute } from "next"
import { METADATA_BASE_URL } from "@/lib/constants"
import { getProyectos } from "@/data/proyectos"
import { listPublishedNews } from "@/lib/news.server"
import { routing } from "@/i18n/routing"
import { getPathname } from "@/i18n/navigation"

type StaticRoute = "/" | "/quienes-somos" | "/servicios" | "/proyectos" | "/equipo"

function localizedEntry(
  pathname: StaticRoute,
  opts: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${METADATA_BASE_URL}${getPathname({ locale, href: pathname })}`,
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${METADATA_BASE_URL}${getPathname({ locale: l, href: pathname })}`])
      ),
    },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    ...localizedEntry("/", { changeFrequency: "weekly", priority: 1 }),
    ...localizedEntry("/quienes-somos", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/servicios", { changeFrequency: "monthly", priority: 0.9 }),
    ...localizedEntry("/proyectos", { changeFrequency: "monthly", priority: 0.8 }),
    ...localizedEntry("/equipo", { changeFrequency: "monthly", priority: 0.7 }),
  ]

  const proyectoRoutes: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    getProyectos(locale).map((p) => ({
      url: `${METADATA_BASE_URL}${getPathname({ locale, href: { pathname: "/proyectos/[slug]", params: { slug: p.slug } } })}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  )

  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await listPublishedNews()
    // El contenido de las noticias no está duplicado por idioma (queda en el idioma original)
    blogRoutes = posts.map((p) => ({
      url: `${METADATA_BASE_URL}${getPathname({ locale: routing.defaultLocale, href: { pathname: "/noticias/[slug]", params: { slug: p.slug } } })}`,
      lastModified: new Date(p.updated_at || p.published_at || p.created_at),
      changeFrequency: "weekly",
      priority: 0.5,
    }))
  } catch {
    blogRoutes = []
  }

  return [...staticRoutes, ...proyectoRoutes, ...blogRoutes]
}
