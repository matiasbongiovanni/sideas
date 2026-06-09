import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPortalContext, getEndpointForRequest, getCredential } from "@/lib/portal/queries"
import { PortalSidebar } from "@/components/dashboard/PortalSidebar"
import { OCSAutoLogin } from "@/components/dashboard/OCSAutoLogin"

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

  const cred = await getCredential(user.id, endpoint)
  // base_url = "https://ims.sideasconsultores.com.ar/ocsreports"
  const iframeSrc = endpoint.base_url + "/"
  const loginAction = endpoint.base_url + "/index.php"

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
        </header>

        <div className="flex-1 overflow-hidden p-6">
          <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            {/* Direct iframe — bypasses Vercel bot protection that blocks server-side proxy */}
            <iframe
              name="ocs-frame"
              src={iframeSrc}
              title={endpoint.label}
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      </main>

      {/* Auto-submit form into iframe for SSO — cross-origin form POST is browser-allowed */}
      {cred && (
        <OCSAutoLogin
          action={loginAction}
          username={cred.username}
          password={cred.password}
        />
      )}
    </div>
  )
}
