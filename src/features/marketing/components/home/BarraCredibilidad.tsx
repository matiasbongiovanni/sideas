"use client"

import Image from "next/image"
import Marquee from "react-fast-marquee"
import { useTranslations } from "next-intl"
import { clientes } from "@/data/clientes"

// Todos los logos con el mismo peso visual que CREDICOR (140×70): misma área, alto tope 70px.
const AREA_LOGO = 140 * 70
const ALTO_MAX = 70

function tamanoLogo(ratio = 2) {
    const alto = Math.min(ALTO_MAX, Math.sqrt(AREA_LOGO / ratio))
    return { width: Math.round(alto * ratio), height: Math.round(alto) }
}

// Franja oscura bajo el hero: "Nos eligen desde 2020" + cinta de logos de clientes.
export default function BarraCredibilidad() {
    const t = useTranslations("HomePage.credibilidad")
    return (
        <section className="relative overflow-hidden border-y border-white/5 py-10" style={{ background: "#0F172A" }}>
            <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">{t("titulo")}</p>
            <div className="relative mx-auto max-w-[100vw]">
                <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-[#0F172A] to-transparent md:w-48" />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-[#0F172A] to-transparent md:w-48" />
                <Marquee gradient={false} speed={35} pauseOnHover autoFill>
                    {clientes.map((c) =>
                        c.logo ? (
                            <div key={c.id} className="mx-8 flex items-center justify-center md:mx-12">
                                <div className="relative" style={tamanoLogo(c.ratio)}>
                                    <Image src={c.logo} alt={c.name} fill className="object-contain opacity-70" sizes="300px" />
                                </div>
                            </div>
                        ) : null
                    )}
                </Marquee>
            </div>
        </section>
    )
}
