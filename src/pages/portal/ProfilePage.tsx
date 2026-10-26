import { useState } from 'react'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useAuth } from '@/context/AuthContext'

export function ProfilePage() {
  const { session } = useAuth()
  const [fullName, setFullName] = useState(session?.user.fullName ?? '')
  const [companyName, setCompanyName] = useState(session?.user.companyName ?? '')
  const [email, setEmail] = useState(session?.user.email ?? '')
  const [phone, setPhone] = useState(session?.user.phone ?? '')
  const [saved, setSaved] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleSave = () => {
    setShowConfirmModal(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark">Mi Perfil</h1>
        <p className="mt-1 text-sm text-brand-gray">Datos básicos de tu cuenta.</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-dark text-lg font-bold text-white">
            {session?.user.avatarInitials}
          </span>
          <div>
            <p className="text-sm font-bold text-brand-dark">{session?.user.fullName}</p>
            <p className="text-xs text-brand-gray">{session?.user.companyName}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <Button
          onClick={() => setShowConfirmModal(true)}
          className="mt-6 w-full gap-2 cursor-pointer"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Guardado
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </Card>

      {/* Modal de confirmación para guardar cambios */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSave}
        title="¿Guardar cambios del perfil?"
        description="¿Deseas actualizar los datos de contacto y de la empresa asociados a tu cuenta de cliente en Megaingga?"
        confirmText="Guardar cambios"
        cancelText="Cancelar"
        variant="brand"
      />
    </div>
  )
}
