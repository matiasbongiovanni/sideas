import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { getProyectos } from "@/data/proyectos"
import Navbar from "@/features/marketing/components/Navbar"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "Proyectos" })
    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
    }
}

export default function Proyectos() {
    const t = useTranslations("Proyectos")
    const locale = useLocale()
    const proyectos = getProyectos(locale)
    return (
        <main className="min-h-screen flex flex-col font-sans">
            <Navbar />

            <section className="relative bg-slate-950 pt-40 pb-24 lg:pt-48 lg:pb-32 overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4398FF]/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-[#0B3C78]/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white tracking-tight leading-tight mb-6">
                        {t("titlePrefix")} <span className="font-bold">{t("titleBold")}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50 rounded-t-[3rem] lg:rounded-t-[4rem]" />
            </section>

            <section id="proyectos" className="relative flex-1 bg-slate-50 pb-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col gap-24 lg:gap-32">
                        {proyectos.map((project, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={project.slug}
                                    className={`flex flex-col gap-10 lg:gap-16 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                                >
                                    <div className="w-full lg:w-1/2 relative group">
                                        <Link href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }} className="block relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-200">
                                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />

                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        </Link>
                                    </div>

                                    <div className="w-full lg:w-1/2 flex flex-col items-start">
                                        <div className="flex items-center gap-2 flex-wrap mb-6">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest bg-[#4398FF]/10 text-[#4398FF] border border-[#4398FF]/20"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <Link href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }}>
                                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-5 hover:text-[#4398FF] transition-colors">
                                                {project.title}
                                            </h3>
                                        </Link>

                                        <p className="text-lg leading-relaxed text-slate-600 mb-8">
                                            {project.description}
                                        </p>

                                        <Link
                                            href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }}
                                            className="group inline-flex items-center gap-3 rounded-full bg-white border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:border-[#4398FF]/30 hover:shadow-md hover:text-[#4398FF]"
                                        >
                                            {t("verCasoExito")}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    )
}