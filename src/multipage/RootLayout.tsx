import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { QuoteDrawer } from '@/components/quote/QuoteDrawer'
import { QuoteCheckoutModal } from '@/components/quote/QuoteCheckoutModal'
import { useQuoteCart } from '@/hooks/useQuoteCart'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function RootLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const heroSentinelRef = useRef<HTMLDivElement>(null)
  const cart = useQuoteCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!isHome) return
    const sentinel = heroSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => setScrolledPastHero(!entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isHome])

  const isScrolled = isHome ? scrolledPastHero : true
  const outletContext: AppOutletContext = {
    addToQuote: (product, quantity) => cart.addItem(product, quantity),
    openQuote: () => setIsQuoteOpen(true),
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar quoteCount={cart.totalItemsCount} onOpenQuote={() => setIsQuoteOpen(true)} isScrolled={isScrolled} />

      <main className="relative">
        {isHome && <div ref={heroSentinelRef} className="absolute top-0 h-24 w-full" />}
        <Outlet context={outletContext} />
      </main>

      <Footer />

      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={() => {
          setIsQuoteOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <QuoteCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart.items}
        onSuccess={cart.clear}
      />
    </div>
  )
}
