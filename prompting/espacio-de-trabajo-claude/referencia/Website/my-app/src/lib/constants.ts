export const METADATA_BASE_URL = "https://sideasconsultores.com.ar"

export const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#quienes-somos", label: "Quiénes Somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#equipo", label: "Equipo" },
  { href: "/#contacto", label: "Contacto" },
] as const

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/sideas-consultores",
  facebook: "https://www.facebook.com/sideasconsultores",
  instagram: "https://www.instagram.com/sideasconsultores",
} as const

export const WEBHOOKS = {
  chatbot: "https://secretaria.sideasconsultores.com.ar/webhook/Agente-Web",
  contactForm: "https://secretaria.sideasconsultores.com.ar/webhook/Agente-Email",
} as const
