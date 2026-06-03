"use client"

import { useActionState } from "react"
import { adminLogin } from "@/lib/supabase/actions"

const initialState = { error: null as string | null }

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@sideasconsultores.com.ar"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-200">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
        />
      </div>

      {state?.error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Verificando..." : "Ingresar al panel"}
      </button>
    </form>
  )
}

