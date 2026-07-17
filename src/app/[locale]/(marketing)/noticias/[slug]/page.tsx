import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getPublishedNewsBySlug, listPublishedNews } from "@/lib/news.server"
import { formatNewsDate, NEWS_DEFAULT_COVER } from "@/lib/news"
import type { NewsPost } from "@/lib/news"
import NewsCard from "@/features/blog/components/NewsCard"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await listPublishedNews()
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let post = null

  try {
    post = await getPublishedNewsBySlug(slug)
  } catch {
    post = null
  }

  if (!post) return {}
  return {
    title: `${post.title} | SIDEAS Consultores`,
    description: post.excerpt ?? undefined,
  }
}

export const dynamic = "force-dynamic"

export default async function NoticiaDetalle({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: "NoticiaDetalle" })
  let post = null

  try {
    post = await getPublishedNewsBySlug(slug)
  } catch {
    post = null
  }

  if (!post) notFound()

  const cover = post.cover_image_url || NEWS_DEFAULT_COVER

  // Artículos relacionados
  let related: NewsPost[] = []
  try {
    const all = await listPublishedNews(4)
    related = all.filter((p) => p.id !== post.id).slice(0, 3)
  } catch {
    related = []
  }

  return (
    <main className="bg-[#f8fafc] pt-28 pb-24">
      <article className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-[#0B3C78] transition-colors">{t("inicio")}</Link>
          <span>/</span>
          <Link href="/noticias" className="hover:text-[#0B3C78] transition-colors">{t("noticias")}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#0B3C78] px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
            {post.category}
          </span>
          <span className="text-sm text-slate-500">{formatNewsDate(post.published_at, locale)}</span>
          <span className="text-sm text-slate-500">{post.author_name || "SIDEAS Consultores"}</span>
        </div>

        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <Image src={cover} alt={post.title} fill className="object-cover" unoptimized />
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
            {post.excerpt}
          </p>
        ) : null}

        <div className="prose prose-slate mt-10 max-w-none prose-p:leading-8 prose-headings:tracking-tight prose-a:text-[#0B3C78]">
          <div className="whitespace-pre-line rounded-[28px] border border-slate-200 bg-white p-8 text-[17px] leading-8 text-slate-700 shadow-sm">
            {post.content}
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-6 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all"
          >
            ← {t("volver")}
          </Link>
        </div>
      </article>

      {/* Artículos relacionados */}
      {related.length >= 2 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 mt-20 pt-12 border-t border-slate-200">
          <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            {t("masArticulos")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
