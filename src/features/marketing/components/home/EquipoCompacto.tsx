import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { getEquipo } from "@/data/equipo"

function iniciales(nombre: string) {
    return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

export default function EquipoCompacto() {
    const t = useTranslations("HomePage.equipo")
    const equipo = getEquipo(useLocale())
    return (
        <section className="border-t border-slate-100 bg-[#F8FAFC] py-16">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center lg:px-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("titulo")}</h2>
                    <p className="mt-2 text-slate-500">{t("subtitulo")}</p>
                </div>
                <ul className="flex flex-wrap justify-center -space-x-3">
                    {equipo.map((m) => (
                        <li key={m.id} title={`${m.name} · ${m.role}`} className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-[#F8FAFC] bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] shadow-md transition-transform hover:z-10 hover:-translate-y-1">
                            {m.photo ? (
                                <Image src={m.photo} alt={m.name} fill sizes="64px" className="object-cover" />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">{iniciales(m.name)}</span>
                            )}
                        </li>
                    ))}
                </ul>
                <Link href="/equipo" className="group inline-flex items-center gap-2 text-sm font-bold text-[#0B3C78] hover:text-[#4398FF]">
                    {t("verEquipo")}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </section>
    )
}
