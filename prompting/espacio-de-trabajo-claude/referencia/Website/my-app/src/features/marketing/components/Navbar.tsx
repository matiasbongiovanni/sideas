"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Importamos Link de Next.js
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-card-bg/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <a href="#inicio" className="flex items-center gap-2 group">
                    <Image src="/Sideas_Blanco.png" alt="SIDEAS Logo" width={140} height={40} priority />
                </a>

                {/* Desktop Links & CTA */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#4398FF] after:transition-all hover:after:w-full"
                        >
                            {link.label}
                        </a>
                    ))}

                    {/* Separador sutil */}
                    <div className="h-6 w-px bg-white/10"></div>

                    {/* CTA Iniciar Sesión - Desktop */}
                    <Link
                        href="/login"
                        className="group inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#4398FF]/50 hover:bg-slate-800 shadow-lg hover:shadow-[#4398FF]/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4398FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Iniciar Sesión
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
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
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}

                    {/* CTA Iniciar Sesión - Mobile */}
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0B3C78] to-[#4398FF] px-4 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}