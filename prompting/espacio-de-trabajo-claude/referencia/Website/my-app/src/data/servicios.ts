export interface Servicio {
  id: string
  name: string
  description: string
  benefits: string[]
  icon: string
}

export const servicios: Servicio[] = [
  {
    id: "so-pc-servidores",
    name: "SO en PC y Servidores",
    description:
      "Instalación, configuración y mantenimiento de sistemas operativos en equipos de escritorio y servidores físicos.",
    benefits: ["Rendimiento optimizado", "Actualizaciones gestionadas", "Soporte remoto incluido"],
    icon: "server",
  },
  {
    id: "so-nube",
    name: "SO en la Nube",
    description:
      "Gestión de sistemas operativos en entornos cloud (AWS, Azure, GCP), incluyendo aprovisionamiento y mantenimiento.",
    benefits: ["Alta disponibilidad", "Escalado automático", "Reducción de costos"],
    icon: "cloud",
  },
  {
    id: "datacenter",
    name: "DataCenter",
    description:
      "Diseño, instalación y operación de centros de datos con infraestructura robusta, redundante y monitorizada.",
    benefits: ["Redundancia N+1", "Monitoreo 24/7", "Compliance y seguridad física"],
    icon: "database",
  },
  {
    id: "telefonia-voip",
    name: "Telefonía IP / VoIP",
    description:
      "Implementación de centrales telefónicas IP y soluciones VoIP para comunicaciones empresariales unificadas.",
    benefits: ["Reducción de costos telefónicos", "Integración con CRM", "Movilidad total"],
    icon: "phone",
  },
  {
    id: "mikrotik-cisco",
    name: "MikroTik / Cisco",
    description:
      "Configuración y administración de redes con equipos MikroTik y Cisco: routing, switching, QoS y firewall.",
    benefits: ["Redes seguras y estables", "Segmentación VLAN", "Gestión centralizada"],
    icon: "network",
  },
  {
    id: "migracion-windows",
    name: "Migración Windows",
    description:
      "Migración de sistemas Windows legacy a versiones actuales, con mínimo impacto operativo y preservación de datos.",
    benefits: ["Cero pérdida de datos", "Plan de rollback", "Capacitación incluida"],
    icon: "refresh",
  },
  {
    id: "vpn-sucursales",
    name: "VPN entre Sucursales",
    description:
      "Implementación de redes privadas virtuales para conectar sucursales de forma segura y transparente.",
    benefits: ["Comunicación cifrada", "Acceso remoto seguro", "Alta disponibilidad"],
    icon: "shield",
  },
  {
    id: "antivirus-centralizado",
    name: "Antivirus Centralizado",
    description:
      "Despliegue y gestión centralizada de soluciones antivirus corporativas para toda la flota de equipos.",
    benefits: ["Gestión desde consola única", "Actualizaciones automáticas", "Reportes de incidentes"],
    icon: "lock",
  },
  {
    id: "zabbix",
    name: "Monitoreo con Zabbix",
    description:
      "Implementación de plataformas de monitoreo con Zabbix para supervisión de infraestructura, alertas y métricas.",
    benefits: ["Alertas en tiempo real", "Dashboards personalizados", "Histórico de métricas"],
    icon: "activity",
  },
  {
    id: "identidad-digital",
    name: "Identidad Digital",
    description:
      "Gestión de identidad corporativa: dominios, certificados SSL, políticas de acceso y autenticación multifactor.",
    benefits: ["SSO unificado", "MFA obligatorio", "Gestión de ciclo de vida"],
    icon: "fingerprint",
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    description:
      "Implementación, migración y administración de Google Workspace para equipos de trabajo colaborativos.",
    benefits: ["Correo corporativo", "Drive y colaboración", "Videoconferencias integradas"],
    icon: "mail",
  },
  {
    id: "soporte-it",
    name: "Soporte IT 24/7",
    description:
      "Mesa de ayuda técnica disponible las 24 horas, los 7 días de la semana, para resolución de incidentes.",
    benefits: ["Respuesta en minutos", "Soporte remoto y presencial", "SLA garantizado"],
    icon: "headphones",
  },
]
