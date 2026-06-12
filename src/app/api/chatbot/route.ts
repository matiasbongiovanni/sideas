import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

const CHATBOT_WEBHOOK = process.env.CHATBOT_WEBHOOK_URL

const ChatbotSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().max(100).optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(2000),
  })).max(20).optional(),
})

export async function POST(req: NextRequest) {
  const rl = rateLimit(`chatbot:${getClientIp(req)}`, 20, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intentá de nuevo en un momento." }, {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) },
    })
  }

  if (!CHATBOT_WEBHOOK) {
    return NextResponse.json({ error: "Servicio no configurado." }, { status: 503 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const parsed = ChatbotSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const res = await fetch(CHATBOT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })

    const data = await res.text()
    try {
      return NextResponse.json(JSON.parse(data))
    } catch {
      return NextResponse.json({ output: data })
    }
  } catch (error) {
    console.error("Chatbot proxy error:", error)
    return NextResponse.json({ error: "No se pudo conectar con el asistente." }, { status: 502 })
  }
}
