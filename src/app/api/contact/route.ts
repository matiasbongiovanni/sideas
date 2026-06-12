import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

const CONTACT_WEBHOOK = process.env.CONTACT_WEBHOOK_URL

const ContactSchema = z.object({
  nombre: z.string().min(1).max(200),
  email: z.string().email().max(200),
  empresa: z.string().max(200).optional(),
  mensaje: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  // 5 submissions per IP per hour
  const rl = rateLimit(`contact:${getClientIp(req)}`, 5, 60 * 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiados envíos. Intentá de nuevo más tarde." }, {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) },
    })
  }

  if (!CONTACT_WEBHOOK) {
    return NextResponse.json({ error: "Servicio no configurado." }, { status: 503 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const res = await fetch(CONTACT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })

    const data = await res.text()
    try {
      return NextResponse.json(JSON.parse(data), { status: res.status })
    } catch {
      return NextResponse.json({ message: data }, { status: res.status })
    }
  } catch (error) {
    console.error("Contact form proxy error:", error)
    return NextResponse.json({ error: "No se pudo enviar el formulario." }, { status: 502 })
  }
}
