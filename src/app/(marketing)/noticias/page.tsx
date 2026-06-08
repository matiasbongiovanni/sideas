import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import NewsCard from "@/features/blog/components/NewsCard"
import type { NewsPost } from "@/lib/news"
import { listPublishedNews } from "@/lib/news.server"
import { formatNewsDate, getExcerpt, NEWS_DEFAULT_COVER } from "@/lib/news"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Noticias & Blog | SIDEAS Consultores",
  description: "Artículos, novedades y recursos sobre infraestructura IT, ciberseguridad, automatización y tecnología para empresas en Argentina.",
}

export default async function NoticiasPage() {
  let posts: NewsPost[] = []
  try {
    posts = await listPublishedNews()
  } catch {
    posts = []
  }

  const [featured, ...rest] = posts

  return (
    <main className="min-h-screen flex flex-col font-sans bg-white">
      {/* HERO OSCURO */}
      <section className="relative bg-[#0F172A] pt-40 pb-24 lg:pt-48 lg:pb-32 overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4398FF]/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-[#0B3C78]/20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4398FF]/30 bg-[#4398FF]/10 px-4 py-1.5 mb-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#4398FF]">
              Noticias & Blog
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white tracking-tight leading-tight mb-6">
            Publicaciones y <br className="hidden sm:block" />
            <span className="font-bold text-[#4398FF]">recursos de SIDEAS</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Artículos, novedades y análisis sobre infraestructura IT, ciberseguridad y tecnología empresarial.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[2.5rem] lg:rounded-t-[3rem]" />
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-950">No hay publicaciones todavía.</p>
            <p className="mt-2 text-sm text-slate-500">
              Cuando se publique la primera noticia desde el CMS aparecerá aquí automáticamente.
            </p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-6 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {/* POST DESTACADO */}
            {featured && (
              <div className="group overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_30px_70px_rgba(15,23,42,0.14)]">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative h-64 lg:h-auto lg:w-[45%] shrink-0 overflow-hidden bg-slate-100">
                    <Image
                      src={featured.cover_image_url || NEWS_DEFAULT_COVER}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      unoptimized
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0B3C78] backdrop-blur">
                      Destacado · {featured.category}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {formatNewsDate(featured.published_at)} · {featured.author_name || "SIDEAS Consultores"}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="text-base leading-7 text-slate-600 line-clamp-3">
                      {getExcerpt(featured, 250)}
                    </p>
                    <div>
                      <Link
                        href={`/noticias/${featured.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:brightness-110"
                      >
                        Leer artículo completo
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GRID RESTO */}
            {rest.length > 0 && (
              <div>
                <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                  Más publicaciones
                </h2>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((post) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
