import type { MetadataRoute } from "next"
import { METADATA_BASE_URL } from "@/lib/constants"
import { proyectos } from "@/data/proyectos"
import { posts } from "@/data/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = METADATA_BASE_URL

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/quienes-somos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/servicios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/proyectos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/equipo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const proyectoRoutes: MetadataRoute.Sitemap = proyectos.map((p) => ({
    url: `${base}/proyectos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // Blog excluido del sitemap hasta que tenga posts publicados
  const publishedPosts = posts.filter((p) => p.published)
  const blogRoutes: MetadataRoute.Sitemap = publishedPosts.map((p) => ({
    url: `${base}/noticias/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...proyectoRoutes, ...blogRoutes]
}
