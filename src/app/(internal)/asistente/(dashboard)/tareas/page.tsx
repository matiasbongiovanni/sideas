import { getTareas } from "@/lib/asistente/queries"
import { marcarTareaHecha, cancelarTarea, reabrirTarea } from "@/lib/asistente/actions"

export const dynamic = "force-dynamic"

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  hecha: "Hecha",
  cancelada: "Cancelada",
}

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  en_progreso: "bg-blue-50 text-blue-700 border-blue-200",
  hecha: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelada: "bg-slate-100 text-slate-500 border-slate-200",
}

const PRIORIDAD_LABEL: Record<string, string> = {
  baja: "Baja",
  normal: "Normal",
  alta: "Alta",
  urgente: "Urgente",
}

export default async function TareasPage() {
  const tareas = await getTareas()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Tareas</h2>
        <p className="text-sm text-slate-500">Anotadas por el agente n8n de asistente personal.</p>
      </div>

      {tareas.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Todavía no hay tareas registradas.
        </div>
      ) : (
        <div className="space-y-3">
          {tareas.map((tarea) => (
            <div key={tarea.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{tarea.titulo}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ESTADO_COLOR[tarea.estado]}`}>
                      {ESTADO_LABEL[tarea.estado]}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {PRIORIDAD_LABEL[tarea.prioridad]}
                    </span>
                  </div>
                  {tarea.descripcion && <p className="mt-2 text-sm text-slate-600">{tarea.descripcion}</p>}
                  {tarea.fecha_limite && (
                    <p className="mt-2 text-xs font-medium text-slate-400">
                      Vence: {new Date(tarea.fecha_limite).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {tarea.estado !== "hecha" && (
                    <form action={marcarTareaHecha.bind(null, tarea.id)}>
                      <button
                        type="submit"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        Marcar hecha
                      </button>
                    </form>
                  )}
                  {tarea.estado !== "cancelada" && tarea.estado !== "hecha" && (
                    <form action={cancelarTarea.bind(null, tarea.id)}>
                      <button
                        type="submit"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
                  {(tarea.estado === "hecha" || tarea.estado === "cancelada") && (
                    <form action={reabrirTarea.bind(null, tarea.id)}>
                      <button
                        type="submit"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        Reabrir
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
