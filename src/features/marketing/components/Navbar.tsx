"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants";
import LanguageSwitcher from "@/features/marketing/components/LanguageSwitcher";

export default function Navbar() {
    const t = useTranslations("Nav");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const navSolid = scrolled || pathname !== "/";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navSolid
                ? "bg-card-bg/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Image src="/Sideas_Blanco.png" alt="SIDEAS Logo" width={140} height={40} priority />
                </Link>

                {/* Desktop Links & CTA */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#4398FF] after:transition-all hover:after:w-full"
                        >
                            {t(link.key)}
                        </Link>
                    ))}

                    {/* Separador sutil */}
                    <div className="h-6 w-px bg-white/10"></div>

                    <LanguageSwitcher />

                    {/* CTA Ver Recursos - Desktop */}
                    <NextLink
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-5 py-2 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        {t("verRecursos")}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </NextLink>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={t("toggleMenu")}
                >
                    <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                    <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 bg-card-bg/95 backdrop-blur-xl ${menuOpen ? "max-h-96 border-t border-white/10" : "max-h-0"}`}>
                <div className="flex flex-col gap-2 px-6 py-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            {t(link.key)}
                        </Link>
                    ))}

                    <div className="px-4 pt-2">
                        <LanguageSwitcher />
                    </div>

                    {/* CTA Ver Recursos - Mobile */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <NextLink
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95"
                        >
                            {t("verRecursos")}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </NextLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}