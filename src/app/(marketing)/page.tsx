import type { Metadata } from "next"
import Hero from "@/features/marketing/components/Hero"
import Timeline from "@/features/marketing/components/Timeline"
import StatsWrapper from "@/features/marketing/components/StatsWrapper"
import ClientesWrapper from "@/features/marketing/components/ClientesWrapper"
import TestimoniosGrid from "@/features/marketing/components/TestimoniosGrid"
import FAQ from "@/features/marketing/components/FAQ"
import Contacto from "./contacto/Contacto"
import ProyectosPreview from "./proyectos/Preview/ProyectosPreview"
import Equipo from "./equipo/page"

export const metadata: Metadata = {
  title: "SIDEAS Consultores | Infraestructura IT en Córdoba",
  description:
    "Empresa de servicios IT en Córdoba, Argentina. DataCenter, soporte 24/7, VoIP, MikroTik, Zabbix, Google Workspace e identidad digital. Desde 2020.",
  openGraph: {
    title: "SIDEAS Consultores | Infraestructura IT en Córdoba",
    description:
      "Empresa de servicios IT en Córdoba, Argentina. DataCenter, soporte 24/7, VoIP, MikroTik, Zabbix, Google Workspace e identidad digital. Desde 2020.",
    url: "https://sideasconsultores.com.ar",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
}

export default function Home() {
  return (
    <>
      <Hero />
      <Timeline />
      <ProyectosPreview />
      <ClientesWrapper />
      <TestimoniosGrid />
      <Equipo />
      <FAQ />
      <Contacto />
    </>
  )
}
