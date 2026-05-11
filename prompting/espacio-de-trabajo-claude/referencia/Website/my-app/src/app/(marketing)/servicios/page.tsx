import type { Metadata } from "next"
import Navbar from "@/features/marketing/components/Navbar"
import ServiciosInteractivos from "./ServiciosInteractivos"

export const metadata: Metadata = {
  title: "Servicios IT | SIDEAS Consultores",
  description:
    "12 servicios de infraestructura tecnológica: DataCenter, VoIP, MikroTik, Zabbix, Google Workspace, identidad digital y más. Soporte 24/7 en Córdoba, Argentina.",
}

export default function ServiciosPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />

      {/* HERO SECTION OSCURO (El Navbar arranca transparente sobre esto) */}
      <section className="relative bg-[#0F172A] pt-40 pb-24 lg:pt-48 lg:pb-32 overflow-hidden shrink-0">
        {/* Decoraciones */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4398FF]/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-[#0B3C78]/20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4398FF]/30 bg-[#4398FF]/10 px-4 py-1.5 mb-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#4398FF]">
              Catálogo de Servicios IT
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white tracking-tight leading-tight mb-6">
            Infraestructura robusta <br className="hidden sm:block" />
            <span className="font-bold text-[#4398FF]">para tu negocio</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explorá nuestras áreas de especialización y descubrí cómo podemos optimizar el rendimiento y la seguridad de tu empresa.
          </p>
        </div>

        {/* Borde curvo para conectar con el blanco */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[2.5rem] lg:rounded-t-[3rem]" />
      </section>

      {/* LISTADO DE SERVICIOS CON FILTROS */}
      <ServiciosInteractivos />

    </main>
  )
}