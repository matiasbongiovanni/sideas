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

      {/* CONTENIDO PRINCIPAL (Donde va Zabbix Integrado) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header superior sutil */}
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200/60 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">Estado de Infraestructura</h1>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sistemas Operativos - Datos Actualizados"></span>
          </div>
          {/* Controles de Dashboard o info adicional */}
        </header>

        {/* Área de trabajo (Dashboard Zabbix Integrado e Ilustrativo) */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">

          {/* Dashboard de Zabbix Integrado e Ilustrativo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* Panel 1: Estado de Hosts (Mapa/Tabla) */}
            <div className="md:col-span-2 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 12m0 0l3-12m-3 12h12M9 6l3 12m0 0l3-12m-3 12h-6m6-6v3a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2a1 1 0 00-1 1v3" />
                </svg>
                Estado de Dispositivos (Mapa/Tabla)
              </h2>
              <div className="aspect-[2/1] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                <div className="text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold text-slate-600">Visualización de Mapa/Tabla de Dispositivos</p>
                  <p className="text-sm mt-1">Representación ilustrativa de estado de hosts con indicadores visuales.</p>
                  <p className="text-xs mt-2 text-emerald-600 font-medium">95 Hosts ONLINE / 5 Hosts OFFLINE</p>
                </div>
              </div>
            </div>

            {/* Panel 2: Problemas Activos (Lista) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Problemas Activos (Lista)
              </h2>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900">
                  <p className="font-semibold">Servidor A - CPU Alta Usage (90%)</p>
                  <p className="text-xs">Hace 5 min - <span className="font-medium">Alto</span></p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                  <p className="font-semibold">Dispositivo B - Alta Latencia de Red (150ms)</p>
                  <p className="text-xs">Hace 15 min - <span className="font-medium">Medio</span></p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
                  <p className="font-semibold">Servidor C - Memoria Baja Usage (85%)</p>
                  <p className="text-xs">Hace 30 min - <span className="font-medium">Aviso</span></p>
                </div>
              </div>
              <button className="mt-4 text-xs font-bold tracking-widest text-[#4398FF] uppercase border-b border-transparent hover:border-[#4398FF] transition-all self-end">Ver todos</button>
            </div>

            {/* Panel 3: Gráficos de Rendimiento (CPU/Memoria) */}
            <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4398FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M3 4v16M3 20h18" />
                </svg>
                Rendimiento (CPU/Memoria)
              </h2>
              <div className="space-y-4">
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-600 text-sm">
                  <p className="font-semibold">Servidor A - CPU Usage (Última Hora)</p>
                  <div className="h-20 flex items-end gap-1 mt-2">
                    {[20, 30, 45, 60, 55, 70, 65, 80, 75, 90, 85].map((value, idx) => (
                      <div key={idx} className="flex-1 bg-[#4398FF]/60 rounded-t" style={{ height: `${value}%` }}></div>
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-center font-medium">Promedio: 60% / Pico: 90%</p>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-600 text-sm">
                  <p className="font-semibold">Servidor A - Memoria Usage (Última Hora)</p>
                  <div className="h-20 flex items-end gap-1 mt-2">
                    {[50, 55, 60, 65, 70, 68, 72, 75, 78, 80, 82].map((value, idx) => (
                      <div key={idx} className="flex-1 bg-teal-500/60 rounded-t" style={{ height: `${value}%` }}></div>
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-center font-medium">Usada: 82GB / Total: 100GB</p>
                </div>
              </div>
            </div>

            {/* Panel 4: Top Triggers (Más Frecuentes/Severos) */}
            <div className="lg:col-span-1 xl:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Top Triggers (Frecuentes/Severos)
              </h2>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-950">
                  <p className="font-semibold">CPU Usage &gt; 90%</p>
                  <p className="text-xs">Hosts: Servidor A, Servidor X - Frecuencia: 10/hora - <span className="font-medium">Alto</span></p>
                </div>
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-lg text-sm text-amber-950">
                  <p className="font-semibold">Memoria Usage &gt; 85%</p>
                  <p className="text-xs">Hosts: Servidor A, Servidor Y - Frecuencia: 5/hora - <span className="font-medium">Medio</span></p>
                </div>
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-950">
                  <p className="font-semibold">Servicio MySQL OFFLINE</p>
                  <p className="text-xs">Host: Servidor Z - Frecuencia: 2/hora - <span className="font-medium">Crítico</span></p>
                </div>
              </div>
              <button className="mt-4 text-xs font-bold tracking-widest text-[#4398FF] uppercase border-b border-transparent hover:border-[#4398FF] transition-all self-end">Ver todos</button>
            </div>

            {/* Puedes agregar más paneles ilustrativos aquí */}
          </div>

        </div>
      </main>

    </div>
  )
}