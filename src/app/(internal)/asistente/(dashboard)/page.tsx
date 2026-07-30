import Link from "next/link"
import { CheckSquare, Mail, Users, Calendar } from "lucide-react"
import { getResumen } from "@/lib/asistente/queries"

export const dynamic = "force-dynamic"

export default async function AsistenteResumenPage() {
  const resumen = await getResumen()

  const kpis = [
    { label: "Tareas pendientes", value: resumen.tareasPendientes, icon: CheckSquare, href: "/asistente/tareas" },
    { label: "Correos enviados hoy", value: resumen.correosHoy, icon: Mail, href: "/asistente/correo" },
    { label: "Correos esta semana", value: resumen.correosSemana, icon: Mail, href: "/asistente/correo" },
    { label: "Contactos totales", value: resumen.contactosTotales, icon: Users, href: "/asistente/contactos" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#4398FF]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{kpi.label}</p>
                <Icon className="h-4 w-4 text-[#4398FF]" aria-hidden="true" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{kpi.value}</p>
            </Link>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            <Calendar className="h-4 w-4 text-[#4398FF]" aria-hidden="true" />
            Próximos eventos (7 días)
          </h2>
          <Link href="/asistente/calendario" className="text-xs font-medium text-[#4398FF] hover:underline">
            Ver calendario
          </Link>
        </div>

        {resumen.proximosEventos.length === 0 ? (
          <p className="text-sm text-slate-500">No hay eventos programados en los próximos 7 días.</p>
        ) : (
          <ul className="space-y-3">
            {resumen.proximosEventos.map((evento) => (
              <li key={evento.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{evento.titulo}</p>
                  {evento.ubicacion && <p className="text-xs text-slate-500">{evento.ubicacion}</p>}
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {new Date(evento.inicio).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
