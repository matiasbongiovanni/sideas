"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { loginParaRuta } from "@/lib/mfa"

type Props = { modo: "configurar" | "verificar"; next: string }

type Alta = { factorId: string; qr: string; secret: string }

export default function Pantalla2FA({ modo, next }: Props) {
  const supabaseRef = useRef(createClient())
  const iniciado = useRef(false)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [alta, setAlta] = useState<Alta | null>(null)
  const [codigo, setCodigo] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    // StrictMode monta dos veces: un solo enroll por visita
    if (iniciado.current) return
    iniciado.current = true
    const supabase = supabaseRef.current

    ;(async () => {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) {
        setError("No pudimos cargar tu verificación en dos pasos. Recargá la página.")
        setCargando(false)
        return
      }
      const verificado = data.totp.find((f) => f.status === "verified")

      if (modo === "verificar") {
        if (!verificado) return irA("configurar")
        setFactorId(verificado.id)
        setCargando(false)
        return
      }

      if (verificado) return irA("verificar")
      // Limpia altas a medio terminar (QR escaneado y nunca confirmado)
      for (const f of data.all.filter((f) => f.factor_type === "totp" && f.status === "unverified")) {
        await supabase.auth.mfa.unenroll({ factorId: f.id })
      }
      const { data: enroll, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `SIDEAS ${new Date().toISOString()}`,
        issuer: "SIDEAS Consultores",
      })
      if (enrollError || !enroll) {
        setError("No pudimos generar el código QR. Recargá la página.")
        setCargando(false)
        return
      }
      setFactorId(enroll.id)
      setAlta({ factorId: enroll.id, qr: enroll.totp.qr_code, secret: enroll.totp.secret })
      setCargando(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function irA(destino: "configurar" | "verificar") {
    window.location.replace(`/2fa/${destino}?next=${encodeURIComponent(next)}`)
  }

  async function confirmar(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    setEnviando(true)
    setError(null)
    const { error } = await supabaseRef.current.auth.mfa.challengeAndVerify({ factorId, code: codigo.trim() })
    if (error) {
      setError("Código incorrecto o vencido. Probá con el código actual de tu app.")
      setCodigo("")
      setEnviando(false)
      return
    }
    // Recarga completa para que el proxy lea la sesión AAL2 nueva
    window.location.replace(next)
  }

  async function salir() {
    await supabaseRef.current.auth.signOut()
    window.location.replace(loginParaRuta(next))
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Image src="/sideas_azul.png" alt="Logo SIDEAS" width={140} height={140} className="mb-8" />

        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#4398FF]">Verificación en dos pasos</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {modo === "configurar" ? "Protegé tu cuenta" : "Ingresá tu código"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {modo === "configurar"
            ? "Escaneá el código QR con Google Authenticator, Microsoft Authenticator o similar, y escribí el código de 6 dígitos que te muestra la app."
            : "Abrí tu app autenticadora y escribí el código de 6 dígitos de SIDEAS Consultores."}
        </p>

        {cargando && <p className="mt-8 text-sm text-slate-400">Cargando…</p>}

        {alta && (
          <div className="mt-6 flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={alta.qr} alt="Código QR para la app autenticadora" width={192} height={192} className="rounded-xl border border-slate-200 p-2" />
            <details className="w-full text-center text-xs text-slate-500">
              <summary className="cursor-pointer">¿No podés escanear? Cargá la clave a mano</summary>
              <p className="mt-2 break-all font-mono text-slate-900">{alta.secret}</p>
            </details>
          </div>
        )}

        {!cargando && factorId && (
          <form onSubmit={confirmar} className="mt-6 space-y-4">
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="000000"
              aria-label="Código de 6 dígitos"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-center font-mono text-2xl tracking-[0.5em] text-slate-900 outline-none transition-all focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10"
            />
            <button
              type="submit"
              disabled={enviando || codigo.length !== 6}
              className="w-full rounded-2xl bg-[#0B3C78] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#08305f] disabled:opacity-50"
            >
              {enviando ? "Verificando…" : modo === "configurar" ? "Activar y continuar" : "Verificar"}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {modo === "verificar" && !cargando && (
          <p className="mt-6 text-xs text-slate-400">
            ¿Perdiste el acceso a tu app? Pedile a SIDEAS que te resetee la verificación en dos pasos.
          </p>
        )}

        <button onClick={salir} className="mt-6 text-sm font-medium text-slate-500 underline-offset-4 hover:underline">
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
