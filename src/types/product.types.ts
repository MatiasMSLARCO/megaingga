export type ProductDivision = 'hospitalario' | 'climatizacion' | 'especiales'

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  division: ProductDivision
  category: string
  shortDescription: string
  fullDescription: string
  specifications: ProductSpecification[]
  standards: string[]
  imageUrl: string
  gallery?: string[]
  datasheetAvailable: boolean
  featured: boolean
  salesCount?: number
}
