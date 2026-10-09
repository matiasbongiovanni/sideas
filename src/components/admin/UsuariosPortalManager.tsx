"use client"

import { useCallback, useState } from "react"
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Copy,
  Key,
  Plus,
  Power,
  RefreshCw,
  Server,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react"

type PortalEndpointType = "inventario" | "zabbix"
type PortalAuthMode = "per_user" | "shared" | "none"

type PortalUser = {
  user_id: string
  username: string
  full_name: string
  created_at: string
  email: string
}

type PortalEndpoint = {
  id: string
  type: PortalEndpointType
  label: string
  base_url: string
  auth_mode: PortalAuthMode
  enabled: boolean
  sort: number
  created_at: string
  has_shared_credential: boolean
}

type PortalClient = {
  id: string
  name: string
  slug: string
  created_at: string
  endpoints: PortalEndpoint[]
  users: PortalUser[]
}

const ENDPOINT_TYPE_LABELS: Record<PortalEndpointType, string> = {
  inventario: "Inventario (IMS)",
  zabbix: "Monitoreo Zabbix",
}

const AUTH_MODE_LABELS: Record<PortalAuthMode, string> = {
  per_user: "Por usuario",
  shared: "Compartida",
  none: "Sin auth",
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body?.error ?? "Error inesperado")
  }
  return body as T
}

function GeneratedCredentialModal({
  title,
  username,
  password,
  onClose,
}: {
  title: string
  username: string
  password: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${username} / ${password}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // noop — el usuario puede copiar a mano
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 ring-1 ring-amber-200">
          Guardá este password ahora — no se vuelve a mostrar.
        </p>
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Usuario</p>
            <p className="font-mono text-sm text-slate-900">{username}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Password</p>
            <p className="font-mono text-sm text-slate-900">{password}</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B3C78] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copiado" : "Copiar usuario y password"}
        </button>
      </div>
    </div>
  )
}

