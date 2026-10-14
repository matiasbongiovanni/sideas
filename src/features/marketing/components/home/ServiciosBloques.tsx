import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

const ICONOS: Record<string, string> = {
    b1: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
    b2: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
    b3: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    b4: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
}

export default function ServiciosBloques() {
    const t = useTranslations("HomePage.servicios")
    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center rounded-full border border-[#4398FF]/20 bg-[#4398FF]/5 px-3 py-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B3C78]">{t("badge")}</span>
                        </div>
                        <h2 className="text-4xl font-light tracking-tight text-slate-900 lg:text-5xl">
                            {t("titlePrefix")} <span className="font-bold">{t("titleBold")}</span>
                        </h2>
                    </div>
                    <Link
                        href="/servicios"
                        className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#0F172A] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
                    >
                        {t("verTodos")}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {(["b1", "b2", "b3", "b4"] as const).map((b) => (
                        <div key={b} className="rounded-3xl border border-slate-100 bg-[#F8FAFC] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={ICONOS[b]} />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{t(`${b}Title`)}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(`${b}Text`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
