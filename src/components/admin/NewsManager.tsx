"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Edit3, ImageIcon, Plus, RefreshCw, Search, Save, Sparkles, Trash2 } from "lucide-react"
import type { NewsPost, NewsStatus } from "@/lib/news"
import { NEWS_CATEGORIES, NEWS_DEFAULT_COVER, formatNewsDateTime, getExcerpt, slugify, toDateTimeLocal } from "@/lib/news"

type Draft = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  category: string
  author_name: string
  status: NewsStatus
  published_at: string
}

function createEmptyDraft(): Draft {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: NEWS_DEFAULT_COVER,
    category: NEWS_CATEGORIES[0],
    author_name: "SIDEAS Consultores",
    status: "draft",
    published_at: new Date().toISOString().slice(0, 16),
  }
}

function statusLabel(status: NewsStatus) {
  return status === "published" ? "Publicado" : "Borrador"
}

function StatusBadge({ status }: { status: NewsStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        status === "published"
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/20",
      ].join(" ")}
    >
      {statusLabel(status)}
    </span>
  )
}

export default function NewsManager({ initialPosts }: { initialPosts: NewsPost[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | NewsStatus>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(createEmptyDraft)
  const [slugAuto, setSlugAuto] = useState(true)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/noticias", { cache: "no-store" })
      if (!res.ok) throw new Error("No se pudieron cargar las noticias")
      const data = (await res.json()) as NewsPost[]
      setPosts(data)
    } catch {
      // noop, la vista sigue funcionando con el estado actual
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesStatus = statusFilter === "all" || post.status === statusFilter
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.slug.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        getExcerpt(post).toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [posts, search, statusFilter])

  const stats = useMemo(() => {
    const published = posts.filter((post) => post.status === "published").length
    const draftCount = posts.filter((post) => post.status === "draft").length
    return [
      { label: "Total", value: posts.length, color: "text-slate-900" },
      { label: "Publicadas", value: published, color: "text-emerald-600" },
      { label: "Borradores", value: draftCount, color: "text-amber-600" },
    ]
  }, [posts])

  const openNew = () => {
    setEditingId(null)
    setSlugAuto(true)
    setDraft(createEmptyDraft())
  }

  const openEdit = (post: NewsPost) => {
    setEditingId(post.id)
    setSlugAuto(false)
    setDraft({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      cover_image_url: post.cover_image_url ?? NEWS_DEFAULT_COVER,
      category: post.category,
      author_name: post.author_name ?? "SIDEAS Consultores",
      status: post.status,
      published_at: toDateTimeLocal(post.published_at),
    })
  }

  const savePost = async (status: NewsStatus) => {
    if (!draft.title.trim() || !draft.content.trim()) return

    setSaving(true)
    try {
      const payload = {
        title: draft.title.trim(),
        slug: draft.slug.trim() || slugify(draft.title),
        excerpt: draft.excerpt.trim() || null,
        content: draft.content.trim(),
        cover_image_url: draft.cover_image_url.trim() || null,
        category: draft.category.trim() || NEWS_CATEGORIES[0],
        author_name: draft.author_name.trim() || "SIDEAS Consultores",
        status,
        published_at: status === "published" ? new Date(draft.published_at).toISOString() : null,
      }

      const isEdit = Boolean(editingId)
      const res = await fetch(isEdit ? `/api/admin/noticias/${editingId}` : "/api/admin/noticias", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(await res.text())

      await loadPosts()
      setEditingId(null)
      setDraft(createEmptyDraft())
      setSlugAuto(true)
      router.refresh()
    } catch {
      // noop
    } finally {
      setSaving(false)
    }
  }

  const removePost = async (post: NewsPost) => {
    if (!confirm(`¿Eliminar "${post.title}"?`)) return
    setDeletingId(post.id)
    try {
      const res = await fetch(`/api/admin/noticias/${post.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      await loadPosts()
      if (editingId === post.id) {
        setEditingId(null)
        setDraft(createEmptyDraft())
      }
      router.refresh()
    } catch {
      // noop
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10 shadow-sm"

  return (
    <section id="noticias" className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{stat.label}</p>
            <div className={`mt-3 text-4xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Header + search */}
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#0B3C78]">CMS editorial</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Noticias y blog</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Cargá y modificá publicaciones desde un panel privado. Al guardar como publicado, el contenido aparece automáticamente en{" "}
              <Link href="/noticias" className="font-medium text-[#0B3C78] underline decoration-[#4398FF]/40 hover:decoration-[#4398FF]">
                /noticias
              </Link>{" "}
              y en la home.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadPosts()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Recargar
            </button>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Nueva noticia
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_0.9fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Buscar noticias..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none shadow-sm placeholder:text-slate-400 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {(["all", "published", "draft"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={[
                  "rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors shadow-sm",
                  statusFilter === value
                    ? "border-[#4398FF]/20 bg-[#EEF4FF] text-[#0B3C78]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {value === "all" ? "Todas" : statusLabel(value)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid: table + form */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Table */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Listado</h3>
            <span className="text-sm text-slate-500">
              {loading ? "Actualizando..." : `${filteredPosts.length} resultado${filteredPosts.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.24em] text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Título</th>
                  <th className="px-4 py-4 font-semibold">Estado</th>
                  <th className="px-4 py-4 font-semibold">Fecha</th>
                  <th className="px-4 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-sm text-slate-500" colSpan={4}>
                      No hay publicaciones para mostrar.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <div className="max-w-[18rem]">
                          <p className="truncate font-medium text-slate-900">{post.title}</p>
                          <p className="mt-1 truncate text-xs text-slate-500">{getExcerpt(post)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatNewsDateTime(post.published_at ?? post.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(post)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                            aria-label={`Editar ${post.title}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void removePost(post)}
                            disabled={deletingId === post.id}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-60 shadow-sm"
                            aria-label={`Eliminar ${post.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#0B3C78]">
                {editingId ? "Edición" : "Nuevo contenido"}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {editingId ? "Modificar publicación" : "Crear publicación"}
              </h3>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {editingId ? "Actualización" : "Alta"}
            </span>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Título</span>
              <input
                value={draft.title}
                onChange={(e) => {
                  const value = e.target.value
                  setDraft((current) => ({
                    ...current,
                    title: value,
                    slug: slugAuto ? slugify(value) : current.slug,
                  }))
                }}
                type="text"
                placeholder="Título de la noticia"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Slug</span>
              <input
                value={draft.slug}
                onChange={(e) => {
                  setSlugAuto(false)
                  setDraft((current) => ({ ...current, slug: slugify(e.target.value) }))
                }}
                type="text"
                placeholder="slug-de-la-noticia"
                className={inputClass}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Categoría</span>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((current) => ({ ...current, category: e.target.value }))}
                  className={inputClass}
                >
                  {NEWS_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Estado</span>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft((current) => ({ ...current, status: e.target.value as NewsStatus }))}
                  className={inputClass}
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Autor</span>
              <input
                value={draft.author_name}
                onChange={(e) => setDraft((current) => ({ ...current, author_name: e.target.value }))}
                type="text"
                placeholder="SIDEAS Consultores"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Resumen</span>
              <textarea
                value={draft.excerpt}
                onChange={(e) => setDraft((current) => ({ ...current, excerpt: e.target.value }))}
                rows={3}
                placeholder="Resumen corto que se ve en cards y previews"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Portada</span>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#0B3C78]">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">URL de imagen</p>
                    <p className="text-xs text-slate-500">Si no cargás una URL, se usa una portada por defecto.</p>
                  </div>
                </div>
                <input
                  value={draft.cover_image_url}
                  onChange={(e) => setDraft((current) => ({ ...current, cover_image_url: e.target.value }))}
                  type="url"
                  placeholder={NEWS_DEFAULT_COVER}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Fecha de publicación</span>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={draft.published_at}
                  onChange={(e) => setDraft((current) => ({ ...current, published_at: e.target.value }))}
                  type="datetime-local"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none shadow-sm focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Contenido</span>
              <textarea
                value={draft.content}
                onChange={(e) => setDraft((current) => ({ ...current, content: e.target.value }))}
                rows={12}
                placeholder="Contenido completo de la noticia o blog"
                className="w-full rounded-[28px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none shadow-sm placeholder:text-slate-400 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => void savePost("draft")}
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
              >
                <Save className="h-4 w-4" />
                Guardar borrador
              </button>
              <button
                type="button"
                onClick={() => void savePost("published")}
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                Publicar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
