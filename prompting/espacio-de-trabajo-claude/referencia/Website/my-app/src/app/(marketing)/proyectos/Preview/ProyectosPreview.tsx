import Link from "next/link"
import Image from "next/image"
import { proyectos } from "@/data/proyectos"

export default function ProyectosPreview() {
    // Extraemos solo los primeros 3 proyectos para mostrar en el Home
    const featuredProjects = proyectos.slice(0, 3)

    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header idéntico a la captura */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center rounded-full border border-[#4398FF]/20 bg-[#4398FF]/5 px-3 py-1 mb-6">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#0B3C78]">
                                Portafolio
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-light text-slate-900 tracking-tight">
                            Nuestros <span className="font-bold">Proyectos</span>
                        </h2>
                        <p className="mt-4 text-base text-slate-500">
                            Casos de éxito y soluciones tecnológicas implementadas para transformar el futuro de nuestros clientes.
                        </p>
                    </div>

                    <Link
                        href="/proyectos"
                        className="group shrink-0 inline-flex items-center gap-3 rounded-full bg-[#0F172A] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
                    >
                        Ver todos los proyectos
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Grilla de 3 Columnas (Tarjetas Oscuras) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {featuredProjects.map((project) => (
                        <Link
                            key={project.slug}
                            href={`/proyectos/${project.slug}`}
                            className="group flex flex-col rounded-[2rem] overflow-hidden bg-[#0F172A] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#4398FF]/10"
                        >
                            {/* Imagen con difuminado inferior */}
                            <div className="relative h-56 w-full bg-slate-800 overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0F172A] to-transparent z-10 pointer-events-none" />
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                                />
                            </div>

                            {/* Contenido de la Tarjeta */}
                            <div className="flex flex-col flex-1 p-8 pt-2 relative z-20">
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#4398FF] transition-colors">
                                    {project.title}
                                </h3>

                                <p className="text-sm leading-relaxed text-slate-400 mb-8 flex-1">
                                    {project.description}
                                </p>

                                {/* Footer de la Tarjeta: Tags y Botón Flecha */}
                                <div className="flex items-center justify-between gap-4 mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {project.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-[#4398FF]/10 text-[#4398FF] border border-[#4398FF]/20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-colors duration-300 group-hover:bg-[#4398FF] group-hover:border-[#4398FF]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    )
}