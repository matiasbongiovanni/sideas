"use client"

import { useEffect, useRef, useState } from "react"
import { WEBHOOKS } from "@/lib/constants"

interface Message {
  role: "user" | "bot"
  text: string
}

const SUGERENCIAS_HERO = [
  "¿Por qué elegir SIDEAS?",
  "¿Hacen backup y resguardo?",
]

export default function Inicio() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "¡Hola! 👋 Bienvenido a SIDEAS Consultores. Estoy aquí para ayudarte con soluciones en infraestructura, ciberseguridad, servidores, backups y más. ¿En qué puedo asistirte hoy?" },
  ])
  const [heroInput, setHeroInput] = useState("")
  const [heroLoading, setHeroLoading] = useState(false)
  const heroChatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    heroChatRef.current?.scrollTo({ top: heroChatRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const sendHero = async (textToSend?: string) => {
    const text = textToSend || heroInput.trim()
    if (!text || heroLoading) return
    setMessages((prev) => [...prev, { role: "user", text }])
    setHeroInput("")
    setHeroLoading(true)
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const botReply =
        typeof data === "string"
          ? data
          : data?.output ?? data?.message ?? data?.text ?? "Gracias por tu consulta. Un asesor te contactará pronto."
      setMessages((prev) => [...prev, { role: "bot", text: botReply }])
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "En este momento no puedo responder. Escribinos a info@sideasconsultores.com.ar" }])
    } finally {
      setHeroLoading(false)
    }
  }
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

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-8 lg:pt-40 lg:pb-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Columna Izquierda – Contenido */}
                    <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {/* Etiqueta / Badge */}
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#4398FF]/30 bg-[#4398FF]/10 px-4 py-1.5 transition-colors hover:bg-[#4398FF]/20">
                            <span className="h-2 w-2 rounded-full bg-[#4398FF] animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase text-[#4398FF]">
                                Ingeniería, Tecnología y Futuro
                            </span>
                        </div>

                        {/* Título Principal */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.1]">
                            Soluciones<br />
                            integrales y<br />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#4398FF]">
                                personalizadas
                            </span>
                        </h1>

                        <p className="mt-6 text-xl font-medium text-[#4398FF] tracking-wide">
                            Infraestructura &amp; Sistemas
                        </p>

                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
                            Integramos ingeniería, construcción de Data Centers y
                            administración de servidores para garantizar entornos tecnológicos
                            sólidos, seguros y escalables. Gestionamos almacenamiento,
                            monitoreo y procesos de backup —tanto manuales como automáticos—
                            con disponibilidad 24/7. Ofrecemos soluciones completas para PYMES
                            de 50 a 200 puestos que buscan confiabilidad, alto rendimiento y
                            continuidad operativa.
                        </p>

                        <a
                            href="#contacto"
                            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all duration-300 hover:scale-105 hover:shadow-[#4398FF]/40"
                        >
                            Contactanos
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>

                    {/* Columna Derecha – Chatbot Funcional */}
                    <div className="hidden lg:flex justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        <div className="w-full max-w-[420px] h-[480px] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 transform rotate-1 hover:rotate-0 transition-transform duration-500">

                            {/* Header */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50 bg-slate-800/30 shrink-0">
                                <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] text-white font-bold text-sm shadow-md">
                                    S
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide">Asistente SIDEAS</h3>
                                    <p className="text-xs text-emerald-400 font-medium">● En línea</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div ref={heroChatRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-gradient-to-br from-[#4398FF] to-[#0B3C78] text-white rounded-2xl rounded-tr-sm" : "bg-slate-800 border border-slate-700/50 text-slate-200 rounded-2xl rounded-tl-sm"}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {/* Suggestions */}
                                {messages.length === 1 && !heroLoading && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {SUGERENCIAS_HERO.map((sug, idx) => (
                                            <button key={idx} onClick={() => sendHero(sug)} className="text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-700 border border-slate-600/50 px-3 py-1.5 rounded-full transition-colors text-left">
                                                {sug}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Loading */}
                                {heroLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                            <span className="flex gap-1.5 items-center h-4">
                                                {[0, 1, 2].map((i) => (
                                                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#4398FF] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-slate-900/50 border-t border-slate-800 shrink-0">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={heroInput}
                                        onChange={(e) => setHeroInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendHero()}
                                        placeholder="Preguntame sobre nuestros servicios..."
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#4398FF]/50 focus:ring-1 focus:ring-[#4398FF]/50 transition-all placeholder:text-slate-500 disabled:opacity-50"
                                        disabled={heroLoading}
                                    />
                                    <button
                                        onClick={() => sendHero()}
                                        disabled={heroLoading || !heroInput.trim()}
                                        className="absolute right-1.5 p-2 rounded-full bg-[#4398FF] text-white transition-all hover:bg-blue-400 disabled:opacity-0 disabled:scale-75"
                                        aria-label="Enviar mensaje"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
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
                            <span className="font-bold text-white tracking-widest mr-2">ESTAMOS EN:</span>
                            <span className="text-[#4398FF] font-semibold">CÓRDOBA</span> <span className="text-slate-600 mx-1">/</span>
                            <span className="text-[#4398FF] font-semibold">NEUQUÉN</span> <span className="text-slate-600 mx-1">/</span>
                            <span className="text-[#4398FF] font-semibold">SANTA FE</span> <span className="text-slate-600 mx-1">/</span>
                            <span className="text-[#4398FF] font-semibold">BUENOS AIRES</span>
                            <span className="hidden md:inline text-slate-400 italic ml-2">...y seguimos creciendo.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}