import type { Project } from "@/features/projects/types"

export const proyectos: Project[] = [
  {
    slug: "soporte-integral-ingenia",
    title: "Soporte IT y Obras Eléctricas – INGENIA S.A.",
    description:
      "Soporte técnico integral, administración de servidores y redes para INGENIA S.A., empresa de obras eléctricas y mantenimiento, con cobertura 24/7 y gestión en múltiples sucursales.",
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
    title: "DataCenter para Cooperativa JJMM",
    description:
      "Diseño, instalación y puesta en marcha de infraestructura de DataCenter para la Cooperativa de Servicios Públicos de Colonia Caroya y Jesús María, con soporte 24/7, monitoreo Zabbix y administración completa de servidores.",
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
    title: "Soporte IT Integral – Usina Creativa",
    description:
      "Administración completa de infraestructura IT para Usina Creativa, agencia de comunicación organizacional y corporativa, con soporte técnico 24/7, servidores virtualizados y monitoreo continuo.",
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
]
