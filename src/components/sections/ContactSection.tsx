import { type FormEvent, useState } from 'react'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { companyInfo } from '@/data/company.data'

export function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const isValid = name.trim().length > 0 && (email.trim().length > 0 || phone.trim().length > 0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    const text = [
      `Hola ${companyInfo.brandName}, mi nombre es ${name}.`,
      email && `Correo: ${email}`,
      phone && `Teléfono: ${phone}`,
      message && `Mensaje: ${message}`,
    ]
      .filter(Boolean)
      .join('\n')

    window.open(`https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section id="contacto" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-brand-dark sm:text-4xl">
            Hablemos de tu proyecto
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-red" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-gray">
            Escríbenos directamente o completa el formulario y te contactaremos por WhatsApp corporativo.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <a
              href={`https://wa.me/${companyInfo.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-red"
            >
              <MessageCircle className="h-5 w-5 text-brand-red" />
              {companyInfo.officialPhone}
            </a>
            <a
              href={`mailto:${companyInfo.contactEmail}`}
              className="flex items-center gap-3 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-red"
            >
              <Mail className="h-5 w-5 text-brand-red" />
              {companyInfo.contactEmail}
            </a>
            <span className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
              <Phone className="h-5 w-5 text-brand-red" />
              {companyInfo.country}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Teléfono" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Textarea
            label="Mensaje"
            placeholder="Cuéntanos sobre tu proyecto..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" disabled={!isValid} className="mt-2 w-fit">
            Enviar por WhatsApp
          </Button>
        </form>
      </div>
    </section>
  )
}
