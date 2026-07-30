import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AsistenteSidebar from "@/components/asistente/AsistenteSidebar"
import AsistenteChatWidget from "@/components/asistente/AsistenteChatWidget"
import { getUser } from "@/lib/supabase/actions"
import { isAsistenteEmail } from "@/lib/asistente/allowlist"

export const metadata: Metadata = {
  title: {
    default: "Asistente Personal | SIDEAS",
    template: "%s | Asistente Personal",
  },
  robots: { index: false, follow: false },
}

export default async function AsistenteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser()

  if (!user || !isAsistenteEmail(user.email)) {
    redirect("/asistente/login")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex min-h-screen">
        <AsistenteSidebar user={user} />
        <main className="flex min-h-screen flex-1 flex-col">
          <div className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm lg:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#4398FF]">
                  Panel privado
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Asistente Personal
                </h1>
              </div>
              <div className="hidden text-sm text-slate-500 md:block">Alimentado por n8n</div>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-8 lg:px-10">
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>
      <AsistenteChatWidget />
    </div>
  )
}
