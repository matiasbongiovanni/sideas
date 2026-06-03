import type { Metadata } from "next"
import AdminSidebar from "@/components/admin/AdminSidebar"

export const metadata: Metadata = {
  title: {
    default: "Admin | SIDEAS Consultores",
    template: "%s | Admin SIDEAS",
  },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(67,152,255,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(11,60,120,0.22),_transparent_32%),linear-gradient(180deg,_#020817_0%,_#07111f_100%)]" />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex min-h-screen flex-1 flex-col">
          <div className="border-b border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl lg:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7ab8ff]">
                  Panel privado
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  Gestión de contenidos
                </h1>
              </div>
              <div className="hidden text-sm text-slate-300 md:block">
                Noticias y blog publicados desde el CMS
              </div>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-8 lg:px-10">
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

