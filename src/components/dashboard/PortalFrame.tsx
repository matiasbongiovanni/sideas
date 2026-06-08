"use client"

import { useEffect, useRef, useState } from "react"

const LOAD_TIMEOUT_MS = 20_000

type Props = {
  src: string
  title: string
}

export function PortalFrame({ src, title }: Props) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (status === "loading") setStatus("error")
    }, LOAD_TIMEOUT_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [status])

  function handleLoad() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus("ready")
  }

  function handleError() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus("error")
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white relative">
      {/* Spinner de carga */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-[#4398FF] animate-spin" />
          <p className="text-sm text-slate-500">Cargando portal...</p>
        </div>
      )}

      {/* Fallback — upstream caído */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 gap-4 p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div className="text-center">
            <p className="font-semibold text-slate-700 text-lg">Portal en mantenimiento</p>
            <p className="text-sm text-slate-500 mt-1">
              Estamos trabajando para restablecerlo. Por favor, intentá más tarde.
            </p>
          </div>
          <button
            onClick={() => {
              setStatus("loading")
              if (iframeRef.current) iframeRef.current.src = src
            }}
            className="mt-2 rounded-xl bg-[#0B3C78] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4398FF] transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="w-full h-full border-none"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: status === "error" ? "none" : "block" }}
      />
    </div>
  )
}
