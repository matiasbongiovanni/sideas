"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/lib/supabase/actions"
import type { PortalEndpoint, PortalProfile, PortalClient } from "@/lib/portal/queries"

const ENDPOINT_ICONS: Record<string, React.ReactNode> = {
  inventario: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  zabbix: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
}

type Props = {
  profile: PortalProfile
  client: PortalClient
  endpoints: PortalEndpoint[]
}

export function PortalSidebar({ profile, client, endpoints }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-72 flex-shrink-0 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/" className="transition-transform hover:scale-105">
          <Image src="/Sideas_Blanco.png" alt="SIDEAS Logo" width={130} height={38} priority />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">
          Panel de Control
        </p>

        {endpoints.map((ep) => {
          const href = `/dashboard/${ep.type}`
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={ep.id}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#4398FF]/10 border border-[#4398FF]/20 text-[#4398FF] font-semibold shadow-[0_0_15px_rgba(67,152,255,0.05)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`transition-transform group-hover:scale-110 ${isActive ? "" : ""}`}>
                {ENDPOINT_ICONS[ep.type] ?? null}
              </span>
              {ep.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5 bg-slate-900/30">
        <div className="flex items-center gap-3 px-2 py-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] text-white font-bold text-sm shadow-md">
            {profile.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{profile.full_name}</p>
            <p className="text-xs text-slate-400 truncate">@{profile.username}</p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
