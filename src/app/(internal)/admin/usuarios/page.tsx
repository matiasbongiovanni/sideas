import type { Metadata } from "next"
import { redirect } from "next/navigation"
import UsuariosPortalManager from "@/components/admin/UsuariosPortalManager"
import { requireAdminSession } from "@/lib/news.server"
import { listPortalClientsWithDetails } from "@/lib/portal/admin-queries"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Usuarios del Portal",
  robots: { index: false, follow: false },
}

export default async function UsuariosPortalPage() {
  const session = await requireAdminSession()
  if (!session) redirect("/admin/login")

  const clients = await listPortalClientsWithDetails()

  return <UsuariosPortalManager initialClients={clients} />
}
