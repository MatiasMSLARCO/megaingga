import type { DriverInfo, RoutePoint } from '@/types/order.types'

export const driverMock: DriverInfo = {
  name: 'Luis Chasiquiza',
  plate: 'PCT-4521',
  phone: '+593 99 831 4070',
  vehicle: 'Camión Hino 300 · Furgón',
  avatarInitials: 'LC',
}

// Ruta demo: bodega MegaIngga (centro de Latacunga) -> Hospital SOLCA, Ambato.
// LiveMap usa origen/destino para pedir la ruta real por calles a OSRM; estos puntos intermedios
// son solo el respaldo (línea recta) mientras llega la respuesta o si no hay red.
export const routeMock: RoutePoint[] = [
  { lat: -0.9345, lng: -78.6157 },
  { lat: -1.236, lng: -78.622 },
]

export const DRIVER_CHAT_SCRIPT: Record<string, string> = {
  default: 'Entendido, en seguida le confirmo.',
  eta: 'Voy llegando en aproximadamente 1 hora y 40 minutos, el tráfico está fluido en la Panamericana.',
  ubicacion: 'Justo ahora voy pasando por Salcedo, rumbo a Ambato.',
  gracias: 'Con gusto, cualquier novedad en el trayecto le aviso por aquí.',
  hola: '¡Hola! Soy Luis, voy en camino desde Latacunga con su pedido hacia SOLCA Ambato. Cualquier cosa me escribe por aquí.',
}
