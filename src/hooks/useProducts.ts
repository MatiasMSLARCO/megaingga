import { useQuery } from '@tanstack/react-query'
import type { ProductDivision } from '@/types/product.types'
import { getCategories, getProductBySlug, getProducts, type ProductsFilter } from '@/services/products.service'

export function useProducts(filter?: ProductsFilter) {
  return useQuery({
    queryKey: ['products', filter?.division, filter?.search],
    queryFn: () => getProducts(filter),
  })
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug as string),
    enabled: Boolean(slug),
  })
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: getCategories,
  })
}

export type { ProductDivision }
