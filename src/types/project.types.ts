export type ProjectDivision = 'hospitalario' | 'civil' | 'mecanico' | 'electrico'

export interface Project {
  id: string
  slug: string
  title: string
  division: ProjectDivision
  clientName: string
  location: string
  year: number
  description: string
  scope: string[]
  mainImageUrl: string
  galleryImages: string[]
  featured: boolean
}
