"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulamos la llamada a la API con un pequeño delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 p-6"
      style={{
        background: "linear-gradient(135deg, #020617 0%, #0F172A 50%, #0B3C78 100%)",
      }}
    >
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full blur-[120px] opacity-40 animate-pulse" style={{ background: "#0B3C78" }} />
        <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full blur-[100px] opacity-30 animate-pulse" style={{ background: "#4398FF", animationDelay: "2s" }} />
      </div>

      {/* Logo SIDEAS (Opcional, flotando arriba) */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          {/* Asegurate de tener el logo en public/ */}
          {/* <Image src="/Sideas_Blanco.png" alt="SIDEAS" width={120} height={35} /> */}
          <span className="text-xl font-bold text-white tracking-widest">SIDEAS<span className="text-[#4398FF]">.</span></span>
        </Link>
      </div>

      {/* Contenedor Glassmorphism de Recuperación */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">

          {!isSuccess ? (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#0B3C78] to-[#4398FF] shadow-lg shadow-[#4398FF]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Recuperar acceso
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Ingresá el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3.5 pl-11 text-sm text-white transition-colors focus:border-[#4398FF] focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#4398FF] placeholder:text-slate-500"
                      placeholder="tu@empresa.com"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[#4398FF]/25 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <>
                      Enviar enlace de recuperación
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Estado de Éxito */
            <div className="animate-in fade-in zoom-in duration-500 text-center py-6">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">¡Correo enviado!</h2>
              <p className="mb-8 text-sm text-slate-400 leading-relaxed">
                Hemos enviado las instrucciones de recuperación a <span className="font-bold text-white">{email}</span>. Por favor, revisá tu bandeja de entrada o carpeta de spam.
              </p>

              <button
                onClick={() => setIsSuccess(false)}
                className="text-sm font-medium text-[#4398FF] hover:text-white transition-colors"
              >
                Intentar con otro correo
              </button>
            </div>
          )}
        </div>

        {/* Enlace para volver atrás */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  );
}