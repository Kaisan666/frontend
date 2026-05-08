import type { MetadataRoute } from "next"
import { client } from "@/sanity/lib/client"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shengenplus.ru"

type ProductSitemapEntry = {
  slug: string
  updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Статичные страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contacts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Динамика: товары из Sanity
  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await client.fetch<ProductSitemapEntry[]>(
      `*[_type == "product" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`,
      {},
      { next: { revalidate: 3600 } }
    )

    productPages = products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch (err) {
    // Если Sanity упал — отдадим только статику, чтобы sitemap всё равно был валиден
    console.error("Sitemap: failed to fetch products from Sanity", err)
  }

  return [...staticPages, ...productPages]
}
