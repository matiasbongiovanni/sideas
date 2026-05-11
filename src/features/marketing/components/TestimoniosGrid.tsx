"use client"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  dark?: boolean
}

const testimonios: Testimonial[] = [
  {
    id: "1",
    name: "Carlos Méndez",
    role: "Gerente de IT",
    company: "INGENIA S.A.",
    text: "SIDEAS transformó nuestra infraestructura en tiempo récord. Pasamos de tener caídas semanales a cero incidentes en los últimos 8 meses. El soporte 24/7 es real — a las 3am alguien respondió en menos de 10 minutos.",
    dark: true,
  },
  {
    id: "2",
    name: "Laura Fernández",
    role: "Directora Administrativa",
    company: "Cooperativa Jesús María",
    text: "La migración a Google Workspace que hicieron fue impecable. Sin pérdida de correos, sin interrupciones. El equipo explicó cada paso y el personal se adaptó rápidamente.",
    dark: false,
  },
  {
    id: "3",
    name: "Martín Cugat",
    role: "CEO",
    company: "Cugat SRL",
    text: "Tienen un nivel de compromiso que no había visto en otros proveedores IT. Cuando tuvimos un problema crítico un domingo, estaban operativos en menos de media hora. Eso no tiene precio.",
    dark: true,
  },
  {
    id: "4",
    name: "Ana Correa",
    role: "Coordinadora de Sistemas",
    company: "CEDICOR",
    text: "El monitoreo con Zabbix que implementaron nos dio visibilidad total de nuestra red por primera vez. Ahora detectamos problemas antes de que impacten a los usuarios.",
    dark: false,
  },
  {
    id: "5",
    name: "Ricardo Olmos",
    role: "Propietario",
    company: "Olmos Music",
    text: "Como empresa del rubro musical no somos expertos en tecnología, y SIDEAS lo entiende. Nos explican todo en términos simples y siempre están disponibles para lo que necesitamos.",
    dark: true,
  },
  {
    id: "6",
    name: "Sofía Vargas",
    role: "Jefa de Operaciones",
    company: "Usina Creativa",
    text: "La VPN entre nuestras sucursales funcionó perfectamente desde el día uno. Logramos conectar tres oficinas en distintas provincias con una solución estable y segura.",
    dark: false,
  },
]

export default function TestimoniosGrid() {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Elemento decorativo de fondo sutil */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-[#4398FF]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0B3C78]/20 bg-[#0B3C78]/5 px-4 py-1.5 mb-6 transition-colors hover:bg-[#0B3C78]/10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0B3C78]">Testimonios</span>
          </div>
          <h2 className="text-3xl font-light sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Lo que dicen <span className="font-bold">nuestros clientes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonios.map((t) => (
            <div
              key={t.id}
              className={`group relative flex flex-col gap-6 rounded-3xl p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${t.dark
                ? "bg-slate-900 border border-slate-800 hover:border-[#4398FF]/50 shadow-lg shadow-slate-900/10"
                : "bg-white border border-slate-200 hover:border-[#4398FF]/30 shadow-sm hover:shadow-[#4398FF]/5"
                }`}
            >
              {/* Ícono de Comillas Decorativo de Fondo */}
              <svg
                className={`absolute top-6 right-6 w-16 h-16 transition-opacity duration-300 group-hover:opacity-20 ${t.dark ? "text-slate-700 opacity-10" : "text-slate-200 opacity-50"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Estrellas */}
              <div className="relative flex gap-1 z-10">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Texto del Testimonio */}
              <p className={`relative z-10 text-base leading-relaxed flex-1 ${t.dark ? "text-slate-300" : "text-slate-600"}`}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Info del Cliente */}
              <div className="relative z-10 mt-2 pt-6 border-t border-dashed" style={{ borderColor: t.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}>
                <p className={`text-base font-bold tracking-wide ${t.dark ? "text-white" : "text-slate-900"}`}>
                  {t.name}
                </p>
                <p className={`text-sm mt-0.5 ${t.dark ? "text-slate-400" : "text-slate-500"}`}>
                  {t.role} <span className="text-[#4398FF] mx-1 font-bold">·</span> {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}