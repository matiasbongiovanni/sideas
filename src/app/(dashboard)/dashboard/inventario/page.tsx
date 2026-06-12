import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPortalContext, getEndpointForRequest } from "@/lib/portal/queries"
import { PortalSidebar } from "@/components/dashboard/PortalSidebar"
import { PortalFrame } from "@/components/dashboard/PortalFrame"

export default async function InventarioPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const ctx = await getPortalContext(user.id)
  if (!ctx) redirect("/login")

  const endpoint = await getEndpointForRequest(user.id, "inventario")
  if (!endpoint) redirect("/dashboard")

  const iframeSrc = `/portal/inventario/`

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <PortalSidebar
        profile={ctx.profile}
        client={ctx.client}
        endpoints={ctx.endpoints}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200/60 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">{endpoint.label}</h1>
            <span className="text-xs text-slate-400">{ctx.client.name}</span>
          </div>
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Abrir portal
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </header>

        <div className="flex-1 overflow-hidden p-6">
          <PortalFrame src={iframeSrc} title={endpoint.label} />
        </div>
      </main>
    </div>
  )
}
