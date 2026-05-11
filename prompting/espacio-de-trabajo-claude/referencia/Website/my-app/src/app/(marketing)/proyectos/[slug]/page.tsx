import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { proyectos } from "@/data/proyectos"

// ─── Static Generation (Next.js best practice) ────────────────────────────────

export async function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = proyectos.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} — SIDEAS Proyectos`,
    description: project.challenge,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProyectoDetalle({ params }: PageProps) {
  const { slug } = await params
  const project = proyectos.find((p) => p.slug === slug)

  if (!project) notFound()

  return (
    <main className="min-h-screen bg-[#0A0F1E] selection:bg-blue-500/30 selection:text-white">

      {/* ── Noise texture overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-20vw] top-[-10vh] z-0 h-[60vh] w-[60vw] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(67,152,255,0.35) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-28 lg:px-12 lg:py-36">

        {/* ── Back link ── */}
        <Link
          href="/proyectos"
          className="group mb-16 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 transition-colors hover:text-blue-400"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 transition-all group-hover:border-blue-500 group-hover:bg-blue-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </span>
          Volver al portafolio
        </Link>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-20">

          {/* ════════════════════════════════
              COLUMNA IZQUIERDA — Sticky Info
          ════════════════════════════════ */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-10">

            {/* Category pill */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {project.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white lg:text-6xl">
                {project.title}
              </h1>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700 bg-slate-800/60 px-3.5 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-slate-700 via-blue-500/30 to-transparent" />

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Ubicación
                </p>
                <p className="text-sm font-medium text-slate-200">
                  {project.location}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Año
                </p>
                <p className="text-sm font-medium text-slate-200">
                  {project.year}
                </p>
              </div>
            </div>

            {/* Challenge */}
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Desafío
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                {project.challenge}
              </p>
            </div>

            {/* Strategy */}
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Solución Implementada
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                {project.strategy}
              </p>
            </div>

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <div>
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Resultados
                </p>
                <ul className="flex flex-col gap-2">
                  {project.results.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            {project.websiteUrl && (
              <div className="pt-2">
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-600/20 to-blue-500/10 px-6 py-3.5 text-sm font-semibold text-blue-300 backdrop-blur-sm transition-all hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-white"
                >
                  Visitar Sitio Web
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </aside>

          {/* ════════════════════════════════
              COLUMNA DERECHA — Images
          ════════════════════════════════ */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            {project.images.map((imgSrc, index) => (
              <div
                key={index}
                className="group relative w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/40 shadow-[0_0_0_1px_rgba(67,152,255,0.05)] backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(67,152,255,0.08)]"
                style={{ minHeight: "360px" }}
              >
                {/* Image number badge */}
                <div className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-600/60 bg-slate-900/80 text-[10px] font-bold text-slate-400 backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <Image
                  src={imgSrc}
                  alt={`${project.title} — vista ${index + 1}`}
                  width={1200}
                  height={800}
                  priority={index === 0}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Subtle bottom gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0F1E]/60 to-transparent" />
              </div>
            ))}

            {/* Bottom CTA card */}
            <div className="mt-4 rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 backdrop-blur-sm">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                ¿Tenés un proyecto similar?
              </p>
              <p className="mb-6 text-lg font-semibold text-white">
                Hablemos y encontremos la solución para tu empresa.
              </p>
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/30"
              >
                Solicitar asesoramiento
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}