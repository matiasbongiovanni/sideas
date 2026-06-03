export type NewsStatus = "draft" | "published"

export interface NewsPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category: string
  author_name: string | null
  status: NewsStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export const NEWS_CATEGORIES = [
  "Infraestructura",
  "Ciberseguridad",
  "Automatización",
  "Cloud",
  "Cultura",
  "Blog",
] as const

export const NEWS_TABLE = "news_posts"

export const NEWS_DEFAULT_COVER =
  "https://placehold.co/1200x675/0b1220/e2e8f0?text=SIDEAS+Noticias"

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

export function getExcerpt(post: Pick<NewsPost, "excerpt" | "content">, maxLength = 180) {
  if (post.excerpt?.trim()) return post.excerpt.trim()
  const normalized = post.content.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trimEnd()}...`
}

export function formatNewsDate(value: string | null | undefined) {
  if (!value) return "Sin fecha"

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export function formatNewsDateTime(value: string | null | undefined) {
  if (!value) return "Sin fecha"

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 16)
}

