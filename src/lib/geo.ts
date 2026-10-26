import type { RoutePoint } from '@/types/order.types'

function distance(a: RoutePoint, b: RoutePoint): number {
  return Math.hypot(a.lat - b.lat, a.lng - b.lng)
}

export function interpolateAlongRoute(route: RoutePoint[], t: number): RoutePoint {
  if (route.length === 0) return { lat: 0, lng: 0 }
  if (route.length === 1 || t <= 0) return route[0]
  if (t >= 1) return route[route.length - 1]

  const segmentLengths: number[] = []
  let total = 0
  for (let i = 0; i < route.length - 1; i++) {
    const len = distance(route[i], route[i + 1])
    segmentLengths.push(len)
    total += len
  }

  let target = t * total
  for (let i = 0; i < segmentLengths.length; i++) {
    if (target <= segmentLengths[i]) {
      const ratio = segmentLengths[i] === 0 ? 0 : target / segmentLengths[i]
      const a = route[i]
      const b = route[i + 1]
      return { lat: a.lat + (b.lat - a.lat) * ratio, lng: a.lng + (b.lng - a.lng) * ratio }
    }
    target -= segmentLengths[i]
  }
  return route[route.length - 1]
}

// Usa el servidor demo público de OSRM (Open Source Routing Machine) para obtener
// una ruta real por calles entre origen y destino, en vez de la línea recta del mock.
export async function fetchRoadRoute(origin: RoutePoint, destination: RoutePoint): Promise<RoutePoint[] | null> {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const coordinates: unknown = data?.routes?.[0]?.geometry?.coordinates
    if (!Array.isArray(coordinates) || coordinates.length < 2) return null
    return coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng }))
  } catch {
    return null
  }
}
