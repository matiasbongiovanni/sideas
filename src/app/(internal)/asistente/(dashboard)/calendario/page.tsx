import { getEventos } from "@/lib/asistente/queries"
import type { Evento } from "@/lib/asistente/queries"

export const dynamic = "force-dynamic"

function agruparPorDia(eventos: Evento[]) {
  const grupos = new Map<string, Evento[]>()

  for (const evento of eventos) {
    const fecha = new Date(evento.inicio)
    const clave = fecha.toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    const lista = grupos.get(clave) ?? []
    lista.push(evento)
    grupos.set(clave, lista)
  }

  return grupos
}

export default async function CalendarioPage() {
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 2, 0)

  const eventos = await getEventos(inicioMes.toISOString(), finMes.toISOString())
  const grupos = agruparPorDia(eventos)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Calendario</h2>
        <p className="text-sm text-slate-500">
          Eventos sincronizados por el agente n8n de asistente personal — mes actual y próximo.
        </p>
      </div>

      {grupos.size === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No hay eventos programados en este rango.
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grupos.entries()).map(([dia, eventosDelDia]) => (
            <div key={dia}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{dia}</h3>
              <div className="space-y-2">
                {eventosDelDia.map((evento) => (
                  <div key={evento.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{evento.titulo}</p>
                        {evento.descripcion && <p className="mt-1 text-sm text-slate-600">{evento.descripcion}</p>}
                        {evento.ubicacion && <p className="mt-1 text-xs text-slate-400">{evento.ubicacion}</p>}
                      </div>
                      <p className="shrink-0 text-xs font-medium text-slate-500">
                        {new Date(evento.inicio).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        {" – "}
                        {new Date(evento.fin).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
