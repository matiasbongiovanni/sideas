import type { Metadata } from "next"
import { redirect } from "next/navigation"
import NewsManager from "@/components/admin/NewsManager"
import { listAdminNews, requireAdminSession } from "@/lib/news.server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Panel CMS",
  robots: { index: false, follow: false },
}

export default async function AdminHomePage() {
  const session = await requireAdminSession()
  if (!session) redirect("/admin/login")

  const posts = await listAdminNews()

  return <NewsManager initialPosts={posts} />
}
