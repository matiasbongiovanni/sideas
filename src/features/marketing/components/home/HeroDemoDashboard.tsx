"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

// Datos ficticios (empresa demo). Nada de esto sale de un cliente real.
const LATENCIA_INICIAL = [14, 12, 15, 13, 11, 16, 14, 12, 18, 15, 13, 12, 14, 17, 13, 12, 11, 14, 13, 15]

function siguienteLatencia(prev: number) {
    const delta = Math.round((Math.random() - 0.5) * 6)
    return Math.min(22, Math.max(8, prev + delta))
}

function Sparkline({ puntos }: { puntos: number[] }) {
    const w = 360
    const h = 70
    const max = 24
    const d = puntos.map((v, i) => `${i ? "L" : "M"} ${(i / (puntos.length - 1)) * w} ${h - (v / max) * h}`).join(" ")
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-[70px] w-full" preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id="hero-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4398FF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4398FF" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#hero-spark)" />
            <path d={d} fill="none" stroke="#4398FF" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

export default function HeroDemoDashboard() {
    const t = useTranslations("HomePage.dashboard")
    const [latencia, setLatencia] = useState(LATENCIA_INICIAL)

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const id = setInterval(() => {
            setLatencia((prev) => [...prev.slice(1), siguienteLatencia(prev[prev.length - 1])])
        }, 1500)
        return () => clearInterval(id)
    }, [])

    const actual = latencia[latencia.length - 1]
    const tiles = [
        { label: t("hosts"), value: "47", color: "text-white" },
        { label: t("uptime"), value: "99,97%", color: "text-emerald-400" },
        { label: t("alertas"), value: "2", color: "text-amber-400" },
        { label: t("respuesta"), value: "8 min", color: "text-[#4398FF]" },
    ]
    const eventos = [
        { texto: t("ev1"), color: "bg-emerald-400", hora: "09:42" },
        { texto: t("ev2"), color: "bg-amber-400", hora: "09:18" },
        { texto: t("ev3"), color: "bg-emerald-400", hora: "03:05" },
    ]

    return (
        <div className="w-full max-w-[440px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-slate-800/30">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide">{t("titulo")}</span>
                </div>
                <span className="rounded-full border border-[#4398FF]/30 bg-[#4398FF]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#4398FF]">
                    {t("demo")}
                </span>
            </div>

            <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {tiles.map((tile) => (
                        <div key={tile.label} className="rounded-2xl border border-slate-700/50 bg-white/[0.03] px-4 py-3">
                            <p className={`text-2xl font-bold tabular-nums ${tile.color}`}>{tile.value}</p>
                            <p className="text-xs text-slate-400">{tile.label}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-white/[0.03] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">{t("latencia")}</span>
                        <span className="font-mono text-[#4398FF] tabular-nums">{actual} ms</span>
                    </div>
                    <Sparkline puntos={latencia} />
                </div>

                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">{t("eventos")}</p>
                    <ul className="space-y-2">
                        {eventos.map((ev) => (
                            <li key={ev.texto} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                                <span className={`h-2 w-2 shrink-0 rounded-full ${ev.color}`} />
                                <span className="flex-1 truncate">{ev.texto}</span>
                                <span className="font-mono text-xs text-slate-500">{ev.hora}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-center text-[10px] uppercase tracking-widest text-slate-500">{t("pie")}</p>
            </div>
        </div>
    )
}
