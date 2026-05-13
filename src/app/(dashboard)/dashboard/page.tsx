import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/lib/supabase/actions"

export default async function Dashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Extraemos un "nombre" simulado antes del @ para mostrar en el perfil
  const clientName = user.email?.split('@')[0] || "Cliente"

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">

      {/* SIDEBAR (Panel Lateral Izquierdo) */}
      <aside className="w-72 flex-shrink-0 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-300">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="#inicio" className="transition-transform hover:scale-105">
            <Image src="/Sideas_Blanco.png" alt="SIDEAS Logo" width={130} height={38} priority />
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">
            Panel de Control
          </p>

          {/* Opción 1: Zabbix (Activo por defecto) */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-xl bg-[#4398FF]/10 border border-[#4398FF]/20 px-4 py-3 text-sm font-semibold text-[#4398FF] shadow-[0_0_15px_rgba(67,152,255,0.05)] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Monitoreo Zabbix
          </Link>

          {/* Opción 2: Ticketera (Inactivo) */}
          <Link
            href="/dashboard/tickets"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Ticketera
          </Link>
        </nav>

        {/* User Profile & Logout (Fijo abajo) */}
        <div className="p-4 border-t border-white/5 bg-slate-900/30">
          {/* Info de Usuario */}
          <div className="flex items-center gap-3 px-2 py-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] text-white font-bold text-sm shadow-md">
              {clientName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate capitalize">
                {clientName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Formulario de Logout */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header superior */}
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200/60 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">Estado de Infraestructura</h1>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sistemas Operativos - Datos Actualizados"></span>
          </div>
        </header>

        {/* Área de trabajo: Iframe de Zabbix */}
        <div className="flex-1 p-6 bg-slate-50 overflow-hidden">
          <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <iframe
              src="https://monitor.ingeniasa.com.ar/zabbix.php?action=dashboard.view&dashboardid=1&from=now-1h&to=now"
              title="Zabbix Dashboard"
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      </main>

    </div>
  )
}