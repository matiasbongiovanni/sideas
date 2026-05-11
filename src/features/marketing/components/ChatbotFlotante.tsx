"use client"

import { useEffect, useRef, useState } from "react"
// Asumo que tienes esto definido en tus utilidades, si no, puedes reemplazarlo por la URL directa
import { WEBHOOKS } from "@/lib/constants"

interface Message {
  role: "user" | "bot"
  text: string
}

const SUGERENCIAS = [
  "¿Por qué elegir SIDEAS?",
  "¿Hacen backup y resguardo?",
  "¿Qué servicios ofrecen?"
]

export default function ChatbotFlotante() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "¡Hola! 👋 Bienvenido a SIDEAS Consultores. Estoy aquí para ayudarte con soluciones en infraestructura, ciberseguridad, servidores, backups y más. ¿En qué puedo asistirte hoy?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [messages, open])

  const send = async (textToSend?: string) => {
    const text = textToSend || input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")
    setLoading(true)

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
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "En este momento no puedo responder. Escribinos a info@sideasconsultores.com.ar" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send()
  }

  // Mostrar sugerencias solo si el único mensaje es el saludo inicial del bot
  const showSuggestions = messages.length === 1 && !loading

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Panel del Chat */}
      <div
        className={`absolute bottom-20 right-0 w-[340px] sm:w-[400px] h-[520px] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] text-white font-bold text-sm shadow-md">
              S
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Asistente SIDEAS</h3>
              <p className="text-xs text-emerald-400 font-medium">● En línea</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label="Cerrar chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-gradient-to-br from-[#4398FF] to-[#0B3C78] text-white rounded-2xl rounded-tr-sm"
                    : "bg-slate-800 border border-slate-700/50 text-slate-200 rounded-2xl rounded-tl-sm"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Sugerencias (Chips) */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {SUGERENCIAS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => send(sug)}
                  className="text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-700 border border-slate-600/50 px-3 py-1.5 rounded-full transition-colors text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Animación de "Escribiendo..." */}
          {loading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <span className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#4398FF] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Preguntame sobre nuestros servicios..."
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#4398FF]/50 focus:ring-1 focus:ring-[#4398FF]/50 transition-all placeholder:text-slate-500 disabled:opacity-50"
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
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

      {/* Botón Flotante (FAB) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-14 w-14 rounded-full shadow-lg shadow-[#4398FF]/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
        aria-label={open ? "Cerrar chat" : "Abrir chat de soporte"}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] transition-transform duration-300 group-hover:rotate-180" />
        <div className="relative z-10 text-white transition-transform duration-300">
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90 animate-in spin-in-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-in spin-in-[-90deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  )
}