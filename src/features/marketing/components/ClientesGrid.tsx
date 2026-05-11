"use client"

import Image from "next/image"
import Marquee from "react-fast-marquee"
import { clientes } from "@/data/clientes"

function ClienteLogo({ name, logo }: { name: string; logo: string | null }) {
  if (!logo) return null
  return (
    <div className="mx-8 md:mx-12 flex items-center justify-center px-4">
      <div className="relative w-[280px] h-[100px]">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain filter grayscale invert opacity-60"
          sizes="160px"
        />
      </div>
    </div>
  )
}

export default function ClientesGrid() {
  return (
    <section className="relative py-24 bg-white overflow-hidden border-t border-slate-100">
      {/* Contenedor de Texto */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0B3C78]/20 bg-[#0B3C78]/5 px-4 py-1.5 mb-6 transition-colors hover:bg-[#0B3C78]/10">
          <span className="text-xs font-bold tracking-widest uppercase text-[#0B3C78]">Clientes</span>
        </div>

        <h2 className="text-3xl font-light sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-6">
          Empresas que <span className="font-bold">confían en nosotros</span>
        </h2>

        <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-500 leading-relaxed">
          Desde organismos públicos hasta empresas del sector privado, SIDEAS acompaña a sus clientes con soluciones IT confiables y a medida.
        </p>
      </div>

      {/* Cinta de logos */}
      <div className="relative max-w-[100vw] mx-auto">
        {/* Gradientes laterales */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <Marquee gradient={false} speed={35} pauseOnHover autoFill>
          {clientes.map((cliente) => (
            <ClienteLogo key={cliente.id} name={cliente.name} logo={cliente.logo} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}