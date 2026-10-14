export const METADATA_BASE_URL = "https://sideasconsultores.com.ar"

export const NAV_LINKS = [
  { key: "inicio", href: { pathname: "/", hash: "inicio" } },
  { key: "servicios", href: { pathname: "/servicios" } },
  { key: "proyectos", href: { pathname: "/", hash: "proyectos" } },
  { key: "equipo", href: { pathname: "/", hash: "equipo" } },
  { key: "noticias", href: { pathname: "/noticias" } },
  { key: "contacto", href: { pathname: "/", hash: "contacto" } },
] as const

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/sideas-consultores/",
  facebook: "https://www.facebook.com/sideasconsultores",
  instagram: "https://www.instagram.com/sideasconsultores",
} as const
