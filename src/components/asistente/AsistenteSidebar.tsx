"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, CheckSquare, Users, Mail, Calendar, User } from "lucide-react"
import { asistenteLogout } from "@/lib/supabase/actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { href: "/asistente", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/asistente/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/asistente/contactos", label: "Contactos", icon: Users },
  { href: "/asistente/correo", label: "Correo", icon: Mail },
  { href: "/asistente/calendario", label: "Calendario", icon: Calendar },
  { href: "/asistente/usuario", label: "Usuario", icon: User },
]

interface AsistenteSidebarProps {
  user?: SupabaseUser | null
}

export default function AsistenteSidebar({ user }: AsistenteSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-80 shrink-0 border-r border-[#1a5290] bg-[#0B3C78]">
      <div className="flex min-h-screen w-full flex-col">
        <div className="border-b border-[#1a5290] px-8 py-6">
          <Link href="/asistente" className="inline-block">
            <Image src="/Sideas_Blanco.png" alt="SIDEAS" width={140} height={40} priority />
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/80">
              Asistente Personal
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/40">
            Panel
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-transparent text-white/70 hover:border-white/10 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          {user?.email && (
            <div className="border-t border-[#1a5290] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <User className="h-4 w-4 text-white/70" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
                    Sesión
                  </p>
                  <p className="truncate text-xs font-medium text-white/80">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[#1a5290] p-4">
            <form action={asistenteLogout}>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/15 transition-all hover:brightness-110 active:scale-[0.99] border border-[#4398FF]/40"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  )
}
