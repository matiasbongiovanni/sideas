"use client"
import { useState } from "react"
import { faq } from "@/data/faq"

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null)

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id))

  return (
    <section className="relative py-24 bg-white overflow-hidden border-t border-slate-100">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-[600px] h-[600px] bg-[#4398FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header Sincronizado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0B3C78]/20 bg-[#0B3C78]/5 px-4 py-1.5 mb-6 transition-colors hover:bg-[#0B3C78]/10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0B3C78]">FAQ</span>
          </div>

          <h2 className="text-3xl font-light sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Preguntas <span className="font-bold">frecuentes</span>
          </h2>

          <p className="text-base md:text-lg max-w-xl mx-auto text-slate-500 leading-relaxed">
            Resolvemos las dudas más comunes sobre nuestros servicios y procesos de trabajo.
          </p>
        </div>

        {/* Acordeón (FAQ Items) */}
        <div className="space-y-4">
          {faq.map((item) => {
            const isOpen = open === item.id
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 ease-out overflow-hidden ${isOpen
                  ? "border-[#4398FF]/50 bg-slate-50 shadow-md shadow-[#4398FF]/5"
                  : "border-slate-200 bg-white hover:border-[#4398FF]/30 hover:shadow-sm"
                  }`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base font-bold transition-colors ${isOpen ? "text-[#0B3C78]" : "text-slate-900"}`}>
                    {item.question}
                  </span>
                  <div className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-colors ${isOpen ? "bg-[#4398FF]/10 text-[#4398FF]" : "bg-slate-100 text-slate-400"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 text-base leading-relaxed text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}