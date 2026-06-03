import Image from "next/image"
import Link from "next/link"
import type { NewsPost } from "@/lib/news"
import { formatNewsDate, getExcerpt, NEWS_DEFAULT_COVER } from "@/lib/news"

export default function NewsCard({ post }: { post: NewsPost }) {
  const cover = post.cover_image_url || NEWS_DEFAULT_COVER

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <Image
          src={cover}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0B3C78] backdrop-blur">
          {post.category}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {formatNewsDate(post.published_at)}
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {getExcerpt(post)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {post.author_name || "SIDEAS Consultores"}
          </div>
          <Link
            href={`/noticias/${post.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#0B3C78] px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-[#4398FF]"
          >
            Leer más
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

