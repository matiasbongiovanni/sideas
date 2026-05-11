import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Quiénes Somos | SIDEAS Consultores",
    description:
        "Conocé la historia de SIDEAS Consultores: empresa IT fundada en 2020 en Córdoba, Argentina. +15 clientes activos, soporte 24/7 y 12 servicios especializados.",
    openGraph: {
        title: "Quiénes Somos | SIDEAS Consultores",
        description: "Conocé la historia de SIDEAS Consultores: empresa IT fundada en 2020 en Córdoba, Argentina.",
        url: "https://sideasconsultores.com.ar/quienes-somos",
    },
}

export default function QuienesSomos() {
    const stats = [
        { value: "2020", label: "Año de fundación" },
        { value: "+15", label: "Clientes activos" },
        { value: "24/7", label: "Soporte disponible" },
        { value: "12", label: "Servicios IT" },
    ];

    return (
        <section id="quienes-somos" className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0F172A 50%, #112240 100%)" }}>
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[120px]" style={{ background: "rgba(8,80,160,0.08)" }} />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-6" style={{ borderColor: "rgba(67,152,255,0.3)", background: "rgba(67,152,255,0.1)" }}>
                            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#4398FF" }}>
                                Quiénes Somos
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white sm:text-4xl leading-tight mb-6">
                            Tu socio tecnológico
                            <br />
                            <span style={{ color: "#4398FF" }}>de confianza</span>
                        </h2>
                        <p className="text-base leading-7 mb-6" style={{ color: "#94a3b8" }}>
                            En SIDEAS nos especializamos en brindar soluciones integrales de
                            infraestructura tecnológica. Nuestro equipo de profesionales está
                            comprometido con la excelencia y la innovación constante.
                        </p>
                        <p className="text-base leading-7 mb-8" style={{ color: "#94a3b8" }}>
                            Trabajamos con las últimas tecnologías para garantizar que tu
                            empresa cuente con sistemas confiables, seguros y escalables que
                            impulsen tu crecimiento.
                        </p>
                        <a
                            href="#contacto"
                            className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                        >
                            Conocenos más
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>

                    {/* Right - Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border bg-white/5 backdrop-blur-sm p-6 text-center transition-all hover:-translate-y-1"
                                style={{ borderColor: "rgba(255,255,255,0.1)" }}
                            >
                                <p className="text-3xl font-bold mb-2" style={{ color: "#4398FF" }}>
                                    {stat.value}
                                </p>
                                <p className="text-sm" style={{ color: "#94a3b8" }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
