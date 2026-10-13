import type { Product, ProductDivision } from '@/types/product.types'
import { productsMock } from '@/data/products.mock'
import { delay } from './delay'

export interface ProductsFilter {
  division?: ProductDivision
  search?: string
}

export async function getProducts(filter?: ProductsFilter): Promise<Product[]> {
  await delay()
  let results = productsMock

  if (filter?.division) {
    results = results.filter((p) => p.division === filter.division)
  }

  if (filter?.search && filter.search.trim().length > 2) {
    const term = filter.search.trim().toLowerCase()
    results = results.filter(
      (p) => p.name.toLowerCase().includes(term) || p.shortDescription.toLowerCase().includes(term)
    )
  }

  return results
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await delay()
  return productsMock.find((p) => p.slug === slug)
}

export async function getCategories(): Promise<string[]> {
  await delay()
  return Array.from(new Set(productsMock.map((p) => p.category)))
}
