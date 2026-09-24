import type { TeamMember } from "@/features/marketing/types"

const equipoEs: TeamMember[] = [
  {
    id: "roberto-acevedo",
    name: "Roberto Acevedo",
    role: "CEO & Fundador",
    photo: "/equipo/roberto-acevedo.png",
    linkedinUrl: "https://www.linkedin.com/in/betoacevedo/",
  },
  {
    id: "jose-martinengo",
    name: "José Martinengo",
    role: "CIO",
    photo: "/equipo/jose-martinengo.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/josemartinengo/",
  },
  {
    id: "celia-lombardo",
    name: "Celia Lombardo",
    role: "Lic. en Sistemas – Especialista en ERP Tango Software",
    photo: "/equipo/celia-lombardo.png",
    linkedinUrl: "https://www.linkedin.com/in/celia-lombardo-049098251/",
  },
  {
    id: "andrea-garcia",
    name: "Andrea Garcia",
    role: "Analista de Sistemas",
    photo: "/equipo/andrea-garcia.png",
  },
  {
    id: "rodolfo-abba",
    name: "Rodolfo Abbá",
    role: "CTO",
    photo: "/equipo/rodolfo-abba.png",
    linkedinUrl: "https://www.linkedin.com/in/rodolfo-gabriel-abb%C3%A1-26137265/",
  },
  {
    id: "walter-casari",
    name: "Walter Casari",
    role: "Especialista en infraestructura de Microsoft",
    photo: "/equipo/walter-casari.png",
  },
  {
    id: "ivan-calderon",
    name: "Ivan Calderon",
    role: "Encargado de servicios de microtik",
    photo: "/equipo/ivan-calderon.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/ivan-calderon-9853918a/",
  },
  {
    id: "gabriel-rios",
    name: "Gabriel Angel Rios",
    role: "Encargado en servicios de Microtik",
    photo: "/equipo/gabrielrios.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/gabriel-angel-rios-235636184/",
  },
  {
    id: "matias-bongiovanni",
    name: "Matias Bongiovanni",
    role: "Full Stack Developer",
    photo: "/equipo/matias-bongiovanni.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/matibongiovanni/",
  },
  {
    id: "luna-casari",
    name: "Luna Casari",
    role: "Analista de RRHH",
    photo: "/equipo/luna-casari.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/luna-casari",
  },
  {
    id: "maria-casari",
    name: "María Casari",
    role: "Analista de infraestructura y soporte IT",
    photo: "/equipo/maria-casari.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/maria-silvia-casari-997b4816/",
  },
]

export function getEquipo(_locale: string): TeamMember[] {
  return equipoEs
}
