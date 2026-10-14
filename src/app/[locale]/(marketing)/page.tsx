import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Hero from "@/features/marketing/components/Hero"
import FAQ from "@/features/marketing/components/FAQ"
import Contacto from "./contacto/Contacto"
import ProyectosPreview from "./proyectos/Preview/ProyectosPreview"
import BarraCredibilidad from "@/features/marketing/components/home/BarraCredibilidad"
import DemosVideos from "@/features/marketing/components/home/DemosVideos"
import ServiciosBloques from "@/features/marketing/components/home/ServiciosBloques"
import Equipo from "./equipo/page"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://sideasconsultores.com.ar/${locale}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  }
}

export default function Home() {
  return (
    <>
      <Hero />
      <BarraCredibilidad />
      <DemosVideos />
      <ServiciosBloques />
      <ProyectosPreview />
      <Equipo />
      <FAQ />
      <Contacto />
    </>
  )
}
