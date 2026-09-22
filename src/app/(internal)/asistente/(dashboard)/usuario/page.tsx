import { getUsuario } from "@/lib/asistente/queries"
import { actualizarPerfilUsuario } from "@/lib/asistente/actions"

export const dynamic = "force-dynamic"

export default async function UsuarioPage() {
  const usuario = await getUsuario()
  const preferencias = Object.entries(usuario.preferencias ?? {})

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Usuario</h2>
        <p className="text-sm text-slate-500">
          Contexto y preferencias que el agente n8n lee/actualiza para personalizar sus decisiones.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{usuario.nombre}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Zona horaria</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{usuario.zona_horaria}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Última actualización</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {new Date(usuario.actualizado_en).toLocaleString("es-AR")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Preferencias</h3>

        {preferencias.length === 0 ? (
          <p className="text-sm text-slate-500">
            El agente n8n todavía no cargó preferencias vía <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">PATCH /api/asistente/usuario</code>.
          </p>
        ) : (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {preferencias.map(([clave, valor]) => (
              <div key={clave} className="rounded-xl border border-slate-100 px-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{clave}</dt>
                <dd className="mt-1 text-sm text-slate-800">{String(valor)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Editar a mano</h3>

        <form action={actualizarPerfilUsuario} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre</span>
              <input
                name="nombre"
                required
                defaultValue={usuario.nombre}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#4398FF]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Zona horaria</span>
              <input
                name="zona_horaria"
                required
                defaultValue={usuario.zona_horaria}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#4398FF]"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferencias (JSON)</span>
            <textarea
              name="preferencias"
              rows={6}
              defaultValue={JSON.stringify(usuario.preferencias ?? {}, null, 2)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-[#4398FF]"
            />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
          >
            Guardar perfil
          </button>
        </form>
      </div>
    </div>
  )
}
