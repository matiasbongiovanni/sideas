import type { Project } from "@/features/projects/types"

const proyectosEs: Project[] = [
  {
    slug: "soporte-integral-ingenia",
    title: "INGENIA S.A.",
    description:
      "Soporte técnico integral, administración de servidores y redes, con cobertura 24/7 y gestión en múltiples sucursales.",
    tags: ["Soporte IT", "Infraestructura", "Mantenimiento"],
    image: "/ingeniafoto.jpg",
    detail:
      "Servicio ilimitado de infraestructura tecnológica abarcando más de 100 posiciones y múltiples sucursales a nivel país (Casa Central en Córdoba, Neuquén, Buenos Aires, etc.). Incluye soporte técnico, Help Desk, administración de servidores (físicos y virtuales), redes MikroTik, firewall, Telefonía VoIP, monitoreo con Zabbix y desarrollos de intranet con IA.",
    category: "Soporte IT",
    location: "Córdoba (Casa Central) y sucursales nacionales",
    year: "2024",
    challenge:
      "Brindar cobertura ininterrumpida (24x7) a una infraestructura distribuida con enlaces remotos (Lan to Lan), gestionando más de 100 equipos, servidores Windows Server 2019 y coordinando soporte para aplicaciones específicas (TANGO y sistemas internos).",
    strategy:
      "Se implementó un modelo onsite, remoto y mixto. Centralizamos la administración mediante Active Directory, desplegamos VPNs con MikroTik para conexiones seguras entre sucursales y aplicamos políticas de backup manuales, automáticas y de máquinas virtuales. Además, implementamos monitoreo proactivo en Zabbix para formalizar el inventario y prevenir incidentes.",
    results: [
      "Conectividad Lan to Lan estable en sucursales a nivel nacional",
      "Soporte 24/7 ininterrumpido en todas las posiciones",
      "Backups automatizados en servidores virtuales y físicos",
      "Gestión centralizada de infraestructura distribuida",
    ],
    websiteUrl: "https://ingeniasa.com.ar/",
    images: ["/ingeniafoto.jpg"],
  },
  {
    slug: "infraestructura-datacenter",
    title: "Cooperativa de Servicios Públicos de Colonia Caroya y Jesús María LTDA",
    description:
      "Diseño, instalación y puesta en marcha de infraestructura de DataCenter, con soporte 24/7, monitoreo Zabbix y administración completa de servidores.",
    tags: ["Infraestructura", "DataCenter", "Zabbix"],
    image: "/JJMM.png",
    detail:
      "Implementación integral de infraestructura IT para la Cooperativa de Servicios Públicos de Colonia Caroya y Jesús María. El proyecto abarca soporte técnico, Help Desk, administración de servidores físicos y virtuales, redes MikroTik, firewall, backup y recuperación, telefonía VoIP, monitoreo Zabbix y migraciones cloud. Cobertura onsite, remota y mixta las 24 horas.",
    category: "Infraestructura",
    location: "Jesús María, Córdoba",
    year: "2024",
    challenge:
      "Gestionar de forma integral la infraestructura IT de una cooperativa de servicios públicos con más de 100 posiciones (50 PC + 50 notebooks), 4 servidores físicos, 8 virtuales con Windows Server 2019, múltiples VLANs y cobertura 24/7 con soporte onsite y remoto.",
    strategy:
      "Desplegamos un modelo de soporte integral que incluye Help Desk, administración de servidores físicos (4x ML110) y virtuales (8 VMs), gestión de redes MikroTik con VPN OpenVPN, backups manuales y automáticos con rotación de discos USB, respaldo de máquinas virtuales vía WinSCP y VMware, monitoreo proactivo con Zabbix y escritorio remoto en todos los equipos. La gestión de credenciales se centraliza mediante Active Directory.",
    results: [
      "Uptime del 99.9% con cobertura 24/7",
      "Monitoreo proactivo con Zabbix en tiempo real",
      "Backup diario y semanal con rotación de discos",
      "100+ posiciones administradas (PC + notebooks)",
    ],
    images: ["/JJMM.png"],
  },
  {
    slug: "soporte-integral-usina-creativa",
    title: "USINA CREATIVA",
    description:
      "Administración completa de infraestructura IT, con soporte técnico 24/7, servidores virtualizados y monitoreo continuo.",
    tags: ["Soporte IT", "Servidores", "Redes"],
    image: "/Usina.png",
    detail:
      "Gestión integral de la infraestructura tecnológica de Usina Creativa, incluyendo soporte técnico, Help Desk, administración de servidores físicos y virtuales, redes MikroTik con firewall, backup con rotación de discos, monitoreo Zabbix y acceso remoto mediante VPN. Cobertura 24/7 en modalidad remota y mixta.",
    category: "Soporte IT",
    location: "Córdoba, Capital",
    year: "2024",
    challenge:
      "Brindar soporte IT integral y continuo a una agencia de comunicación con servidores virtualizados, múltiples estaciones de trabajo y necesidad de disponibilidad 24/7 para sus operaciones.",
    strategy:
      "Implementamos un modelo de soporte remoto y mixto con Help Desk, administración de servidores virtuales, gestión de redes MikroTik con firewall y VPN (OpenVPN), backup diario y semanal con rotación de discos USB, respaldo de máquinas virtuales vía WinSCP y VMware, monitoreo con Zabbix y escritorio remoto en todos los equipos. La gestión de accesos se centraliza mediante Active Directory.",
    results: [
      "Disponibilidad 24/7 garantizada",
      "Backup automatizado con rotación de discos",
      "Monitoreo continuo con Zabbix",
      "Reducción de incidentes críticos",
    ],
    websiteUrl: "https://usinacreativa.com.ar/",
    images: ["/Usina.png"],
  },
  {
    slug: "identidad-digital-corporativa",
    title: "Identidad Digital Corporativa",
    description:
      "Implementación completa de identidad digital para empresa regional: Google Workspace, gestión de dominios, políticas de seguridad y migración desde sistemas legacy.",
    tags: ["Identidad Digital", "Automatización"],
    image: "/identidad-digital.png",
    detail:
      "El proyecto incluyó la migración de correo corporativo a Google Workspace, configuración de SSO, políticas de contraseñas, autenticación en dos pasos y capacitación del equipo. Se unificó la identidad digital de 45 usuarios en menos de 2 semanas.",
    category: "Identidad Digital",
    location: "Córdoba, Argentina",
    year: "2023",
    challenge:
      "Migración completa de identidad digital corporativa a Google Workspace, incluyendo gestión de dominios, políticas de seguridad y capacitación del equipo.",
    strategy:
      "Ejecutamos la migración de correo corporativo a Google Workspace con configuración de SSO, políticas de contraseñas, autenticación en dos pasos y capacitación del equipo en las nuevas herramientas.",
    results: [
      "45 usuarios migrados en menos de 2 semanas",
      "Autenticación en dos pasos implementada en toda la organización",
      "Reducción de incidentes de seguridad de acceso",
    ],
    images: ["/identidad-digital.png"],
  },
  {
    slug: "soporte-integral-cugat",
    title: "CUGAT SRL",
    description:
      "Gestión integral de infraestructura tecnológica para empresa de autopartes eléctricas: servidores, redes, seguridad, soporte presencial y remoto con monitoreo proactivo.",
    tags: ["Soporte IT", "Infraestructura", "Redes"],
    image: "/cugat.webp",
    detail:
      "Desde nuestra consultora IT acompañamos a CUGAT en la gestión integral de su infraestructura tecnológica, brindando soporte estratégico y operativo para garantizar la continuidad de los servicios. Administramos y mantenemos puestos de trabajo, servidores físicos y virtuales, redes de comunicaciones, sistemas de respaldo, seguridad informática y servicios críticos para la operación diaria. Además, proporcionamos monitoreo proactivo, soporte técnico presencial y remoto, gestión de incidencias, asesoramiento en proyectos de mejora tecnológica y planificación de crecimiento, contribuyendo a que ambas organizaciones cuenten con una plataforma tecnológica segura, estable y alineada con sus objetivos institucionales.",
    category: "Soporte IT",
    location: "Córdoba, Argentina",
    year: "2024",
    challenge:
      "Garantizar la continuidad operativa de una empresa de autopartes eléctricas con infraestructura heterogénea: puestos de trabajo, servidores físicos y virtuales, redes de comunicaciones y servicios críticos.",
    strategy:
      "Implementamos un modelo de soporte integral con cobertura presencial y remota: administración de servidores, gestión de redes, sistemas de respaldo automatizados, seguridad informática y monitoreo proactivo. Se estableció un proceso de gestión de incidencias y asesoramiento continuo para proyectos de mejora y planificación de crecimiento.",
    results: [
      "Plataforma tecnológica segura y estable en operación continua",
      "Monitoreo proactivo con respuesta antes de impacto al usuario",
      "Soporte técnico presencial y remoto con gestión de incidencias",
      "Asesoramiento en planificación y crecimiento tecnológico",
    ],
    images: ["/cugat.webp"],
  },
]

