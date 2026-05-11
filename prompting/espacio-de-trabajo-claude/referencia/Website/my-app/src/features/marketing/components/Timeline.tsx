"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

const milestones = [
    { year: "2020", text: "Nacemos como consultora IT" },
    { year: "2022", text: "Expansión en infraestructura y sistemas" },
    { year: "2024", text: "+ 15 clientes activos" },
    { year: "2026", text: "Soluciones integrales a medida" },
]

const servicios = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
        ),
        title: "Infraestructura",
        subtitle: "& Soporte IT",
        description: "Administración de servidores, Data Centers locales e híbridos, migraciones y soporte técnico con cobertura 24/7.",
        image: "/servicios/servidores2.webp"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: "Redes",
        subtitle: "& Ciberseguridad",
        description: "Optimización de conectividad y protección de datos mediante Firewalls, VPNs seguras y soluciones antivirus centralizadas.",
        image: "/servicios/ciberseguridad.webp"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.75 3.75 0 0118 19.5H6.75z" />
            </svg>
        ),
        title: "Resguardo",
        subtitle: "& Monitoreo",
        description: "Backups automáticos locales y en la nube. Monitoreo de recursos en tiempo real para prevenir fallas operativas.",
        image: "/servicios/datacenter.webp"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.432-4.132-7.028-7.028l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
        ),
        title: "Comunicaciones",
        subtitle: "& Plataformas",
        description: "Gestión de Telefonía IP, VoIP y despliegue de plataformas colaborativas y de identidad digital empresariales.",
        image: "/servicios/backups.webp"
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        title: "Innovación",
        subtitle: "& Automatización",
        description: "Integración de IA para optimizar procesos y desarrollo de sistemas a medida para la gestión de incidentes.",
        image: "/servicios/cloud.webp"
    }
]

