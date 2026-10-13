import { useEffect, useRef, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { QuoteDrawer } from '@/components/quote/QuoteDrawer'
import { QuoteCheckoutModal } from '@/components/quote/QuoteCheckoutModal'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { useQuoteCart } from '@/hooks/useQuoteCart'

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const heroSentinelRef = useRef<HTMLDivElement>(null)
  const cart = useQuoteCart()

  useEffect(() => {
    const sentinel = heroSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar quoteCount={cart.totalItemsCount} onOpenQuote={() => setIsQuoteOpen(true)} isScrolled={isScrolled} />

      <main className="relative">
        <div ref={heroSentinelRef} className="absolute top-0 h-24 w-full" />
        <HeroSection onOpenQuote={() => setIsQuoteOpen(true)} />
        <AboutSection />
        <ServicesSection onAddToQuote={(product, quantity) => cart.addItem(product, quantity)} />
        <ProjectsSection />
        <ClientsSection />
        <ContactSection />
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
