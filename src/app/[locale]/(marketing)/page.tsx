import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import Hero from "@/features/marketing/components/Hero"
import Timeline from "@/features/marketing/components/Timeline"
import ClientesWrapper from "@/features/marketing/components/ClientesWrapper"
import FAQ from "@/features/marketing/components/FAQ"
import Contacto from "./contacto/Contacto"
import ProyectosPreview from "./proyectos/Preview/ProyectosPreview"
import Equipo from "./equipo/page"
import NewsCard from "@/features/blog/components/NewsCard"
import type { NewsPost } from "@/lib/news"
import { listPublishedNews } from "@/lib/news.server"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://sideasconsultores.com.ar/${locale}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  }
}

export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <ProyectosPreview />
      <ClientesWrapper />
      <NoticiasSection />
      <Equipo />
      <FAQ />
      <Contacto />
    </>
  )
}

async function NoticiasSection() {
  const t = await getTranslations("HomePage")
  let posts: NewsPost[] = []

  try {
    posts = await listPublishedNews(3)
  } catch {
    posts = []
  }

  return (
    <section className="py-24" style={{ background: "#F8FAFC" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#0F172A" }}>
                {t("noticiasTitle")}
              </h2>
              <div className="hidden sm:block h-[2px] w-32" style={{ background: "#0850A0" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#0850A0" }}>{t("noticiasKicker1")}</p>
            <p className="text-lg font-semibold" style={{ color: "#0F172A" }}>{t("noticiasKicker2")}</p>
          </div>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:brightness-110"
          >
            {t("verTodosBlogs")}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold" style={{ color: "#0F172A" }}>{t("sinPublicaciones")}</p>
            <p className="mt-2 text-sm text-slate-500">
              {t("cuandoSubas")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

