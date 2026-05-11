"use client";

import Marquee from "react-fast-marquee";

const testimonials = [
    { name: "Nombre Testimonio", role: "CEO INGENIA", text: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500." },
    { name: "Nombre Testimonio", role: "CEO INGENIA", text: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500." },
    { name: "Nombre Testimonio", role: "CEO INGENIA", text: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500." },
    { name: "Nombre Testimonio", role: "CEO INGENIA", text: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500." },
    { name: "Nombre Testimonio", role: "CEO INGENIA", text: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500." },
    { name: "Nombre Testimonio", role: "CEO INGENIA", text: "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500." },
];

export default function Testimonios() {
    // Convert into repeated arrays for a smoother marquee look if needed, 
    // though react-fast-marquee duplicate functionality handles repetition.
    const row1 = testimonials;
    const row2 = testimonials;

    const getCardStyle = (rowIndex: number, colIndex: number) => {
        // Alternating logic to match the 3x2 grid checkerboard style
        const isLight = (rowIndex + colIndex) % 2 === 0;

        return {
            cardBg: isLight ? "#F1F5F9" : "#0850A0",
            textColor: isLight ? "#64748B" : "#E2E8F0",
            titleColor: isLight ? "#0F172A" : "#FFFFFF",
            avatarBg: isLight ? "transparent" : "rgba(255,255,255,0.1)",
            avatarBorder: isLight ? "#0850A0" : "#FFFFFF",
            avatarText: isLight ? "#0850A0" : "#FFFFFF",
        };
    };

    return (
        <section className="py-24" style={{ background: "#F8FAFC" }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#0F172A" }}>
                        Lo que dicen de nosotros
                    </h2>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Row 1 - scrolling left */}
                <Marquee speed={40} gradient={false} pauseOnHover={true}>
                    <div className="flex gap-6 pl-6">
                        {row1.map((t, i) => {
                            const styles = getCardStyle(0, i);
                            return (
                                <div
                                    key={`r1-${i}`}
                                    className="rounded-2xl p-6 shadow-xl transition-all duration-300 w-[400px] flex-shrink-0"
                                    style={{ background: styles.cardBg }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="h-12 w-12 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                                            style={{
                                                borderColor: styles.avatarBorder,
                                                color: styles.avatarText,
                                                background: styles.avatarBg,
                                            }}
                                        >
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: styles.titleColor }}>
                                                {t.name}
                                            </p>
                                            <p className="text-xs" style={{ color: styles.textColor }}>
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed" style={{ color: styles.textColor }}>
                                        {t.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Marquee>

                {/* Row 2 - scrolling left with different offset or reverse direction */}
                <Marquee speed={30} direction="right" gradient={false} pauseOnHover={true}>
                    <div className="flex gap-6 pl-6">
                        {row2.map((t, i) => {
                            const styles = getCardStyle(1, i);
                            return (
                                <div
                                    key={`r2-${i}`}
                                    className="rounded-2xl p-6 shadow-xl transition-all duration-300 w-[400px] flex-shrink-0"
                                    style={{ background: styles.cardBg }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="h-12 w-12 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                                            style={{
                                                borderColor: styles.avatarBorder,
                                                color: styles.avatarText,
                                                background: styles.avatarBg,
                                            }}
                                        >
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: styles.titleColor }}>
                                                {t.name}
                                            </p>
                                            <p className="text-xs" style={{ color: styles.textColor }}>
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed" style={{ color: styles.textColor }}>
                                        {t.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Marquee>
            </div>
        </section>
    );
}
