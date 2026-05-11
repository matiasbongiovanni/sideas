"use client"

import { useState, useEffect, useActionState } from "react"
import Image from "next/image"
import Link from "next/link"
import { login } from "@/lib/supabase/actions"

// Reutilizamos las imágenes de servicios para el slider derecho
const slideImages = [
  { src: "/servicios/servidores2.webp", alt: "Infraestructura y Servidores" },
  { src: "/servicios/ciberseguridad.webp", alt: "Ciberseguridad Avanzada" },
  { src: "/servicios/datacenter.webp", alt: "Data Centers" },
  { src: "/servicios/cloud.webp", alt: "Soluciones Cloud" }
]

const initialState = { error: null as string | null }

export default function Login() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [state, formAction, pending] = useActionState(login, initialState)

  // Lógica del slider automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length)
    }, 5000) // Cambia cada 5 segundos
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen w-full flex bg-white">

      {/* Columna Izquierda - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex flex-col relative px-8 sm:px-16 lg:px-24 py-12">

        {/* Logo SIDEAS */}
        <div className="mb-auto">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/sideas_azul.png" alt="Logo SIDEAS" width={200} height={200} />
          </Link>
        </div>

        {/* Contenedor del Formulario */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Accedé a tu espacio SIDEAS
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Ingresá para supervisar el estado y rendimiento de tu infraestructura en tiempo real.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email@ejemplo.com"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10 placeholder:text-slate-400 shadow-sm shadow-slate-100"
              />
            </div>

            {/* Input Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Tu contraseña"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-[#4398FF] focus:ring-4 focus:ring-[#4398FF]/10 placeholder:text-slate-400 shadow-sm shadow-slate-100"
              />

              <div className="flex justify-end pt-1">
                <Link
                  href="/recuperar-contraseña"
                  className="text-xs font-medium text-slate-500 underline decoration-slate-300 hover:text-[#4398FF] hover:decoration-[#4398FF] transition-colors"
                >
                  Olvidé mi contraseña
                </Link>
              </div>
            </div>

            {/* Error message */}
            {state?.error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs font-medium text-red-600">{state.error}</p>
              </div>
            )}

            {/* Botón Iniciar Sesión */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0B3C78] px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#4398FF] hover:shadow-lg hover:shadow-[#4398FF]/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-auto pt-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SIDEAS Consultores. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Columna Derecha - Slider de Imágenes */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
        {/* Elemento decorativo de marca (Glow) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4398FF]/20 blur-[150px] rounded-full z-10 pointer-events-none" />

        {/* Contenedor del Slider */}
        {slideImages.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
              }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover transition-transform duration-[10000ms] ease-linear scale-105"
              style={{ transform: idx === currentSlide ? 'scale(1.1)' : 'scale(1.05)' }}
              priority={idx === 0}
            />
            {/* Overlay oscuro para darle tono corporativo */}
            <div className="absolute inset-0 bg-slate-900/40" />
          </div>
        ))}

        {/* Opcional: Indicadores del slider (Dots) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slideImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? "w-8 bg-[#4398FF]" : "w-2 bg-white/40"
                }`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}