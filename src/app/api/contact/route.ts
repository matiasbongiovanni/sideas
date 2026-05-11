import { NextRequest, NextResponse } from "next/server"
import { WEBHOOKS } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(WEBHOOKS.contactForm, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.text()

    try {
      const json = JSON.parse(data)
      return NextResponse.json(json, { status: res.status })
    } catch {
      return NextResponse.json({ message: data }, { status: res.status })
    }
  } catch (error) {
    console.error("Contact form proxy error:", error)
    return NextResponse.json(
      { error: "No se pudo enviar el formulario." },
      { status: 502 }
    )
  }
}
