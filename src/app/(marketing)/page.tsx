import type { Metadata } from "next"
import Link from "next/link"
import Hero from "@/features/marketing/components/Hero"
import Timeline from "@/features/marketing/components/Timeline"
import StatsWrapper from "@/features/marketing/components/StatsWrapper"
import ClientesWrapper from "@/features/marketing/components/ClientesWrapper"
import FAQ from "@/features/marketing/components/FAQ"
import Contacto from "./contacto/Contacto"
import ProyectosPreview from "./proyectos/Preview/ProyectosPreview"
import Equipo from "./equipo/page"
import NewsCard from "@/features/blog/components/NewsCard"
import type { NewsPost } from "@/lib/news"
import { listPublishedNews } from "@/lib/news.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "SIDEAS Consultores | Infraestructura IT en Córdoba",
  description:
    "Empresa de servicios IT en Córdoba, Argentina. DataCenter, soporte 24/7, VoIP, MikroTik, Zabbix, Google Workspace e identidad digital. Desde 2020.",
  openGraph: {
    title: "SIDEAS Consultores | Infraestructura IT en Córdoba",
    description:
      "Empresa de servicios IT en Córdoba, Argentina. DataCenter, soporte 24/7, VoIP, MikroTik, Zabbix, Google Workspace e identidad digital. Desde 2020.",
    url: "https://sideasconsultores.com.ar",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
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
                Noticias &amp; Blogs
              </h2>
              <div className="hidden sm:block h-[2px] w-32" style={{ background: "#0850A0" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#0850A0" }}>Las noticias</p>
            <p className="text-lg font-semibold" style={{ color: "#0F172A" }}>más recientes.</p>
          </div>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:brightness-110"
          >
            Ver todos nuestros blogs
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold" style={{ color: "#0F172A" }}>Aún no hay publicaciones.</p>
            <p className="mt-2 text-sm text-slate-500">
              Cuando subas la primera noticia desde el CMS, aparecerá acá automáticamente.
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

