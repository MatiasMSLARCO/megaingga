import { useCallback, useEffect, useState } from 'react'
import type { Product } from '@/types/product.types'
import type { QuoteItem } from '@/types/quote.types'

const STORAGE_KEY = 'megaingga_quote_cart'

function readStoredItems(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QuoteItem[]) : []
  } catch {
    return []
  }
}

export function useQuoteCart() {
  const [items, setItems] = useState<QuoteItem[]>(() => readStoredItems())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { productId: product.id, product, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.productId !== productId)
        : prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clear, totalItemsCount }
}
