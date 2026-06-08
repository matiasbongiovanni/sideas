import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/news.server"
import { createNewsPost, listAdminNews } from "@/lib/news.server"
import { isAdminEmail } from "@/lib/admin"

export const maxDuration = 30

async function assertAdmin() {
  const session = await requireAdminSession()
  if (!session || !isAdminEmail(session.user.email)) return null
  return session
}

export async function GET() {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const posts = await listAdminNews()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("GET /api/admin/noticias", error)
    return NextResponse.json({ error: "No se pudieron cargar las noticias" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()

    const title = String(body.title ?? "").trim()
    const content = String(body.content ?? "").trim()
    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son obligatorios" }, { status: 400 })
    }

    const post = await createNewsPost({
      title,
      slug: String(body.slug ?? "").trim() || null,
      excerpt: String(body.excerpt ?? "").trim() || null,
      content,
      cover_image_url: String(body.cover_image_url ?? "").trim() || null,
      category: String(body.category ?? "Blog").trim() || "Blog",
      author_name: String(body.author_name ?? "SIDEAS Consultores").trim() || "SIDEAS Consultores",
      status: body.status === "published" ? "published" : "draft",
      published_at: String(body.published_at ?? "").trim() || null,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("POST /api/admin/noticias", error)
    return NextResponse.json({ error: "No se pudo crear la noticia" }, { status: 500 })
  }
}
