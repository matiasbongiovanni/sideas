"use client"

import { useRef, useState } from "react"
import { MessageCircle, Send, X, Loader2 } from "lucide-react"

interface ChatMessage {
  rol: "usuario" | "agente" | "error"
  texto: string
}

export default function AsistenteChatWidget() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [enviando, setEnviando] = useState(false)
  const sessionIdRef = useRef(`mati-${Date.now()}`)

  async function enviar() {
    const mensaje = input.trim()
    if (!mensaje || enviando) return

    setMensajes((prev) => [...prev, { rol: "usuario", texto: mensaje }])
    setInput("")
    setEnviando(true)

    try {
      const res = await fetch("/api/asistente/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje, sessionId: sessionIdRef.current }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMensajes((prev) => [...prev, { rol: "error", texto: data.error ?? "Error inesperado" }])
      } else {
        setMensajes((prev) => [...prev, { rol: "agente", texto: String(data.respuesta) }])
      }
    } catch {
      setMensajes((prev) => [...prev, { rol: "error", texto: "No se pudo conectar con el agente." }])
    } finally {
      setEnviando(false)
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] text-white shadow-xl shadow-[#4398FF]/30 transition-transform hover:scale-105"
        aria-label="Abrir chat del asistente"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-96 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Asistente</p>
          <p className="text-sm font-semibold">Chat con el agente</p>
        </div>
        <button onClick={() => setAbierto(false)} aria-label="Cerrar chat">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
        {mensajes.length === 0 && (
          <p className="text-sm text-slate-400">Escribile al agente: agenda, tareas, contactos, correos.</p>
        )}
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={[
              "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
              m.rol === "usuario"
                ? "ml-auto bg-[#0B3C78] text-white"
                : m.rol === "error"
                ? "bg-red-50 text-red-700"
                : "bg-white text-slate-800 shadow-sm",
            ].join(" ")}
          >
            {m.texto}
          </div>
        ))}
        {enviando && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" /> pensando...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          enviar()
        }}
        className="flex items-center gap-2 border-t border-slate-200 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí un mensaje..."
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4398FF]"
          disabled={enviando}
        />
        <button
          type="submit"
          disabled={enviando || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B3C78] text-white disabled:opacity-40"
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
