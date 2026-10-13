import type { CompanyInfo } from '@/types/company.types'

// Teléfono/WhatsApp oficial fijado en .specify/memory/constitution.md (Principio III).
// Email: no existe en el contenido extraído de megaingga.com; placeholder basado en el dominio real.
export const companyInfo: CompanyInfo = {
  legalName: 'MEGA INGENIERÍA GARZON MEGAINGGA S.A.',
  brandName: 'Mega Ingeniería',
  country: 'Ecuador',
  officialPhone: '+593 998314070',
  whatsappNumber: '593998314070',
  contactEmail: 'contacto@megaingga.com',
  stats: [],
  mission:
    'Ofrecer soluciones en proyectos y mantenimiento en las áreas de ingeniería civil, mecánica, eléctrica y electrónica con altos estándares de calidad facilitando así los procesos industriales y de la construcción, enmarcados siempre en el mejoramiento continuo para contribuir al desarrollo económico de nuestros clientes, colaboradores y de nuestra sociedad.',
  vision:
    'Consolidarnos como una empresa líder en la prestación de servicios en soluciones de ingeniería, logrando un posicionamiento a nivel nacional con altos estándares de calidad en cuanto a recurso humano, técnico y tecnológico, superando así las expectativas de nuestros clientes a través de una labor eficiente y constante mejoramiento.',
  qualityPolicy:
    'OFERTAR PRODUCTOS Y SERVICIOS DE CALIDAD MEDIANTE EL CUMPLIMIENTO DE LOS REQUISITOS APLICABLES DE NUESTROS CLIENTES Y DE LA EMPRESA CON EL OBJETIVO DE OBTENER LA SATISFACCIÓN GLOBAL EN LA EJECUCIÓN DE NUESTROS PROYECTOS Y LA EFICIENCIA DE NUESTRO SISTEMA DE GESTIÓN.',
  values: [
    'Ética',
    'Imagen',
    'Respeto',
    'Innovación',
    'Compromiso',
    'Responsabilidad social',
    'Excelencia operacional',
    'Seguridad y medio ambiente',
  ],
}
