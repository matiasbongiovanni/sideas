import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublishedNewsBySlug, listPublishedNews } from "@/lib/news.server"
import { formatNewsDate, NEWS_DEFAULT_COVER } from "@/lib/news"

interface Props {
  params: Promise<{ slug: string }>
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
  const { slug } = await params
  let post = null

  try {
    post = await getPublishedNewsBySlug(slug)
  } catch {
    post = null
  }

  if (!post) notFound()

  const cover = post.cover_image_url || NEWS_DEFAULT_COVER

  return (
    <main className="bg-[#f8fafc] py-24">
      <article className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#0B3C78] px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
            {post.category}
          </span>
          <span className="text-sm text-slate-500">{formatNewsDate(post.published_at)}</span>
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

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-slate-200 pt-8">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:border-[#4398FF] hover:text-[#0B3C78]"
          >
            Volver a Noticias
          </Link>
          <span className="text-sm text-slate-500">Publicación desde el CMS privado de SIDEAS</span>
        </div>
      </article>
    </main>
  )
}
