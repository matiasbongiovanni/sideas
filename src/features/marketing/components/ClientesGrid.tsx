"use client"

import Image from "next/image"
import Marquee from "react-fast-marquee"
import { useTranslations } from "next-intl"
import { clientes } from "@/data/clientes"

function ClienteLogo({ name, logo, wide }: { name: string; logo: string | null; wide?: boolean }) {
  if (!logo) return null
  return (
    <div className="mx-8 md:mx-12 flex items-center justify-center px-4">
      <div className={`relative ${wide ? "w-[380px] h-[130px]" : "w-[280px] h-[100px]"}`}>
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain filter grayscale invert opacity-60"
          sizes={wide ? "220px" : "160px"}
        />
      </div>
    </div>
  )
}

export default function ClientesGrid() {
  const t = useTranslations("Clientes")
  return (
    <section className="relative py-24 bg-white overflow-hidden border-t border-slate-100">
      {/* Contenedor de Texto */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0B3C78]/20 bg-[#0B3C78]/5 px-4 py-1.5 mb-6 transition-colors hover:bg-[#0B3C78]/10">
          <span className="text-xs font-bold tracking-widest uppercase text-[#0B3C78]">{t("badge")}</span>
        </div>

        <h2 className="text-3xl font-light sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-6">
          {t("titlePrefix")} <span className="font-bold">{t("titleBold")}</span>
        </h2>

        <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-500 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Cinta de logos */}
      <div className="relative max-w-[100vw] mx-auto">
        {/* Gradientes laterales */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <Marquee gradient={false} speed={35} pauseOnHover autoFill>
          {clientes.map((cliente) => (
            <ClienteLogo key={cliente.id} name={cliente.name} logo={cliente.logo} wide={cliente.wide} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}