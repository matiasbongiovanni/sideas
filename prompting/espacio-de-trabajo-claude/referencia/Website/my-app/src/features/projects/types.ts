export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  image: string
  detail: string
  // Detail page fields
  category: string
  location: string
  year: string
  challenge: string
  strategy: string
  results?: string[]
  websiteUrl?: string
  images: string[]
}
