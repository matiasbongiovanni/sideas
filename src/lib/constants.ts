export const METADATA_BASE_URL = "https://sideasconsultores.com.ar"

export const NAV_LINKS = [
  { key: "inicio", href: { pathname: "/", hash: "inicio" } },
  { key: "quienesSomos", href: { pathname: "/", hash: "quienes-somos" } },
  { key: "servicios", href: { pathname: "/servicios" } },
  { key: "proyectos", href: { pathname: "/", hash: "proyectos" } },
  { key: "noticias", href: { pathname: "/noticias" } },
  { key: "equipo", href: { pathname: "/", hash: "equipo" } },
  { key: "contacto", href: { pathname: "/", hash: "contacto" } },
] as const

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/sideas-consultores/",
  facebook: "https://www.facebook.com/sideasconsultores",
  instagram: "https://www.instagram.com/sideasconsultores",
} as const
