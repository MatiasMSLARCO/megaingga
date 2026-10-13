import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { QuoteDrawer } from '@/components/quote/QuoteDrawer'
import { useQuoteCart } from '@/hooks/useQuoteCart'
import type { Product } from '@/types/product.types'
import type { AppOutletContext } from '@/types/outlet-context.types'

export function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [drawerInitialTab, setDrawerInitialTab] = useState<'quote' | 'pay'>('quote')
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const cart = useQuoteCart()

  // Navega entre rutas con scroll al tope; si hay #hash, deja que el navegador
  // la resuelva una vez el DOM de destino está montado.
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      const hero = document.getElementById('inicio')
      if (hero) {
        const rect = hero.getBoundingClientRect()
        // Cuando el final del hero llega o pasa el navbar (<= 64px),
        // el usuario entró a las secciones con fondo blanco.
        setScrolledPastHero(rect.bottom <= 64)
        return
      }

      const sentinel = document.getElementById('nav-hero-sentinel')
      if (sentinel) {
        const rect = sentinel.getBoundingClientRect()
        setScrolledPastHero(rect.top <= 64)
        return
      }

      setScrolledPastHero(window.scrollY > 64)
    }

    handleScroll()
    const rafId = requestAnimationFrame(handleScroll)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isHome])

  const isScrolled = !isHome || scrolledPastHero

  const openBuyNowForProduct = (product: Product, quantity: number) => {
    cart.addItem(product, quantity)
    navigate('/checkout')
  }

  const addToQuote = (product: Product, quantity = 1) => {
    cart.addItem(product, quantity)
    setDrawerInitialTab('quote')
    setIsQuoteOpen(true)
  }

  const openQuote = () => {
    setDrawerInitialTab('quote')
    setIsQuoteOpen(true)
  }

  const outletContext: AppOutletContext = {
    addToQuote,
    onBuyNow: openBuyNowForProduct,
    openQuote,
    items: cart.items,
    onUpdateQuantity: cart.updateQuantity,
    onRemove: cart.removeItem,
    onClear: cart.clear,
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar quoteCount={cart.totalItemsCount} onOpenQuote={openQuote} isScrolled={isScrolled} />

      <main className="relative">
        <Outlet context={outletContext} />
      </main>

      <Footer />

      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onClear={cart.clear}
        initialTab={drawerInitialTab}
      />
    </div>
  )
}

