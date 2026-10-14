"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

type DemoId = "zabbix" | "inventario" | "ticketera"
const DEMOS: DemoId[] = ["zabbix", "inventario", "ticketera"]

const src = (id: DemoId, tipo: "loop" | "full", ext: "mp4" | "webm") => `/videos/${id}-${tipo}.${ext}`

// Loop mudo: no descarga nada hasta que la tarjeta entra en pantalla, y se pausa al salir.
// Con prefers-reduced-motion nunca se carga: queda solo el poster.
function LoopVideo({ id, label }: { id: DemoId; label: string }) {
    const ref = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = ref.current
        if (!video) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const fuente = video.canPlayType("video/webm") ? src(id, "loop", "webm") : src(id, "loop", "mp4")
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!video.getAttribute("src")) video.src = fuente
                    video.play().catch(() => {})
                } else video.pause()
            },
            { threshold: 0.35 }
        )
        obs.observe(video)
        return () => obs.disconnect()
    }, [id])

    return (
        <video
            ref={ref}
            className="aspect-video w-full object-cover"
            poster={`/videos/${id}-poster.jpg`}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
        />
    )
}

function VideoModal({ id, titulo, onClose, cerrarLabel }: { id: DemoId | null; titulo: string; onClose: () => void; cerrarLabel: string }) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (id && !dialog.open) {
            dialog.showModal()
            videoRef.current?.play().catch(() => {})
        }
        if (!id && dialog.open) dialog.close()
    }, [id])

    const cerrar = () => {
        videoRef.current?.pause()
        onClose()
    }

    return (
        <dialog
            ref={dialogRef}
            onClose={cerrar}
            onClick={(e) => e.target === dialogRef.current && cerrar()}
            aria-label={titulo}
            className="m-auto w-[min(1100px,94vw)] rounded-3xl bg-transparent p-0 backdrop:bg-slate-950/85 backdrop:backdrop-blur-sm"
        >
            {id && (
                <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900 shadow-2xl">
                    <button
                        type="button"
                        onClick={cerrar}
                        className="absolute right-3 top-3 z-10 rounded-full bg-slate-950/70 p-2 text-white transition-colors hover:bg-slate-800"
                        aria-label={cerrarLabel}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <video ref={videoRef} key={id} className="aspect-video w-full bg-black" controls playsInline preload="none" poster={`/videos/${id}-poster.jpg`}>
                        <source src={src(id, "full", "webm")} type="video/webm" />
                        <source src={src(id, "full", "mp4")} type="video/mp4" />
                    </video>
                </div>
            )}
        </dialog>
    )
}

export default function DemosVideos() {
    const t = useTranslations("HomePage.demos")
    const [abierto, setAbierto] = useState<DemoId | null>(null)

    return (
        <section id="demos" className="relative scroll-mt-24 overflow-hidden py-24" style={{ background: "#0F172A" }}>
            <div className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full blur-[120px] opacity-30" style={{ background: "#0B3C78" }} />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4398FF]/30 bg-[#4398FF]/10 px-4 py-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#4398FF]">{t("badge")}</span>
                    </div>
                    <h2 className="text-4xl font-light tracking-tight text-white lg:text-5xl">
                        {t("titlePrefix")} <span className="font-bold">{t("titleBold")}</span>
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">{t("subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {DEMOS.map((id) => (
                        <article
                            key={id}
                            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/60 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#4398FF]/40"
                        >
                            <button
                                type="button"
                                onClick={() => setAbierto(id)}
                                className="relative block text-left"
                                aria-label={`${t("verVideo")}: ${t(`${id}Kicker`)}`}
                            >
                                <LoopVideo id={id} label={t(`${id}Title`)} />
                                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-colors group-hover:bg-slate-950/30">
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#0B3C78] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                </span>
                            </button>
                            <div className="flex flex-1 flex-col p-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-[#4398FF]">{t(`${id}Kicker`)}</p>
                                <h3 className="mt-2 text-xl font-bold text-white">{t(`${id}Title`)}</h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{t(`${id}Text`)}</p>
                                <div className="mt-5 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setAbierto(id)}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-[#4398FF]"
                                    >
                                        {t("verVideo")}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">{t("disclaimer")}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <a
                        href="#contacto"
                        className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#4398FF]/20 transition-all duration-300 hover:scale-105"
                    >
                        {t("ctaFinal")}
                    </a>
                </div>
            </div>

            <VideoModal id={abierto} titulo={abierto ? t(`${abierto}Title`) : ""} onClose={() => setAbierto(null)} cerrarLabel={t("cerrar")} />
        </section>
    )
}
