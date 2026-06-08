import { NextRequest, NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/admin"
import { requireAdminSession, deleteNewsPost, updateNewsPost } from "@/lib/news.server"

export const maxDuration = 30

async function assertAdmin() {
  const session = await requireAdminSession()
  if (!session || !isAdminEmail(session.user.email)) return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const title = String(body.title ?? "").trim()
    const content = String(body.content ?? "").trim()
    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son obligatorios" }, { status: 400 })
    }

    const post = await updateNewsPost(id, {
      title,
      excerpt: String(body.excerpt ?? "").trim() || null,
      content,
      cover_image_url: String(body.cover_image_url ?? "").trim() || null,
      category: String(body.category ?? "Blog").trim() || "Blog",
      author_name: String(body.author_name ?? "SIDEAS Consultores").trim() || "SIDEAS Consultores",
      status: body.status === "published" ? "published" : "draft",
      published_at: String(body.published_at ?? "").trim() || null,
      slug: String(body.slug ?? "").trim() || null,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error(`PATCH /api/admin/noticias/${id}`, error)
    return NextResponse.json({ error: "No se pudo actualizar la noticia" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { id } = await params

  try {
    await deleteNewsPost(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(`DELETE /api/admin/noticias/${id}`, error)
    return NextResponse.json({ error: "No se pudo eliminar la noticia" }, { status: 500 })
  }
}

