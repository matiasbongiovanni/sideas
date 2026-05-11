"use client"

import dynamic from "next/dynamic"

const Stats = dynamic(
  () => import("@/features/marketing/components/Stats"),
  { ssr: false }
)

export default function StatsWrapper() {
  return <Stats />
}
