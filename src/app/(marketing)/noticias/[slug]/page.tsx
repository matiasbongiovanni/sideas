import { notFound } from "next/navigation"
import Link from "next/link"
import { posts } from "@/data/blog"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return posts.filter((p) => p.published).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && p.published)
  if (!post) return {}
  return {
    title: `${post.title} | SIDEAS Consultores`,
    description: post.shortDescription,
    robots: { index: false },
  }
}

export default async function NoticiaDetalle({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && p.published)
  if (!post) notFound()

  return (
    <main className="min-h-screen py-24" style={{ background: "#F8FAFC" }}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full px-4 py-1 text-xs font-medium" style={{ background: "#4398FF", color: "#fff" }}>
            {post.category}
          </span>
          <span className="text-xs" style={{ color: "#64748B" }}>{post.date}</span>
        </div>

        <h1 className="text-3xl font-bold mb-6 sm:text-4xl" style={{ color: "#0F172A" }}>
          {post.title}
        </h1>

        <p className="text-lg leading-relaxed mb-10" style={{ color: "#64748B" }}>
          {post.shortDescription}
        </p>

        <div className="prose prose-slate max-w-none mb-12">
          <p className="text-base leading-relaxed" style={{ color: "#64748B" }}>
            {post.content}
          </p>
        </div>

        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
          style={{ color: "#4398FF" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Noticias
        </Link>
      </div>
    </main>
  )
}