const proyectosEn: Project[] = [
  {
    slug: "soporte-integral-ingenia",
    title: "INGENIA S.A.",
    description:
      "Comprehensive technical support, server and network administration, with 24/7 coverage and multi-branch management.",
    tags: ["IT Support", "Infrastructure", "Maintenance"],
    image: "/ingeniafoto.jpg",
    detail:
      "Unlimited technology infrastructure service covering more than 100 workstations and multiple branches nationwide (Head Office in Córdoba, Neuquén, Buenos Aires, etc.). Includes technical support, Help Desk, server administration (physical and virtual), MikroTik networking, firewall, VoIP telephony, Zabbix monitoring and AI-powered intranet development.",
    category: "IT Support",
    location: "Córdoba (Head Office) and nationwide branches",
    year: "2024",
    challenge:
      "Provide uninterrupted (24x7) coverage for infrastructure distributed across remote links (Lan-to-Lan), managing more than 100 devices, Windows Server 2019 servers, and coordinating support for specific applications (TANGO and internal systems).",
    strategy:
      "We implemented an onsite, remote and hybrid support model. We centralized administration through Active Directory, deployed MikroTik VPNs for secure connections between branches, and applied manual, automated and virtual-machine backup policies. We also implemented proactive Zabbix monitoring to formalize the inventory and prevent incidents.",
    results: [
      "Stable Lan-to-Lan connectivity across branches nationwide",
      "Uninterrupted 24/7 support across all locations",
      "Automated backups on virtual and physical servers",
      "Centralized management of distributed infrastructure",
    ],
    websiteUrl: "https://ingeniasa.com.ar/",
    images: ["/ingeniafoto.jpg"],
  },
  {
    slug: "infraestructura-datacenter",
    title: "Cooperativa de Servicios Públicos de Colonia Caroya y Jesús María LTDA",
    description:
      "Design, installation and commissioning of Data Center infrastructure, with 24/7 support, Zabbix monitoring and full server administration.",
    tags: ["Infrastructure", "Data Center", "Zabbix"],
    image: "/JJMM.png",
    detail:
      "Full IT infrastructure implementation for the Colonia Caroya and Jesús María Public Services Cooperative. The project covers technical support, Help Desk, physical and virtual server administration, MikroTik networking, firewall, backup and recovery, VoIP telephony, Zabbix monitoring and cloud migrations. 24-hour onsite, remote and hybrid coverage.",
    category: "Infrastructure",
    location: "Jesús María, Córdoba",
    year: "2024",
    challenge:
      "Fully manage the IT infrastructure of a public services cooperative with more than 100 workstations (50 PCs + 50 laptops), 4 physical servers, 8 virtual machines running Windows Server 2019, multiple VLANs and 24/7 onsite and remote support coverage.",
    strategy:
      "We deployed a comprehensive support model including Help Desk, physical (4x ML110) and virtual (8 VMs) server administration, MikroTik networking with OpenVPN, manual and automated backups with USB disk rotation, virtual machine backup via WinSCP and VMware, proactive Zabbix monitoring and remote desktop access on every device. Credential management is centralized through Active Directory.",
    results: [
      "99.9% uptime with 24/7 coverage",
      "Real-time proactive monitoring with Zabbix",
      "Daily and weekly backups with disk rotation",
      "100+ workstations managed (PCs + laptops)",
    ],
    images: ["/JJMM.png"],
  },
  {
    slug: "soporte-integral-usina-creativa",
    title: "USINA CREATIVA",
    description:
      "Full IT infrastructure administration, with 24/7 technical support, virtualized servers and continuous monitoring.",
    tags: ["IT Support", "Servers", "Networks"],
    image: "/Usina.png",
    detail:
      "Comprehensive management of Usina Creativa's technology infrastructure, including technical support, Help Desk, physical and virtual server administration, MikroTik networking with firewall, backup with disk rotation, Zabbix monitoring and remote access via VPN. 24/7 coverage in remote and hybrid mode.",
    category: "IT Support",
    location: "Córdoba, Capital City",
    year: "2024",
    challenge:
      "Provide continuous, end-to-end IT support to a communications agency with virtualized servers, multiple workstations, and a need for 24/7 availability for its operations.",
    strategy:
      "We implemented a remote and hybrid support model with Help Desk, virtual server administration, MikroTik networking with firewall and VPN (OpenVPN), daily and weekly backups with USB disk rotation, virtual machine backup via WinSCP and VMware, Zabbix monitoring and remote desktop access on every device. Access management is centralized through Active Directory.",
    results: [
      "Guaranteed 24/7 availability",
      "Automated backup with disk rotation",
      "Continuous monitoring with Zabbix",
      "Reduced critical incidents",
    ],
    websiteUrl: "https://usinacreativa.com.ar/",
    images: ["/Usina.png"],
  },
  {
    slug: "identidad-digital-corporativa",
    title: "Corporate Digital Identity",
    description:
      "Full digital identity rollout for a regional company: Google Workspace, domain management, security policies and migration from legacy systems.",
    tags: ["Digital Identity", "Automation"],
    image: "/identidad-digital.png",
    detail:
      "The project included migrating corporate email to Google Workspace, SSO configuration, password policies, two-factor authentication and team training. Digital identity was unified for 45 users in under 2 weeks.",
    category: "Digital Identity",
    location: "Córdoba, Argentina",
    year: "2023",
    challenge:
      "Full migration of corporate digital identity to Google Workspace, including domain management, security policies and team training.",
    strategy:
      "We carried out the corporate email migration to Google Workspace with SSO configuration, password policies, two-factor authentication and team training on the new tools.",
    results: [
      "45 users migrated in under 2 weeks",
      "Two-factor authentication rolled out organization-wide",
      "Fewer access-related security incidents",
    ],
    images: ["/identidad-digital.png"],
  },
  {
    slug: "soporte-integral-cugat",
    title: "CUGAT SRL",
    description:
      "End-to-end technology infrastructure management for an electrical auto-parts company: servers, networks, security, on-site and remote support with proactive monitoring.",
    tags: ["IT Support", "Infrastructure", "Networks"],
    image: "/cugat.webp",
    detail:
      "As their IT consultancy, we support CUGAT in the full management of its technology infrastructure, providing strategic and operational support to guarantee service continuity. We administer and maintain workstations, physical and virtual servers, communication networks, backup systems, information security and services critical to daily operations. We also provide proactive monitoring, on-site and remote technical support, incident management, guidance on technology improvement projects and growth planning — helping both organizations keep a technology platform that is secure, stable and aligned with their institutional goals.",
    category: "IT Support",
    location: "Córdoba, Argentina",
    year: "2024",
    challenge:
      "Guarantee operational continuity for an electrical auto-parts company with a heterogeneous infrastructure: workstations, physical and virtual servers, communication networks and critical services.",
    strategy:
      "We implemented a comprehensive support model with on-site and remote coverage: server administration, network management, automated backup systems, information security and proactive monitoring. We set up an incident management process and ongoing guidance for improvement projects and growth planning.",
    results: [
      "Secure, stable technology platform in continuous operation",
      "Proactive monitoring with response before user impact",
      "On-site and remote technical support with incident management",
      "Guidance on technology planning and growth",
    ],
    images: ["/cugat.webp"],
  },
]

export function getProyectos(locale: string): Project[] {
  return locale === "en" ? proyectosEn : proyectosEs
}
