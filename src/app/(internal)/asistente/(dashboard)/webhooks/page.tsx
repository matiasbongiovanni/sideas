import { EVENTOS_WEBHOOK, getEntrantes, getEntregas, getWebhooks } from "@/lib/asistente/webhooks"
import { alternarWebhook, crearWebhook, eliminarWebhook, probarWebhooks } from "@/lib/asistente/actions"

export const dynamic = "force-dynamic"

function fecha(valor: string) {
  return new Date(valor).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
}

export default async function WebhooksPage() {
  const [webhooks, entregas, entrantes] = await Promise.all([getWebhooks(), getEntregas(25), getEntrantes(25)])

  const nombrePorId = new Map(webhooks.map((w) => [w.id, w.nombre]))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Webhooks</h2>
        <p className="text-sm text-slate-500">
          Salientes: cada evento del módulo se envía firmado (HMAC-SHA256, header{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">x-sideas-signature</code>) a los destinos activos.
          Entrantes: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">POST /api/asistente/webhooks/&#123;origen&#125;</code>.
        </p>
      </div>

      {/* Alta de webhook saliente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Nuevo destino saliente</h3>

        <form action={crearWebhook} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre</span>
              <input
                name="nombre"
                required
                placeholder="n8n — asistente personal"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#4398FF]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">URL</span>
              <input
                name="url"
                required
                type="url"
                placeholder="https://n8n.../webhook/asistente-eventos"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#4398FF]"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Secreto (opcional — si se deja vacío se genera uno)
            </span>
            <input
              name="secreto"
              placeholder="se genera automáticamente"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#4398FF]"
            />
          </label>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Eventos (sin marcar nada = todos)
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {EVENTOS_WEBHOOK.map((evento) => (
                <label
                  key={evento}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <input type="checkbox" name="eventos" value={evento} className="h-3.5 w-3.5" />
                  {evento}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
          >
            Agregar webhook
          </button>
        </form>
      </div>

      {/* Destinos registrados */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Destinos</h3>
          {webhooks.length > 0 && (
            <form action={probarWebhooks}>
              <button
                type="submit"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
              >
                Disparar evento de prueba
              </button>
            </form>
          )}
        </div>

        {webhooks.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay webhooks salientes registrados.</p>
        ) : (
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{webhook.nombre}</h4>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          webhook.activo
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {webhook.activo ? "Activo" : "Pausado"}
                      </span>
                    </div>
                    <p className="mt-1 break-all text-xs text-slate-500">{webhook.url}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      Eventos: {webhook.eventos.includes("*") ? "todos" : webhook.eventos.join(", ")}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <form action={alternarWebhook.bind(null, webhook.id, !webhook.activo)}>
                      <button
                        type="submit"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        {webhook.activo ? "Pausar" : "Activar"}
                      </button>
                    </form>
                    <form action={eliminarWebhook.bind(null, webhook.id)}>
                      <button
                        type="submit"
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log de entregas salientes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Últimas entregas salientes</h3>

        {entregas.length === 0 ? (
          <p className="text-sm text-slate-500">Sin entregas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-4">Fecha</th>
                  <th className="pb-2 pr-4">Destino</th>
                  <th className="pb-2 pr-4">Evento</th>
                  <th className="pb-2 pr-4">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entregas.map((entrega) => (
                  <tr key={entrega.id}>
                    <td className="py-2 pr-4 text-xs text-slate-500">{fecha(entrega.creado_en)}</td>
                    <td className="py-2 pr-4 text-xs text-slate-700">
                      {nombrePorId.get(entrega.webhook_id ?? "") ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-700">{entrega.evento}</td>
                    <td className="py-2 pr-4 text-xs">
                      {entrega.ok ? (
                        <span className="font-semibold text-emerald-600">OK {entrega.status_code}</span>
                      ) : (
                        <span className="font-semibold text-rose-600">{entrega.error ?? "Error"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log de entrantes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Últimos webhooks entrantes</h3>

        {entrantes.length === 0 ? (
          <p className="text-sm text-slate-500">
            Sin webhooks entrantes. Endpoint:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">POST /api/asistente/webhooks/&#123;origen&#125;</code>
          </p>
        ) : (
          <div className="space-y-2">
            {entrantes.map((entrante) => (
              <details key={entrante.id} className="rounded-xl border border-slate-100 px-4 py-3">
                <summary className="cursor-pointer text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{entrante.origen}</span>
                  {entrante.evento ? ` · ${entrante.evento}` : ""} · {fecha(entrante.creado_en)} ·{" "}
                  {entrante.firma_valida ? "firma válida" : "sin firma (api key)"}
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700">
                  {JSON.stringify(entrante.payload, null, 2)}
                </pre>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
