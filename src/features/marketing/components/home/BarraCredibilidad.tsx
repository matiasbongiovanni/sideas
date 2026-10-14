import { useTranslations } from "next-intl"

// Mismas cifras que ya publica /quienes-somos (Stats.tsx); no se suman datos nuevos sin verificar.
export default function BarraCredibilidad() {
    const t = useTranslations("HomePage.credibilidad")
    const items = [
        { value: "2020", label: t("fundacion"), prefijo: true },
        { value: "+15", label: t("clientes") },
        { value: "24/7", label: t("soporte") },
        { value: "12", label: t("servicios") },
    ]
    return (
        <section className="border-y border-white/5" style={{ background: "#0F172A" }}>
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-6 py-10 lg:grid-cols-4 lg:px-8">
                {items.map((it) => (
                    <div key={it.label} className="text-center">
                        <p className="text-3xl font-bold tabular-nums text-[#4398FF] lg:text-4xl">
                            {it.prefijo && <span className="mr-2 text-base font-medium text-slate-400">{it.label}</span>}
                            {it.value}
                        </p>
                        {!it.prefijo && <p className="mt-1 text-sm text-slate-400">{it.label}</p>}
                    </div>
                ))}
            </div>
        </section>
    )
}
