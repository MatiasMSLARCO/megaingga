import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Textarea } from '@/components/ui/Textarea'
import { StarRating } from '@/components/portal/StarRating'
import { useOrder } from '@/hooks/useOrders'
import { useRating, useSubmitRating } from '@/hooks/useRatings'
import { formatOrderDate } from '@/lib/orderStatus'
import { averageRating } from '@/lib/rating'
import type { RatingCriteria } from '@/types/rating.types'

const CRITERIA_LABELS: { key: keyof RatingCriteria; label: string }[] = [
  { key: 'calidadProducto', label: 'Calidad del producto' },
  { key: 'tiempoEnvio', label: 'Tiempo de envío' },
  { key: 'atencion', label: 'Atención recibida' },
  { key: 'embalaje', label: 'Embalaje y presentación' },
]

const EMPTY_CRITERIA: RatingCriteria = { calidadProducto: 0, tiempoEnvio: 0, atencion: 0, embalaje: 0 }

export function RatingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading } = useOrder(orderId)
  const { data: existingRating } = useRating(orderId)
  const submitRating = useSubmitRating()

  const [criteria, setCriteria] = useState<RatingCriteria>(EMPTY_CRITERIA)
  const [comentario, setComentario] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-brand-border-soft/60" />
  }

  if (!order) {
    return <Navigate to="/portal/pedidos" replace />
  }

  const allRated = Object.values(criteria).every((v) => v > 0)

  const handleSubmit = () => {
    if (!orderId || !allRated) return
    submitRating.mutate({ orderId, criteria, comentario })
  }

  if (existingRating || submitRating.isSuccess) {
    const displayCriteria = existingRating?.criteria ?? criteria
    const avg = averageRating(displayCriteria)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h1 className="font-serif text-2xl font-semibold text-brand-dark">¡Gracias por tu calificación!</h1>
        <p className="text-sm text-brand-gray">Tu opinión sobre el pedido {order.id} fue registrada.</p>
        <div className="flex items-center gap-2">
          <StarRating value={avg} readOnly />
          <span className="text-sm font-bold text-brand-dark">{avg}/5</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/portal')} className="mt-4">
          Volver al dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">Califica tu experiencia</h1>
        <p className="mt-1 text-sm text-brand-gray">
          Pedido {order.id} · Entregado el {formatOrderDate(order.timeline.find((t) => t.status === 'entregado')?.date ?? order.createdAt)}
        </p>
      </div>

      <Card className="flex flex-col gap-5 p-6">
        {CRITERIA_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-brand-dark">{label}</span>
            <StarRating
              value={criteria[key]}
              onChange={(value) => setCriteria((prev) => ({ ...prev, [key]: value }))}
            />
          </div>
        ))}

        <Textarea
          label="Comentario (opcional)"
          placeholder="Cuéntanos más sobre tu experiencia..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={4}
        />

        <Button
          onClick={() => setShowConfirmModal(true)}
          disabled={!allRated || submitRating.isPending}
          className="w-full cursor-pointer"
        >
          {submitRating.isPending ? 'Enviando...' : 'Enviar calificación'}
        </Button>
        {!allRated && <p className="text-center text-xs text-brand-gray">Califica los 4 criterios para continuar.</p>}
      </Card>

      {/* Modal de confirmación para registrar calificación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false)
          handleSubmit()
        }}
        title="¿Confirmar calificación de entrega?"
        description={`Registrarás una evaluación promedio de ${averageRating(criteria)}/5 estrellas para el pedido ${order.id}. Tu retroalimentación nos ayuda a perfeccionar la atención logística de Megaingga.`}
        confirmText="Sí, enviar calificación"
        cancelText="Revisar"
        variant="brand"
        isPending={submitRating.isPending}
      />
    </div>
  )
}