export default function Timeline() {
    const [currentService, setCurrentService] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const duration = 6000 // Aumenté un poco a 6s para mejor lectura
    const sliderRef = useRef<HTMLDivElement>(null)

    const nextSlide = useCallback(() => {
        setCurrentService((prev) => (prev + 1) % servicios.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentService((prev) => (prev - 1 + servicios.length) % servicios.length)
    }, [])

    useEffect(() => {
        if (isPaused) return
        const interval = setInterval(nextSlide, duration)
        return () => clearInterval(interval)
    }, [isPaused, nextSlide])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevSlide()
            if (e.key === "ArrowRight") nextSlide()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [nextSlide, prevSlide])

    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setTouchEnd(null)
        setTouchStart("targetTouches" in e ? e.targetTouches[0].clientX : e.clientX)
    }
    const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        setTouchEnd("targetTouches" in e ? e.targetTouches[0].clientX : e.clientX)
    }
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        if (distance > minSwipeDistance) nextSlide()
        if (distance < -minSwipeDistance) prevSlide()
    }

    const service = servicios[currentService]

    return (
        <section id="proceso" className="relative bg-slate-900 py-16 lg:py-24 overflow-hidden border-t border-slate-800">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left – Timeline */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-12">
                            <h2 className="text-sm font-bold tracking-widest text-[#4398FF] uppercase mb-2">Evolución Corporativa</h2>
                            <h3 className="text-3xl lg:text-4xl font-light text-white">
                                Nuestra <span className="font-bold">Trayectoria</span>
                            </h3>
                        </div>

                        <div className="relative">
                            {/* Línea vertical con gradiente corporativo */}
                            <div className="absolute left-[9px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#4398FF] via-[#0B3C78] to-transparent rounded-full" />

                            <div className="space-y-8">
                                {milestones.map((m, i) => (
                                    <div key={i} className="relative pl-12 group cursor-default">
                                        {/* Dot animado */}
                                        <div
                                            className="absolute left-0 top-2 h-5 w-5 rounded-full border-[3px] border-slate-900 bg-[#4398FF] transition-all duration-300 group-hover:scale-125"
                                            style={{
                                                opacity: i <= milestones.length - 1 ? 1 : 0.3,
                                                boxShadow: "0 0 12px rgba(67,152,255,0.4)"
                                            }}
                                        />
                                        <div className="bg-slate-800/20 hover:bg-slate-800/40 border border-transparent hover:border-slate-700/50 p-4 rounded-2xl transition-all duration-300 transform group-hover:translate-x-1">
                                            <p className="text-3xl font-bold text-[#4398FF]">
                                                {m.year}
                                            </p>
                                            <p className="text-base mt-1 text-slate-300 font-medium">
                                                {m.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right – Featured service Slider */}
                    <div className="flex flex-col">
                        <div className="mb-6 hidden lg:block">
                            <h2 className="text-sm font-bold tracking-widest text-[#4398FF] uppercase mb-2">Áreas de Experiencia</h2>
                            <h3 className="text-3xl font-light text-white">
                                Soluciones <span className="font-bold">Destacadas</span>
                            </h3>
                        </div>

                        <div
                            ref={sliderRef}
                            className="group relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] xl:aspect-square max-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 cursor-grab active:cursor-grabbing focus:outline-none"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => {
                                setIsPaused(false)
                                setTouchStart(null)
                                setTouchEnd(null)
                            }}
                            onMouseDown={onTouchStart}
                            onMouseMove={(e) => touchStart && onTouchMove(e)}
                            onMouseUp={onTouchEnd}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            tabIndex={0}
                            aria-label="Slider de servicios"
                        >
                            {/* Imágenes */}
                            {servicios.map((s, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${idx === currentService ? "opacity-100" : "opacity-0"}`}
                                >
                                    <Image
                                        src={s.image}
                                        alt={s.title}
                                        fill
                                        className="object-cover transition-transform duration-[10000ms] ease-linear scale-105"
                                        style={{ transform: idx === currentService ? 'scale(1.1)' : 'scale(1.05)' }} // Efecto Ken Burns sutil
                                        priority={idx === 0}
                                        draggable="false"
                                    />
                                    {/* Overlay mejorado: Oscuridad general + Gradiente fuerte abajo para texto */}
                                    <div className="absolute inset-0 bg-slate-900/30" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                                </div>
                            ))}

                            {/* Contenido (Textos) */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 z-10 pointer-events-none select-none">
                                <div key={currentService} className="transition-all duration-500">
                                    <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-6 bg-white/10 backdrop-blur-md border border-white/20 text-[#4398FF] shadow-lg">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white tracking-wide mb-1 drop-shadow-md">
                                        {service.title} <span className="text-[#4398FF] font-light">{service.subtitle}</span>
                                    </h3>
                                    <p className="text-base text-slate-300 max-w-md drop-shadow leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            {/* Controles de Navegación Desktop (Aparecen on hover) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-[#4398FF] backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hidden sm:flex"
                                aria-label="Anterior"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-[#4398FF] backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hidden sm:flex"
                                aria-label="Siguiente"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>

                            {/* Indicadores (Dots) y Barra de progreso */}
                            <div className="absolute top-0 left-0 right-0 z-20 flex flex-col">
                                {/* Barra de Progreso Superior */}
                                <div className="w-full h-1 bg-white/10">
                                    <div
                                        className="h-full bg-[#4398FF]"
                                        style={{
                                            width: isPaused ? "100%" : "0%",
                                            animation: isPaused ? 'none' : `progress ${duration}ms linear infinite`,
                                        }}
                                        key={`bar-${currentService}-${isPaused}`}
                                    >
                                        <style jsx>{`
                                            @keyframes progress {
                                                0% { width: 0%; }
                                                100% { width: 100%; }
                                            }
                                        `}</style>
                                    </div>
                                </div>

                                {/* Dots en la parte superior derecha */}
                                <div className="flex gap-2 justify-end p-6">
                                    {servicios.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setCurrentService(index)
                                            }}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentService ? "w-8 bg-[#4398FF]" : "w-2 bg-white/40 hover:bg-white/70"}`}
                                            aria-label={`Ir a servicio ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}