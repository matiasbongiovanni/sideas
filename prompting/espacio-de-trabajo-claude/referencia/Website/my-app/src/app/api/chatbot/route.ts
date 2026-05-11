import { NextRequest, NextResponse } from "next/server"
import { WEBHOOKS } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(WEBHOOKS.chatbot, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.text()

    // Try to parse as JSON, fallback to raw text
    try {
      const json = JSON.parse(data)
      return NextResponse.json(json)
    } catch {
      return NextResponse.json({ output: data })
    }
  } catch (error) {
    console.error("Chatbot proxy error:", error)
    return NextResponse.json(
      { error: "No se pudo conectar con el asistente." },
      { status: 502 }
    )
  }
}
