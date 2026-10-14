"use client"

import { useTranslations } from "next-intl"
import HeroDemoDashboard from "./home/HeroDemoDashboard"

function Check() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-[#4398FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}

export default function Inicio() {
    const t = useTranslations("Hero")
    return (
        <section
            id="inicio"
            className="relative min-h-screen overflow-hidden bg-slate-950"
            style={{
                background: "linear-gradient(135deg, #020617 0%, #0F172A 50%, #0B3C78 100%)",
            }}
        >
            {/* Elementos Decorativos de Fondo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Patrón de cuadrícula sutil */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
                {/* Luces desenfocadas (Glow) */}
                <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full blur-[120px] opacity-40 animate-pulse" style={{ background: "#0B3C78" }} />
                <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full blur-[100px] opacity-30 animate-pulse" style={{ background: "#4398FF", animationDelay: "2s" }} />

                {/* Partículas flotantes */}
                <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-[#4398FF] animate-bounce" style={{ animationDuration: "3s" }} />
                <div className="absolute top-1/3 right-[16%] h-3 w-3 rounded-full bg-[#4398FF]/60 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
                <div className="absolute bottom-1/3 left-1/4 h-2 w-2 rounded-full bg-[#4398FF]/40 animate-bounce" style={{ animationDuration: "5s", animationDelay: "2s" }} />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-40 lg:px-8 lg:pt-40 lg:pb-44">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Columna Izquierda – Contenido */}
                    <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#4398FF]/30 bg-[#4398FF]/10 px-4 py-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#4398FF] animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase text-[#4398FF]">
                                {t("badge")}
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.1]">
                            {t("title1")}<br />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#4398FF]">
                                {t("title2")}
                            </span><br />
                            {t("title3")}
                        </h1>

                        <p className="mt-6 text-xl font-medium text-[#4398FF] tracking-wide">
                            {t("subtitle")}
                        </p>

                        <ul className="mt-6 space-y-3 text-lg text-slate-300">
                            {(["bullet1", "bullet2", "bullet3"] as const).map((k) => (
                                <li key={k} className="flex items-start gap-3">
                                    <Check />
                                    <span>{t(k)}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <a
                                href="#demos"
                                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all duration-300 hover:scale-105 hover:shadow-[#4398FF]/40"
                            >
                                {t("ctaPrimary")}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a
                                href="#contacto"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
                            >
                                {t("ctaSecondary")}
                            </a>
                        </div>

                        <p className="mt-4 text-xs text-slate-400">{t("microcopy")}</p>
                    </div>

                    {/* Columna Derecha – Dashboard de monitoreo (datos de demostración) */}
                    <div className="hidden lg:flex justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        <HeroDemoDashboard />
                    </div>
                </div>
            </div>

            {/* Banner de Ubicación (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="mx-auto max-w-7xl px-6 pb-6 lg:px-8">
                    {/* Contenedor Glassmorphism */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md px-8 py-5 shadow-xl">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#4398FF]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4398FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-300 text-center sm:text-left leading-relaxed tracking-wide">
                            <span className="font-bold text-white tracking-widest mr-2">{t("locationLabel")}</span>
                            <span className="text-[#4398FF] font-semibold">CÓRDOBA</span> <span className="text-slate-600 mx-1">/</span>
                            <span className="text-[#4398FF] font-semibold">NEUQUÉN</span> <span className="text-slate-600 mx-1">/</span>
                            <span className="text-[#4398FF] font-semibold">SANTA FE</span> <span className="text-slate-600 mx-1">/</span>
                            <span className="text-[#4398FF] font-semibold">BUENOS AIRES</span>
                            <span className="hidden md:inline text-slate-400 italic ml-2">{t("growingNote")}</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}