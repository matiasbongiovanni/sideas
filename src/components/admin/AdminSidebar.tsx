"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, LogOut, Newspaper, ExternalLink } from "lucide-react"
import { adminLogout } from "@/lib/supabase/actions"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin#noticias", label: "Noticias / Blog", icon: Newspaper },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-80 shrink-0 border-r border-white/10 bg-[#07111f] text-white">
      <div className="flex min-h-screen w-full flex-col">
        <div className="border-b border-white/10 px-8 py-6">
          <Link href="/admin" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <Image src="/Sideas_Blanco.png" alt="SIDEAS" width={120} height={34} priority />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.28em] text-[#4398FF]">CMS PRIVADO</p>
              <p className="text-xs text-slate-400">SIDEAS Consultores</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
            Panel
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href.split("#")[0])

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-[#4398FF]/30 bg-[#4398FF]/10 text-[#7ab8ff]"
                    : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/noticias"
            className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Ver noticias públicas
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/15 transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

