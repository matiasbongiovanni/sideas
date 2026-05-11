"use client";

const clients = ["Gamify", "Host IT", "Asteroid Kit"];

export default function Slider() {
    const repeatedClients = [...clients, ...clients, ...clients, ...clients, ...clients, ...clients];

    return (
        <section className="py-16" style={{ background: "#F8FAFC" }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-10 text-center">
                <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: "#0F172A" }}>
                    Quiénes confían en nosotros
                </h2>
                <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
                    Conocé a las empresas que ya caminan junto a nosotros y confían en
                    nuestro trabajo para seguir creciendo día a día.
                </p>
            </div>

            {/* Marquee row 1 */}
            <div className="relative overflow-hidden mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #F8FAFC, transparent)" }} />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #F8FAFC, transparent)" }} />
                <div className="animate-marquee flex gap-12 items-center whitespace-nowrap">
                    {repeatedClients.map((name, i) => (
                        <div key={i} className="flex items-center gap-2 px-4">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ background: i % 3 === 0 ? "#0850A0" : i % 3 === 1 ? "#f97316" : "#10b981" }} />
                            <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marquee row 2 (reverse) */}
            <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #F8FAFC, transparent)" }} />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #F8FAFC, transparent)" }} />
                <div className="flex gap-12 items-center whitespace-nowrap" style={{ animation: "marquee 25s linear infinite reverse" }}>
                    {repeatedClients.reverse().map((name, i) => (
                        <div key={i} className="flex items-center gap-2 px-4">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ background: i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#0850A0" : "#f97316" }} />
                            <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
