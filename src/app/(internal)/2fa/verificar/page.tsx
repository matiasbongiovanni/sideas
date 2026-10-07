import type { Metadata } from "next"
import Pantalla2FA from "@/components/auth/Pantalla2FA"
import { sanitizarNext } from "@/lib/mfa"

export const metadata: Metadata = {
  title: "Verificación en dos pasos | SIDEAS",
  robots: { index: false, follow: false },
}

export default async function Verificar2FA({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return <Pantalla2FA modo="verificar" next={sanitizarNext(next)} />
}
