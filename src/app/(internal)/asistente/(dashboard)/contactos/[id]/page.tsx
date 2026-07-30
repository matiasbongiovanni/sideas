import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getContacto, getCorreosPorContacto } from "@/lib/asistente/queries"
import { actualizarNotaContacto } from "@/lib/asistente/actions"

export const dynamic = "force-dynamic"

export default async function ContactoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contacto = await getContacto(id)
  if (!contacto) notFound()

  const correos = await getCorreosPorContacto(id)

  return (
    <div className="space-y-6">
      <Link href="/asistente/contactos" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a contactos
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{contacto.nombre}</h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
          {contacto.telefono && <span>Tel: {contacto.telefono}</span>}
          {contacto.email && <span>Email: {contacto.email}</span>}
          {contacto.ultima_interaccion && (
            <span>Última interacción: {new Date(contacto.ultima_interaccion).toLocaleString("es-AR")}</span>
          )}
        </div>

        <form action={actualizarNotaContacto.bind(null, contacto.id)} className="mt-5 space-y-2">
          <label htmlFor="nota" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Notas
          </label>
          <textarea
            id="nota"
            name="nota"
            defaultValue={contacto.notas ?? ""}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
          />
          <button
            type="submit"
            className="rounded-xl border border-[#4398FF]/30 bg-[#4398FF]/10 px-4 py-2 text-xs font-bold text-[#0B3C78] transition-colors hover:bg-[#4398FF]/20"
          >
            Guardar nota
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Correos enviados</h3>

        {correos.length === 0 ? (
          <p className="text-sm text-slate-500">No hay correos registrados para este contacto.</p>
        ) : (
          <ul className="space-y-3">
            {correos.map((correo) => (
              <li key={correo.id} className="rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{correo.asunto}</p>
                  <p className="text-xs text-slate-400">{new Date(correo.enviado_en).toLocaleString("es-AR")}</p>
                </div>
                {correo.cuerpo && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{correo.cuerpo}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
