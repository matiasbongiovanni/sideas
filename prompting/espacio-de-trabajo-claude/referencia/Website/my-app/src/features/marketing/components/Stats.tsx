"use client"

import { useEffect, useRef, useState } from "react"

interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

const stats: Stat[] = [
  { value: 2020, label: "Año de fundación" },
  { value: 15, prefix: "+", label: "Clientes activos" },
  { value: 24, suffix: "/7", label: "Soporte disponible" },
  { value: 12, label: "Servicios IT" },
]

function useCounter(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, active])

  return count
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCounter(stat.value, 1500, active)
  return (
    <div className="text-center p-8 rounded-2xl border bg-white/5 backdrop-blur-sm transition-all hover:-translate-y-1" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      <p className="text-4xl font-bold mb-2" style={{ color: "#4398FF" }}>
        {stat.prefix}{count}{stat.suffix}
      </p>
      <p className="text-sm" style={{ color: "#94a3b8" }}>{stat.label}</p>
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0F172A 50%, #112240 100%)" }}>
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[120px]" style={{ background: "rgba(8,80,160,0.08)" }} />
      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-6" style={{ borderColor: "rgba(67,152,255,0.3)", background: "rgba(67,152,255,0.1)" }}>
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#4398FF" }}>Números que nos definen</span>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            SIDEAS en cifras
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
