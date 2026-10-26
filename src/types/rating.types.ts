export interface RatingCriteria {
  calidadProducto: number
  tiempoEnvio: number
  atencion: number
  embalaje: number
}

export interface Rating {
  orderId: string
  criteria: RatingCriteria
  comentario: string
  createdAt: string
}
