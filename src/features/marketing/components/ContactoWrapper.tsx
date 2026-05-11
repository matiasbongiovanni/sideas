"use client"

import dynamic from "next/dynamic"

const Contacto = dynamic(
  () => import("@/app/(marketing)/contacto/Contacto"),
  { ssr: false }
)

export default function ContactoWrapper() {
  return <Contacto />
}