function NewClientForm({ onCreated }: { onCreated: (client: PortalClient) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const client = await apiFetch<{ id: string; name: string; slug: string; created_at: string }>(
        "/api/admin/usuarios/clientes",
        { method: "POST", body: JSON.stringify({ name, slug: slug || undefined }) }
      )
      onCreated({ ...client, endpoints: [], users: [] })
      setOpen(false)
      setName("")
      setSlug("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C78] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
      >
        <Plus className="h-4 w-4" />
        Nuevo cliente
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Nuevo cliente de portal</h3>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-500">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingenia SA — Jesús María"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Slug (opcional)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="se autogenera del nombre"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={saving || !name.trim()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B3C78] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
      >
        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Crear cliente
      </button>
    </div>
  )
}

function NewEndpointForm({
  clientId,
  onCreated,
  onCancel,
}: {
  clientId: string
  onCreated: (endpoint: PortalEndpoint) => void
  onCancel: () => void
}) {
  const [type, setType] = useState<PortalEndpointType>("inventario")
  const [label, setLabel] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [authMode, setAuthMode] = useState<PortalAuthMode>("per_user")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const endpoint = await apiFetch<PortalEndpoint>("/api/admin/usuarios/endpoints", {
        method: "POST",
        body: JSON.stringify({ clientId, type, label, baseUrl, authMode }),
      })
      onCreated({ ...endpoint, has_shared_credential: false })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-500">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PortalEndpointType)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="inventario">Inventario (IMS)</option>
            <option value="zabbix">Monitoreo Zabbix</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Auth mode</label>
          <select
            value={authMode}
            onChange={(e) => setAuthMode(e.target.value as PortalAuthMode)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="per_user">Por usuario</option>
            <option value="shared">Compartida</option>
            <option value="none">Sin auth</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Inventario"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Base URL</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://ims.sideasconsultores.com.ar"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          disabled={saving || !label.trim() || !baseUrl.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0B3C78] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Agregar endpoint
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

function NewUserForm({
  clientId,
  onCreated,
  onCancel,
}: {
  clientId: string
  onCreated: (user: PortalUser, generatedPassword: string) => void
  onCancel: () => void
}) {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [autoPassword, setAutoPassword] = useState(true)
  const [manualPassword, setManualPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const result = await apiFetch<{
        user_id: string
        username: string
        full_name: string
        email: string
        password: string
      }>("/api/admin/usuarios/usuarios", {
        method: "POST",
        body: JSON.stringify({
          clientId,
          username,
          fullName,
          password: autoPassword ? undefined : manualPassword,
        }),
      })
      onCreated(
        {
          user_id: result.user_id,
          username: result.username,
          full_name: result.full_name,
          email: result.email,
          created_at: new Date().toISOString(),
        },
        result.password
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-500">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="cmaria"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Nombre completo</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Carlos María"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          id="auto-password"
          type="checkbox"
          checked={autoPassword}
          onChange={(e) => setAutoPassword(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        <label htmlFor="auto-password" className="text-xs font-medium text-slate-600">
          Generar password automático (recomendado)
        </label>
      </div>
      {!autoPassword && (
        <input
          value={manualPassword}
          onChange={(e) => setManualPassword(e.target.value)}
          placeholder="Password manual (mín. 8 caracteres)"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          disabled={saving || !username.trim() || !fullName.trim() || (!autoPassword && manualPassword.length < 8)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0B3C78] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          Crear usuario
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

function SharedCredentialForm({
  endpointId,
  onSaved,
  onCancel,
}: {
  endpointId: string
  onSaved: () => void
  onCancel: () => void
}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      await apiFetch("/api/admin/usuarios/credenciales", {
        method: "POST",
        body: JSON.stringify({ endpointId, username, password }),
      })
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario upstream"
          className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password upstream"
          type="password"
          className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={submit}
          disabled={saving || !username.trim() || !password.trim()}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          Guardar credencial
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

function ClientCard({
  client,
  onUpdate,
}: {
  client: PortalClient
  onUpdate: (clientId: string, updater: (c: PortalClient) => PortalClient) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [addingEndpoint, setAddingEndpoint] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [credEndpointId, setCredEndpointId] = useState<string | null>(null)
  const [generated, setGenerated] = useState<{ title: string; username: string; password: string } | null>(null)
  const [busyUserId, setBusyUserId] = useState<string | null>(null)

  const toggleEndpointEnabled = async (endpoint: PortalEndpoint) => {
    setBusyUserId(endpoint.id)
    try {
      await apiFetch("/api/admin/usuarios/endpoints", {
        method: "PATCH",
        body: JSON.stringify({ endpointId: endpoint.id, enabled: !endpoint.enabled }),
      })
      onUpdate(client.id, (c) => ({
        ...c,
        endpoints: c.endpoints.map((ep) => (ep.id === endpoint.id ? { ...ep, enabled: !ep.enabled } : ep)),
      }))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setBusyUserId(null)
    }
  }

  const resetPassword = async (user: PortalUser) => {
    if (!confirm(`¿Resetear password de ${user.username}?`)) return
    setBusyUserId(user.user_id)
    try {
      const result = await apiFetch<{ password: string }>(
        `/api/admin/usuarios/usuarios/${user.user_id}/password`,
        { method: "POST", body: JSON.stringify({}) }
      )
      setGenerated({ title: `Password reseteado — ${user.username}`, username: user.username, password: result.password })
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setBusyUserId(null)
    }
  }

  const deleteUser = async (user: PortalUser) => {
    if (!confirm(`¿Eliminar definitivamente el usuario ${user.username}? Esta acción no se puede deshacer.`)) return
    setBusyUserId(user.user_id)
    try {
      await apiFetch(`/api/admin/usuarios/usuarios?userId=${user.user_id}`, { method: "DELETE" })
      onUpdate(client.id, (c) => ({ ...c, users: c.users.filter((u) => u.user_id !== user.user_id) }))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error inesperado")
    } finally {
      setBusyUserId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B3C78]/10 text-[#0B3C78]">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{client.name}</p>
            <p className="text-xs text-slate-400">
              {client.slug} · {client.users.length} usuario{client.users.length === 1 ? "" : "s"} ·{" "}
              {client.endpoints.length} endpoint{client.endpoints.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Server className="h-3.5 w-3.5" /> Endpoints
              </h4>
              {!addingEndpoint && (
                <button
                  onClick={() => setAddingEndpoint(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3C78] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Agregar
                </button>
              )}
            </div>

            <div className="mt-2 space-y-2">
              {client.endpoints.map((ep) => (
                <div key={ep.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ENDPOINT_TYPE_LABELS[ep.type]}</p>
                      <p className="text-xs text-slate-400">
                        {ep.base_url} · {AUTH_MODE_LABELS[ep.auth_mode]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          ep.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {ep.enabled ? "Activo" : "Inactivo"}
                      </span>
                      <button
                        onClick={() => toggleEndpointEnabled(ep)}
                        disabled={busyUserId === ep.id}
                        title={ep.enabled ? "Desactivar" : "Activar"}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {ep.auth_mode === "shared" && (
                    <div className="mt-2">
                      {ep.has_shared_credential ? (
                        <p className="text-xs text-emerald-700">✓ Credencial compartida configurada</p>
                      ) : credEndpointId === ep.id ? (
                        <SharedCredentialForm
                          endpointId={ep.id}
                          onCancel={() => setCredEndpointId(null)}
                          onSaved={() => {
                            setCredEndpointId(null)
                            onUpdate(client.id, (c) => ({
                              ...c,
                              endpoints: c.endpoints.map((e2) =>
                                e2.id === ep.id ? { ...e2, has_shared_credential: true } : e2
                              ),
                            }))
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => setCredEndpointId(ep.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
                        >
                          <Key className="h-3.5 w-3.5" /> Configurar credencial compartida
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {client.endpoints.length === 0 && !addingEndpoint && (
                <p className="text-xs text-slate-400">Sin endpoints todavía.</p>
              )}
              {addingEndpoint && (
                <NewEndpointForm
                  clientId={client.id}
                  onCancel={() => setAddingEndpoint(false)}
                  onCreated={(ep) => {
                    setAddingEndpoint(false)
                    onUpdate(client.id, (c) => ({ ...c, endpoints: [...c.endpoints, ep] }))
                  }}
                />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <User className="h-3.5 w-3.5" /> Usuarios
              </h4>
              {!addingUser && (
                <button
                  onClick={() => setAddingUser(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3C78] hover:underline"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Nuevo usuario
                </button>
              )}
            </div>

            <div className="mt-2 space-y-2">
              {client.users.map((u) => (
                <div key={u.user_id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{u.full_name}</p>
                    <p className="text-xs text-slate-400">
                      {u.username} · {u.email} · alta {formatDate(u.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => resetPassword(u)}
                      disabled={busyUserId === u.user_id}
                      title="Resetear password"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <Key className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      disabled={busyUserId === u.user_id}
                      title="Eliminar usuario"
                      className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {client.users.length === 0 && !addingUser && (
                <p className="text-xs text-slate-400">Sin usuarios todavía.</p>
              )}
              {addingUser && (
                <NewUserForm
                  clientId={client.id}
                  onCancel={() => setAddingUser(false)}
                  onCreated={(user, generatedPassword) => {
                    setAddingUser(false)
                    onUpdate(client.id, (c) => ({ ...c, users: [...c.users, user] }))
                    setGenerated({ title: `Usuario creado — ${user.username}`, username: user.username, password: generatedPassword })
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {generated && (
        <GeneratedCredentialModal
          title={generated.title}
          username={generated.username}
          password={generated.password}
          onClose={() => setGenerated(null)}
        />
      )}
    </div>
  )
}

export default function UsuariosPortalManager({ initialClients }: { initialClients: PortalClient[] }) {
  const [clients, setClients] = useState(initialClients)

  const updateClient = useCallback((clientId: string, updater: (c: PortalClient) => PortalClient) => {
    setClients((prev) => prev.map((c) => (c.id === clientId ? updater(c) : c)))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Usuarios del Portal</h2>
          <p className="text-sm text-slate-500">Alta de clientes, endpoints (inventario/Zabbix) y usuarios de acceso.</p>
        </div>
        <NewClientForm onCreated={(client) => setClients((prev) => [client, ...prev])} />
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} onUpdate={updateClient} />
        ))}
        {clients.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
            Todavía no hay clientes de portal. Creá el primero arriba.
          </p>
        )}
      </div>
    </div>
  )
}
