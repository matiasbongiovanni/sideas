import type { Metadata } from "next"
import Link from "next/link"
import NewsCard from "@/features/blog/components/NewsCard"
import type { NewsPost } from "@/lib/news"
import { listPublishedNews } from "@/lib/news.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Noticias & Blog | SIDEAS Consultores",
  description:
    "Artículos, novedades y recursos sobre infraestructura IT, ciberseguridad, automatización y tecnología para empresas en Argentina.",
}

export default async function NoticiasPage() {
  let posts: NewsPost[] = []

  try {
    posts = await listPublishedNews()
  } catch {
    posts = []
  }

  return (
    <main className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#4398FF]">
              Noticias / Blog
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Lo último de SIDEAS
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Publicaciones, artículos y novedades editoriales creadas desde el panel privado.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:border-[#4398FF] hover:text-[#0B3C78]"
          >
            Volver al inicio
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-950">No hay noticias publicadas todavía.</p>
            <p className="mt-2 text-sm text-slate-500">
              En cuanto publiques la primera desde el CMS, aparecerá aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
