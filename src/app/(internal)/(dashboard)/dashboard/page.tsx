import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPortalContext } from "@/lib/portal/queries"

export default async function DashboardRoot() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const ctx = await getPortalContext(user.id)

  if (!ctx || ctx.endpoints.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center max-w-sm px-6">
          <p className="text-lg font-semibold text-slate-700">Sin portales asignados</p>
          <p className="text-sm text-slate-500 mt-1">
            Tu cuenta aún no tiene portales configurados. Contactá a SIDEAS.
          </p>
        </div>
      </div>
    )
  }

  // Redirigir al primer endpoint asignado
  redirect(`/dashboard/${ctx.endpoints[0].type}`)
}
