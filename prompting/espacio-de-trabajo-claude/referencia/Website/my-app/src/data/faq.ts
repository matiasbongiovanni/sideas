export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const faq: FAQItem[] = [
  {
    id: "por-que-sideas",
    question: "¿Por qué elegir SIDEAS como proveedor IT?",
    answer:
      "Somos una empresa cordobesa con foco en resultados reales. Desde 2020 brindamos soporte 24/7, con un equipo de profesionales certificados que conocen la realidad de las PYMES y organismos públicos de la región. No tercerizamos — todo el soporte lo hacemos nosotros directamente.",
  },
  {
    id: "backups-resguardo",
    question: "¿Cómo manejan los backups y el resguardo de información?",
    answer:
      "Implementamos políticas de backup 3-2-1: tres copias, en dos medios distintos, con una copia offsite. Usamos herramientas como Veeam, Acronis o soluciones nativas según el entorno. Cada backup se verifica automáticamente y podés consultar el estado en tiempo real.",
  },
  {
    id: "mantenimiento-servidores",
    question: "¿Qué incluye el mantenimiento de servidores?",
    answer:
      "El mantenimiento incluye: actualizaciones de SO y firmware, revisión de logs de eventos, control de temperatura y hardware, limpieza de espacio en disco, verificación de servicios críticos y reporte mensual de estado. Todo documentado y trazable.",
  },
  {
    id: "modernizacion-infraestructura",
    question: "¿Pueden ayudarnos a modernizar nuestra infraestructura antigua?",
    answer:
      "Sí. Tenemos experiencia en migraciones de sistemas Windows legacy, virtualización con Hyper-V y VMware, y transición a la nube (AWS, Azure). Trabajamos con un plan de migración que minimiza el tiempo de inactividad y garantiza rollback si algo sale mal.",
  },
  {
    id: "soporte-247",
    question: "¿Cómo funciona el soporte 24/7?",
    answer:
      "Tenemos un sistema de guardia con técnicos disponibles las 24hs. Podés abrir un ticket vía email, WhatsApp o nuestro portal. Para incidentes críticos (servidor caído, brecha de seguridad), el tiempo de primera respuesta es de menos de 15 minutos.",
  },
  {
    id: "ciberseguridad-firewall",
    question: "¿Qué soluciones de ciberseguridad ofrecen?",
    answer:
      "Implementamos firewalls perimetrales (MikroTik, pfSense, Cisco), antivirus centralizado con consola de gestión, VPN entre sucursales, políticas de contraseñas y autenticación multifactor (MFA). También realizamos análisis de vulnerabilidades y capacitación al personal.",
  },
  {
    id: "datacenters",
    question: "¿Diseñan e instalan DataCenters desde cero?",
    answer:
      "Sí. Hacemos el relevamiento, diseño eléctrico y de cooling, selección de equipamiento (racks, UPS, PDU, servidores), instalación física y puesta en marcha. Incluimos documentación completa y capacitación del equipo interno para la operación diaria.",
  },
  {
    id: "monitoreo-alertas",
    question: "¿Qué plataforma usan para monitoreo y alertas?",
    answer:
      "Implementamos Zabbix como plataforma principal de monitoreo. Permite supervisar servidores, redes, aplicaciones y servicios en tiempo real. Configuramos alertas por email, SMS o Telegram para que el equipo sea notificado antes de que un problema afecte a los usuarios.",
  },
  {
    id: "migraciones-upgrades",
    question: "¿Cómo gestionan las migraciones y upgrades sin interrumpir operaciones?",
    answer:
      "Planificamos cada migración con una ventana de mantenimiento acordada. Usamos snapshots y backups previos a cualquier cambio. Si el entorno lo permite, hacemos migraciones en paralelo (blue/green). Siempre tenemos un plan de rollback documentado y probado antes de ejecutar.",
  },
]
