import { type FormEvent, useState } from 'react'
import { CheckCircle2, Mail, MessageCircle, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { companyInfo } from '@/data/company.data'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isValid = name.trim().length > 0 && (email.trim().length > 0 || phone.trim().length > 0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
  }

  const ref = useScrollReveal<HTMLElement>({ stagger: 0.12 })

  return (
    <section ref={ref} id="contacto" className="blueprint-grid-dark bg-brand-ink py-24 scroll-mt-16">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div data-reveal>
          <SectionHeading
            eyebrow="Contacto"
            tone="dark"
            title={
              <>
                Hablemos de tu <span className="italic text-brand-red">proyecto</span>.
              </>
            }
            subtitle="Escríbenos directamente o completa el formulario y te contactaremos a la brevedad."
          />

          <div className="mt-8 flex flex-col gap-4">
            <a
              href={`https://wa.me/${companyInfo.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm font-semibold text-[#f4efe2] transition-colors hover:text-brand-red"
            >
              <MessageCircle className="h-5 w-5 text-brand-red" />
              {companyInfo.officialPhone}
            </a>
            <a
              href={`mailto:${companyInfo.contactEmail}`}
              className="flex items-center gap-3 text-sm font-semibold text-[#f4efe2] transition-colors hover:text-brand-red"
            >
              <Mail className="h-5 w-5 text-brand-red" />
              {companyInfo.contactEmail}
            </a>
            <span className="flex items-center gap-3 text-sm font-semibold text-[#f4efe2]">
              <Phone className="h-5 w-5 text-brand-red" />
              {companyInfo.country}
            </span>
          </div>
        </div>

        {submitted ? (
          <div
            data-reveal
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white p-8 sm:p-12 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">¡Mensaje Enviado con Éxito!</h3>
            <p className="text-xs text-brand-gray max-w-sm leading-relaxed">
              Gracias, <strong>{name}</strong>. Hemos recibido tu requerimiento y nuestro equipo de ingeniería te contactará a la brevedad.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubmitted(false)
                setName('')
                setEmail('')
                setPhone('')
                setMessage('')
              }}
              className="mt-3 text-xs"
            >
              Enviar otro mensaje
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            data-reveal
            className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white p-6 sm:p-8"
          >
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
            <Button type="submit" disabled={!isValid} className="mt-2 w-fit gap-2">
              <Send className="h-4 w-4" />
              <span>Enviar</span>
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
