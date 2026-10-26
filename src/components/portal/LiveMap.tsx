import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Navigation, Maximize2, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { fetchRoadRoute, interpolateAlongRoute } from '@/lib/geo'
import type { RoutePoint } from '@/types/order.types'

interface LiveMapProps {
  route: RoutePoint[]
  className?: string
}

const ORIGIN_ICON = L.divIcon({
  className: '',
  html: '<div class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-gray text-[10px] font-bold text-white shadow-md">A</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

const DEST_ICON = L.divIcon({
  className: '',
  html: '<div class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-dark text-[10px] font-bold text-white shadow-md">B</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

const DRIVER_ICON = L.divIcon({
  className: '',
  html: `<div class="relative flex h-7 w-7 items-center justify-center">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-60"></span>
    <span class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-red shadow-lg text-[9px] text-white font-bold">🚛</span>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// Tramo visible de la ruta que recorre el conductor durante la demo (0 a 1 = origen a destino).
const DEMO_START_T = 0.55
const DEMO_END_T = 0.82
const DEMO_LOOP_MS = 45000

export function LiveMap({ route, className }: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const driverMarkerRef = useRef<L.Marker | null>(null)
  const routeLineRef = useRef<L.Polyline | null>(null)
  const currentDriverPosRef = useRef<RoutePoint | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const reducedMotion = usePrefersReducedMotion()
  const [prevRoute, setPrevRoute] = useState(route)
  const [activeRoute, setActiveRoute] = useState<RoutePoint[]>(route)

  // Si el pedido cambia de ruta, vuelve a partir de la línea recta del mock (patrón "adjust state while rendering").
  if (route !== prevRoute) {
    setPrevRoute(route)
    setActiveRoute(route)
  }

  // Si hay red, reemplaza la línea recta por la ruta real por calles (OSRM).
  useEffect(() => {
    if (route.length < 2) return

    let cancelled = false
    fetchRoadRoute(route[0], route[route.length - 1]).then((roadRoute) => {
      if (!cancelled && roadRoute) setActiveRoute(roadRoute)
    })
    return () => {
      cancelled = true
    }
  }, [route])

  // Crea el mapa una sola vez por pedido; el trazado se dibuja en un efecto aparte.
  useEffect(() => {
    if (!containerRef.current || route.length === 0) return

    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView(
      [route[0].lat, route[0].lng],
      14
    )
    mapRef.current = map

    // OpenStreetMap estándar: 100% público, sin requerir API key ni marcas de agua
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    L.marker([route[0].lat, route[0].lng], { icon: ORIGIN_ICON }).addTo(map)
    L.marker([route[route.length - 1].lat, route[route.length - 1].lng], { icon: DEST_ICON }).addTo(map)

    driverMarkerRef.current = L.marker([route[0].lat, route[0].lng], { icon: DRIVER_ICON }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      driverMarkerRef.current = null
      routeLineRef.current = null
    }
  }, [route])

  // Redibuja el trazado cuando cambia la ruta activa (mock o real por calles).
  useEffect(() => {
    const map = mapRef.current
    if (!map || activeRoute.length === 0) return

    routeLineRef.current?.remove()
    const latLngs = activeRoute.map((p) => [p.lat, p.lng] as [number, number])
    routeLineRef.current = L.polyline(latLngs, {
      color: '#e31e24',
      weight: 4.5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] })
  }, [activeRoute])

  // Anima al conductor sobre la ruta activa.
  useEffect(() => {
    if (!driverMarkerRef.current || activeRoute.length === 0) return

    if (reducedMotion) {
      const pos = interpolateAlongRoute(activeRoute, DEMO_END_T)
      currentDriverPosRef.current = pos
      driverMarkerRef.current.setLatLng([pos.lat, pos.lng])
      return
    }

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - startTime) % DEMO_LOOP_MS
      const t = DEMO_START_T + (DEMO_END_T - DEMO_START_T) * (elapsed / DEMO_LOOP_MS)
      const pos = interpolateAlongRoute(activeRoute, t)
      currentDriverPosRef.current = pos
      driverMarkerRef.current?.setLatLng([pos.lat, pos.lng])
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [activeRoute, reducedMotion])

  const handleCenterDriver = () => {
    if (!mapRef.current) return
    const pos = currentDriverPosRef.current ?? (activeRoute.length > 0 ? activeRoute[0] : null)
    if (pos) {
      mapRef.current.flyTo([pos.lat, pos.lng], 16, { duration: 1.2 })
    }
  }

  const handleFitRoute = () => {
    if (!mapRef.current || activeRoute.length === 0) return
    const latLngs = activeRoute.map((p) => [p.lat, p.lng] as [number, number])
    mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] })
  }

  const handleZoomIn = () => mapRef.current?.zoomIn()
  const handleZoomOut = () => mapRef.current?.zoomOut()

  return (
    <div className={cn('relative overflow-hidden', className ?? 'h-full w-full')}>
      <div ref={containerRef} className="h-full w-full" />

      {/* Floating Status Pill */}
      <div className="absolute left-3 top-3 z-[1000] flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-semibold text-brand-dark">GPS en directo · En ruta</span>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleCenterDriver}
          title="Centrar en vehículo"
          className="flex h-8 items-center gap-1.5 rounded-md border border-black/10 bg-white/95 px-2.5 text-xs font-semibold text-brand-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-brand-red hover:text-white cursor-pointer"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Centrar chofer</span>
        </button>
        <button
          type="button"
          onClick={handleFitRoute}
          title="Ver ruta completa"
          className="flex h-8 items-center gap-1.5 rounded-md border border-black/10 bg-white/95 px-2.5 text-xs font-semibold text-brand-dark shadow-sm backdrop-blur-sm transition-colors hover:bg-black/5 cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ruta entera</span>
        </button>
        <div className="flex flex-col overflow-hidden rounded-md border border-black/10 bg-white/95 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex h-7 w-8 items-center justify-center text-brand-dark transition-colors hover:bg-black/5 cursor-pointer border-b border-black/10"
            title="Acercar"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex h-7 w-8 items-center justify-center text-brand-dark transition-colors hover:bg-black/5 cursor-pointer"
            title="Alejar"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
