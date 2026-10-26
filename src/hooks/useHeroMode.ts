import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type HeroMode = 'blueprint' | 'commercial'
const HERO_MODE_KEY = 'megaingga_hero_mode'
const CHANGE_EVENT = 'megaingga_hero_mode_change'

export function useHeroMode() {
  const [heroMode, setHeroModeState] = useState<HeroMode>(() => {
    if (typeof window === 'undefined') return 'blueprint'
    const stored = localStorage.getItem(HERO_MODE_KEY)
    return stored === 'commercial' ? 'commercial' : 'blueprint'
  })

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === HERO_MODE_KEY && e.newValue) {
        setHeroModeState(e.newValue as HeroMode)
      }
    }

    const handleCustomChange = (e: CustomEvent<HeroMode>) => {
      setHeroModeState(e.detail)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(CHANGE_EVENT as any, handleCustomChange)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(CHANGE_EVENT as any, handleCustomChange)
    }
  }, [])

  const setHeroMode = (mode: HeroMode) => {
    setHeroModeState(mode)
    localStorage.setItem(HERO_MODE_KEY, mode)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: mode }))
    // Notifica al navbar y fuerza recalibración de GSAP ScrollTrigger ante el cambio de altura (420vh <-> 100dvh)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      window.dispatchEvent(new Event('scroll'))
    })
    setTimeout(() => {
      ScrollTrigger.refresh()
      window.dispatchEvent(new Event('scroll'))
    }, 120)
  }

  return { heroMode, setHeroMode }
}

