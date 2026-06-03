import { createAdminClient } from "@/lib/supabase/server"
import { getExcerpt, slugify, type NewsPost, type NewsStatus, NEWS_TABLE } from "@/lib/news"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"

type NewsRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category: string | null
  author_name: string | null
  status: NewsStatus | null
  published_at: string | null
  created_at: string
  updated_at: string
}

function normalizeNewsPost(row: NewsRow): NewsPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? null,
    content: row.content,
    cover_image_url: row.cover_image_url ?? null,
    category: row.category ?? "Blog",
    author_name: row.author_name ?? null,
    status: row.status ?? "draft",
    published_at: row.published_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function getClient() {
  return await createAdminClient()
}

export async function requireAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) return null
  return { user }
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const client = await getClient()
  const safeBase = baseSlug || `noticia-${Date.now()}`
  let candidate = safeBase

  for (let index = 0; index < 25; index += 1) {
    let query = client.from(NEWS_TABLE).select("id").eq("slug", candidate).limit(1)
    if (excludeId) query = query.neq("id", excludeId)

    const { data, error } = await query
    if (error) throw error
    if (!data || data.length === 0) return candidate
    candidate = `${safeBase}-${index + 2}`
  }

  return `${safeBase}-${Date.now()}`
}

export async function listPublishedNews(limit?: number) {
  const client = await getClient()
  let query = client
    .from(NEWS_TABLE)
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(normalizeNewsPost)
}

export async function getPublishedNewsBySlug(slug: string) {
  const client = await getClient()
  const { data, error } = await client
    .from(NEWS_TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) throw error
  return data ? normalizeNewsPost(data) : null
}

export async function listAdminNews() {
  const client = await getClient()
  const { data, error } = await client
    .from(NEWS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []).map(normalizeNewsPost)
}

export async function createNewsPost(input: {
  title: string
  slug?: string | null
  excerpt?: string | null
  content: string
  cover_image_url?: string | null
  category?: string
  author_name?: string | null
  status: NewsStatus
  published_at?: string | null
}) {
  const client = await getClient()
  const slug = await ensureUniqueSlug(slugify(input.slug ?? input.title))
  const publishedAt =
    input.status === "published" ? input.published_at ?? new Date().toISOString() : input.published_at ?? null

  const payload = {
    slug,
    title: input.title,
    excerpt: input.excerpt ?? null,
    content: input.content,
    cover_image_url: input.cover_image_url ?? null,
    category: input.category ?? "Blog",
    author_name: input.author_name ?? "SIDEAS Consultores",
    status: input.status,
    published_at: publishedAt,
  }

  const { data, error } = await client.from(NEWS_TABLE).insert(payload).select("*").single()
  if (error) throw error
  return normalizeNewsPost(data)
}

export async function updateNewsPost(
  id: string,
  input: {
    title: string
    excerpt?: string | null
    content: string
    cover_image_url?: string | null
    category?: string
    author_name?: string | null
    status: NewsStatus
    published_at?: string | null
    slug?: string | null
  },
) {
  const client = await getClient()
  const slug = await ensureUniqueSlug(slugify(input.slug ?? input.title), id)
  const publishedAt =
    input.status === "published" ? input.published_at ?? new Date().toISOString() : input.published_at ?? null

  const { data, error } = await client
    .from(NEWS_TABLE)
    .update({
      slug,
      title: input.title,
      excerpt: input.excerpt ?? null,
      content: input.content,
      cover_image_url: input.cover_image_url ?? null,
      category: input.category ?? "Blog",
      author_name: input.author_name ?? "SIDEAS Consultores",
      status: input.status,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return normalizeNewsPost(data)
}

export async function deleteNewsPost(id: string) {
  const client = await getClient()
  const { error } = await client.from(NEWS_TABLE).delete().eq("id", id)
  if (error) throw error
}

export function summarizeNews(post: Pick<NewsPost, "excerpt" | "content">) {
  return getExcerpt(post)
}
