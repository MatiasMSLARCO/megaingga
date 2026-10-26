import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface ScrollRevealOptions {
  stagger?: number
  /** Re-bind once async content (e.g. a query result) mounts new `data-reveal` nodes. */
  deps?: unknown[]
}

/**
 * Scopes to a container ref; animates every descendant marked `data-reveal`
 * with a rise-and-fade the first time the container enters the viewport.
 * Reduced-motion users get the final state instantly, no transform.
 */
export function useScrollReveal<T extends HTMLElement>(options?: ScrollRevealOptions) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const targets = ref.current?.querySelectorAll('[data-reveal]')
      if (!targets || targets.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: options?.stagger ?? 0.08,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        )
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(targets, { opacity: 1, y: 0 })
      })
    },
    { scope: ref, dependencies: options?.deps ?? [], revertOnUpdate: true }
  )

  // Respaldo de visibilidad ante cambios de altura dinámica de página (e.g. alternar Hero 3D a Hero Comercial)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleLayoutChange = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('megaingga_hero_mode_change', handleLayoutChange)

    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const hiddenTargets = el.querySelectorAll<HTMLElement>('[data-reveal]')
              hiddenTargets.forEach((t) => {
                if (window.getComputedStyle(t).opacity === '0') {
                  gsap.to(t, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
                }
              })
              observer?.disconnect()
            }
          }
        },
        { threshold: 0.05 }
      )
      observer.observe(el)
    }

    return () => {
      window.removeEventListener('megaingga_hero_mode_change', handleLayoutChange)
      observer?.disconnect()
    }
  }, [])

  return ref
}

