import { getCorreos } from "@/lib/asistente/queries"

export const dynamic = "force-dynamic"

const ESTADO_COLOR: Record<string, string> = {
  enviado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  fallido: "bg-red-50 text-red-700 border-red-200",
  programado: "bg-blue-50 text-blue-700 border-blue-200",
}

const ESTADO_LABEL: Record<string, string> = {
  enviado: "Enviado",
  fallido: "Fallido",
  programado: "Programado",
}

export default async function CorreoPage() {
  const correos = await getCorreos()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Correo</h2>
        <p className="text-sm text-slate-500">Correos enviados por el agente n8n de asistente personal.</p>
      </div>

      {correos.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Todavía no se registraron correos.
        </div>
      ) : (
        <div className="space-y-3">
          {correos.map((correo) => (
            <div key={correo.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{correo.asunto}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ESTADO_COLOR[correo.estado_envio]}`}>
                      {ESTADO_LABEL[correo.estado_envio]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-500">Para: {correo.destinatario_email}</p>
                  {correo.cuerpo && <p className="mt-2 text-sm text-slate-600">{correo.cuerpo}</p>}
                </div>
                <p className="shrink-0 text-xs font-medium text-slate-400">
                  {new Date(correo.enviado_en).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
