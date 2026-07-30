import Link from "next/link"
import { getContactos } from "@/lib/asistente/queries"

export const dynamic = "force-dynamic"

export default async function ContactosPage() {
  const contactos = await getContactos()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Contactos</h2>
        <p className="text-sm text-slate-500">Registrados por el agente n8n de asistente personal.</p>
      </div>

      {contactos.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Todavía no hay contactos registrados.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Última interacción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contactos.map((contacto) => (
                <tr key={contacto.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/asistente/contactos/${contacto.id}`} className="font-medium text-slate-900 hover:text-[#4398FF]">
                      {contacto.nombre}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{contacto.telefono ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">{contacto.email ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {contacto.ultima_interaccion
                      ? new Date(contacto.ultima_interaccion).toLocaleDateString("es-AR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
