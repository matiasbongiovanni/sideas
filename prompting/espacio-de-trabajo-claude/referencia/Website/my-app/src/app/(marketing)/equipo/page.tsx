import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { equipo } from "@/data/equipo"

export const metadata: Metadata = {
    title: "Nuestro Equipo | SIDEAS Consultores",
    description:
        "Conocé al equipo de SIDEAS Consultores: profesionales en infraestructura IT, sistemas, redes y ciberseguridad comprometidos con la excelencia.",
}

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}

export default function Equipo() {
    return (
        <section id="equipo" className="relative py-24 bg-slate-50 overflow-hidden border-t border-slate-200/60">
            {/* Elementos decorativos de fondo sutiles */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[500px] h-[500px] bg-[#0B3C78]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-[#4398FF]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header Sincronizado */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#0B3C78]/20 bg-[#0B3C78]/5 px-4 py-1.5 mb-6 transition-colors hover:bg-[#0B3C78]/10">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#0B3C78]">Team</span>
                    </div>

                    <h2 className="text-3xl font-light sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
                        Nuestro <span className="font-bold">Equipo</span>
                    </h2>

                    <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-500 leading-relaxed">
                        Unimos nuestra experiencia técnica con un enfoque humano para que tus
                        ideas tengan la estructura y la dedicación que se merecen.
                    </p>
                </div>

                {/* Grid de Tarjetas de Equipo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
                    {equipo.map((member) => (
                        <div
                            key={member.id}
                            className="group flex flex-col items-center w-full max-w-[280px] bg-white rounded-3xl p-8 pb-6 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#4398FF]/30 hover:shadow-[#4398FF]/5"
                        >
                            {/* Avatar */}
                            <div className="relative h-28 w-28 rounded-full mb-6 overflow-hidden ring-4 ring-slate-50 transition-all duration-300 group-hover:ring-[#4398FF]/20 shadow-md">
                                {member.photo ? (
                                    <Image
                                        src={member.photo}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="112px"
                                    />
                                ) : (
                                    <div
                                        className="h-full w-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-tr from-[#0B3C78] to-[#4398FF]"
                                    >
                                        {getInitials(member.name)}
                                    </div>
                                )}
                            </div>

                            {/* Información centrada */}
                            <div className="text-center w-full flex-1 flex flex-col items-center">
                                <h3 className="text-lg font-bold text-slate-900 mb-1 truncate transition-colors group-hover:text-[#0B3C78]">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-medium text-[#4398FF] mb-6 flex-1">
                                    {member.role}
                                </p>

                                {/* Botón de LinkedIn (Condicional) */}
                                {member.linkedinUrl ? (
                                    <Link
                                        href={member.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full bg-[#0B3C78] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-[#4398FF] hover:scale-105 active:scale-95 shadow-[#0B3C78]/10 hover:shadow-[#4398FF]/20"
                                    >
                                        {/* Ícono de LinkedIn SVG limpio */}
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                        LinkedIn
                                    </Link>
                                ) : (
                                    // Placeholder o mensaje si no hay LinkedIn, para mantener la altura
                                    <div className="h-9 flex items-center justify-center">
                                        <span className="text-xs text-slate-400 italic">Perfil no disponible</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}