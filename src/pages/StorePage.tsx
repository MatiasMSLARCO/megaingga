import { useEffect } from 'react'
import { useOutletContext } from 'react-router'
import { ServicesSection } from '@/components/sections/ServicesSection'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function StorePage() {
  const { addToQuote, onBuyNow } = useOutletContext<AppOutletContext>()

  useEffect(() => {
    document.title = 'Tienda Técnica · Mega Ingeniería'
    return () => {
      document.title = 'Mega Ingeniería'
    }
  }, [])

  return <ServicesSection onAddToQuote={addToQuote} onBuyNow={onBuyNow} />
}
