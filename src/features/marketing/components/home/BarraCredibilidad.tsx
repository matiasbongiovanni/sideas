"use client"

import Image from "next/image"
import Marquee from "react-fast-marquee"
import { useTranslations } from "next-intl"
import { clientes } from "@/data/clientes"

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
                                <div className={`relative ${c.wide ? "h-[90px] w-[260px]" : "h-[70px] w-[180px]"}`}>
                                    <Image src={c.logo} alt={c.name} fill className="object-contain opacity-70" sizes="260px" />
                                </div>
                            </div>
                        ) : null
                    )}
                </Marquee>
            </div>
        </section>
    )
}
