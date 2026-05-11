export interface NavLink {
  label: string
  href: string
}

export interface SlideItem {
  id: string
  serviceName: string
  description: string
  image: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photo: string
  linkedinUrl?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
}

export interface Client {
  id: string
  name: string
  logo: string | null
}
