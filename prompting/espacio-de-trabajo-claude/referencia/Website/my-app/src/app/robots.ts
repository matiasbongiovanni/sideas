import type { MetadataRoute } from "next"
import { METADATA_BASE_URL } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/noticias/"],
      },
    ],
    sitemap: `${METADATA_BASE_URL}/sitemap.xml`,
  }
}
