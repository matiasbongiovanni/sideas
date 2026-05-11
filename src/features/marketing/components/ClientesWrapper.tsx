"use client"

import dynamic from "next/dynamic"

const ClientesGrid = dynamic(
  () => import("@/features/marketing/components/ClientesGrid"),
  { ssr: false }
)

export default function ClientesWrapper() {
  return <ClientesGrid />
}
