"use client"

import { useParams } from "next/navigation"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
    const locale = useLocale()
    const pathname = usePathname()
    const params = useParams()
    const router = useRouter()

    const otherLocale = locale === "es" ? "en" : "es"

    return (
        <button
            onClick={() =>
                router.replace(
                    // @ts-expect-error -- el pathname y los params siempre matchean para la ruta actual
                    { pathname, params },
                    { locale: otherLocale }
                )
            }
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-[#4398FF]/50 hover:text-white ${className}`}
            aria-label={`Switch to ${otherLocale === "en" ? "Español" : "English"}`}
        >
            {locale === "es" ? "ES" : "EN"}
        </button>
    )
}
