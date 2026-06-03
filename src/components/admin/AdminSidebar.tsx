"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Newspaper, ExternalLink } from "lucide-react"
import { adminLogout } from "@/lib/supabase/actions"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin#noticias", label: "Noticias / Blog", icon: Newspaper },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-80 shrink-0 border-r border-slate-200 bg-white">
      <div className="flex min-h-screen w-full flex-col">
        <div className="border-b border-slate-200 px-8 py-6">
          <Link href="/admin" className="inline-block">
            <Image src="/sideas_azul.png" alt="SIDEAS" width={140} height={40} priority />
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-[#EEF4FF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0B3C78]">
              CMS Privado
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
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
                    ? "border-[#4398FF]/20 bg-[#EEF4FF] text-[#0B3C78]"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 space-y-2">
          <Link
            href="/noticias"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
