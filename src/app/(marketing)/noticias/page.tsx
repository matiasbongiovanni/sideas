import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Noticias & Blog | SIDEAS Consultores",
  description:
    "Artículos, novedades y recursos sobre infraestructura IT, ciberseguridad, automatización y tecnología para empresas en Argentina.",
}


interface Post {
    slug: string
    title: string
    description: string
    category: string
    date: string
}

const posts: Post[] = [
    {
        slug: "branding-antes-del-sitio-web-1",
        title: "Por qué desarrollar branding antes del sitio web",
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
        category: "Emprendimiento",
        date: "23 de junio de 2025",
    },
    {
        slug: "branding-antes-del-sitio-web-2",
        title: "Por qué desarrollar branding antes del sitio web",
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
        category: "Emprendimiento",
        date: "23 de junio de 2025",
    },
    {
        slug: "branding-antes-del-sitio-web-3",
        title: "Por qué desarrollar branding antes del sitio web",
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a type and scrambled it to make a type specimen book. It has survived not only five centuries.",
        category: "Emprendimiento",
        date: "23 de junio de 2025",
    },
]

export default function Noticias() {
    return (
        <section className="py-24" style={{ background: "#F8FAFC" }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2
                                className="text-3xl font-bold sm:text-4xl"
                                style={{ color: "#0F172A" }}
                            >
                                Noticias &amp; Blogs
                            </h2>
                            <div
                                className="hidden sm:block h-[2px] w-32"
                                style={{ background: "#0850A0" }}
                            />
                        </div>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: "#0850A0" }}
                        >
                            Las noticias
                        </p>
                        <p
                            className="text-lg font-semibold"
                            style={{ color: "#0F172A" }}
                        >
                            más recientes.
                        </p>
                    </div>

                    <Link
                        href="/noticias"
                        className="btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                    >
                        Ver todos nuestros blogs.
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div
                            key={post.slug}
                            className="rounded-2xl overflow-hidden card-shadow transition-all duration-300 hover:-translate-y-2"
                            style={{ background: "#0F172A" }}
                        >
                            {/* Image placeholder */}
                            <div
                                className="relative h-52 flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, #0f766e, #14b8a6)",
                                }}
                            >
                                <div className="text-white/60">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 mx-auto opacity-30"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>

                                <div className="absolute top-4 left-4 right-4">
                                    <p className="text-xs text-white/80 uppercase tracking-wider font-medium">
                                        POR QUÉ DEBO DESARROLLAR EL BRANDING ANTES DE TENER MI SITIO WEB
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-3">
                                    {post.title}
                                </h3>

                                <p
                                    className="text-sm leading-relaxed mb-5"
                                    style={{ color: "#64748B" }}
                                >
                                    {post.description}
                                </p>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="btn-primary rounded-full px-4 py-1.5 text-xs font-medium">
                                        {post.category}
                                    </span>
                                    <span
                                        className="text-xs"
                                        style={{ color: "#64748B" }}
                                    >
                                        {post.date}
                                    </span>
                                </div>

                                <Link
                                    href={`/noticias/${post.slug}`}
                                    className="text-sm font-medium underline"
                                    style={{ color: "#4398FF" }}
                                >
                                    Leer Más
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}