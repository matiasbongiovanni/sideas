"use client";

import { useState } from "react";
import Link from "next/link";
import { servicios } from "@/data/servicios";

// Mapeo de íconos (el mismo que tenías)
const iconMap: Record<string, React.ReactNode> = {
    server: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
    cloud: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    database: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
    phone: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    network: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
    refresh: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    shield: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    activity: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    fingerprint: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>,
    mail: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    headphones: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a1 1 0 001 1h1a1 1 0 001-1v-3a1 1 0 00-1-1H4a1 1 0 00-1 1v3zm16 0a1 1 0 01-1 1h-1a1 1 0 01-1-1v-3a1 1 0 011-1h1a1 1 0 011 1v3z" /></svg>,
};

// Categorías lógicas (podés ajustar los IDs que entran en cada una)
const CATEGORIAS = [
    { id: "todos", label: "Todos los servicios" },
    { id: "infra", label: "Infraestructura & Cloud" },
    { id: "seguridad", label: "Seguridad & Redes" },
    { id: "soporte", label: "Soporte & Gestión" },
];

export default function ServiciosInteractivos() {
    const [filtro, setFiltro] = useState("todos");

    // Lógica para filtrar (ajustá esto según los IDs reales de tus servicios)
    const serviciosFiltrados = servicios.filter((s) => {
        if (filtro === "todos") return true;
        if (filtro === "infra") return ["server", "cloud", "database"].includes(s.icon);
        if (filtro === "seguridad") return ["shield", "lock", "fingerprint", "network"].includes(s.icon);
        if (filtro === "soporte") return ["phone", "headphones", "mail", "refresh", "activity"].includes(s.icon);
        return true;
    });

    return (
        <section className="relative flex-1 bg-white pb-32 pt-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* ── TABS / FILTROS ── */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
                    {CATEGORIAS.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFiltro(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${filtro === cat.id
                                    ? "bg-[#0B3C78] text-white shadow-md shadow-[#0B3C78]/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* ── GRID DE TARJETAS (Animado) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {serviciosFiltrados.map((servicio) => (
                        <div
                            key={servicio.id}
                            className="group relative flex flex-col justify-between p-8 bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#4398FF]/10 hover:border-[#4398FF]/30 z-10"
                        >
                            {/* Ícono grande y llamativo */}
                            <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-800 mb-6 transition-all duration-300 group-hover:bg-[#4398FF] group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                                {iconMap[servicio.icon]}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-[#4398FF] transition-colors">
                                    {servicio.name}
                                </h2>
                                {/* Cortamos a 3 líneas exactas para que todas las cards midan lo mismo */}
                                <p className="text-sm leading-relaxed text-slate-500 line-clamp-3">
                                    {servicio.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA FINAL ── */}
                <div className="mt-24 text-center bg-[#0F172A] rounded-[3rem] p-12 lg:p-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#4398FF]/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Diseñamos infraestructura a tu medida
                        </h3>
                        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                            Si tu empresa tiene requerimientos específicos, nuestro equipo de ingeniería está listo para armar un plan de acción.
                        </p>
                        <Link
                            href="/#contacto"
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#4398FF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:-translate-y-1 hover:bg-[#3480eb]"
                        >
                            Contactar con un asesor
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}