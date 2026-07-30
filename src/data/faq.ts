export interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqEs: FAQItem[] = [
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

const faqEn: FAQItem[] = [
  {
    id: "por-que-sideas",
    question: "Why choose SIDEAS as your IT provider?",
    answer:
      "We're a Córdoba-based company focused on real results. Since 2020 we've provided 24/7 support with a team of certified professionals who understand the reality of SMBs and public agencies in the region. We don't outsource — we handle all support directly ourselves.",
  },
  {
    id: "backups-resguardo",
    question: "How do you handle backups and data protection?",
    answer:
      "We implement a 3-2-1 backup policy: three copies, on two different media, with one copy offsite. We use tools like Veeam, Acronis or native solutions depending on the environment. Every backup is verified automatically and you can check its status in real time.",
  },
  {
    id: "mantenimiento-servidores",
    question: "What does server maintenance include?",
    answer:
      "Maintenance includes: OS and firmware updates, event log review, temperature and hardware checks, disk space cleanup, verification of critical services and a monthly status report. Everything is documented and traceable.",
  },
  {
    id: "modernizacion-infraestructura",
    question: "Can you help us modernize our old infrastructure?",
    answer:
      "Yes. We have experience migrating legacy Windows systems, virtualizing with Hyper-V and VMware, and moving to the cloud (AWS, Azure). We work with a migration plan that minimizes downtime and guarantees a rollback path if anything goes wrong.",
  },
  {
    id: "soporte-247",
    question: "How does 24/7 support work?",
    answer:
      "We have an on-call system with technicians available around the clock. You can open a ticket via email, WhatsApp or our portal. For critical incidents (server down, security breach), first response time is under 15 minutes.",
  },
  {
    id: "ciberseguridad-firewall",
    question: "What cybersecurity solutions do you offer?",
    answer:
      "We implement perimeter firewalls (MikroTik, pfSense, Cisco), centralized antivirus with a management console, branch-to-branch VPN, password policies and multi-factor authentication (MFA). We also run vulnerability assessments and staff training.",
  },
  {
    id: "datacenters",
    question: "Do you design and build Data Centers from scratch?",
    answer:
      "Yes. We handle the site survey, electrical and cooling design, equipment selection (racks, UPS, PDU, servers), physical installation and commissioning. We include full documentation and training for your internal team's day-to-day operation.",
  },
  {
    id: "monitoreo-alertas",
    question: "What platform do you use for monitoring and alerts?",
    answer:
      "We use Zabbix as our main monitoring platform. It lets us oversee servers, networks, applications and services in real time. We configure alerts via email, SMS or Telegram so your team is notified before an issue affects users.",
  },
  {
    id: "migraciones-upgrades",
    question: "How do you manage migrations and upgrades without disrupting operations?",
    answer:
      "We plan every migration around an agreed maintenance window. We take snapshots and backups before any change. When the environment allows it, we run parallel (blue/green) migrations. We always have a documented, tested rollback plan before executing.",
  },
]

export function getFaq(locale: string): FAQItem[] {
  return locale === "en" ? faqEs : faqEn
}
