export type ProjectDivision = 'hospitalario' | 'civil' | 'mecanico' | 'electrico'

export interface ProjectScopeGroup {
  title: string
  items: string[]
}

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
  scopeGroups?: ProjectScopeGroup[]
  mainImageUrl: string
  galleryImages: string[]
  featured: boolean
}
