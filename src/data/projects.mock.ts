import type { Project } from '@/types/project.types'

// Portafolio extraído de megaingga.com. El caso "Siemens Healthineers" es el único
// proyecto con cliente/ubicación nombrados en el contenido real; el resto de divisiones
// solo exponían listas de alcance de servicio (sin cliente/año específico), por lo que
// se agrupan como showcase divisional con los datos reales de alcance verbatim.
export const projectsMock: Project[] = [
  {
    id: 'proj-01',
    slug: 'renovacion-resonancia-magnetica-hcam',
    title: 'Renovación de Equipo de Resonancia Magnética',
    division: 'hospitalario',
    clientName: 'Siemens Healthineers',
    location: 'Hospital Carlos Andrade Marín, Quito, Ecuador',
    // Año no confirmado en el contenido real (corresponde a la fecha de publicación
    // del artículo, 7 de junio de 2024); se usa como mejor referencia disponible.
    year: 2024,
    description:
      'Proyecto de renovación de equipo médico (resonancia magnética), remodelación integral del área e ingreso de nuevo equipo.',
    scope: [
      'Remodelación integral del área de resonancia magnética',
      'Desinstalación y disposición del equipo médico anterior',
      'Ingreso e instalación de nuevo equipo de resonancia magnética',
      'Acabados hospitalarios: vinil conductivo, protecciones de pared y puertas plomadas de blindaje',
    ],
    mainImageUrl: '/assets/images/projects/hospitalario-siemens-1.jpeg',
    galleryImages: [
      '/assets/images/projects/hospitalario-siemens-2.jpeg',
      '/assets/images/products/acabados-hospitalarios-2.jpeg',
    ],
    featured: true,
  },
  {
    id: 'proj-02',
    slug: 'infraestructura-civil-hospitalaria',
    title: 'Infraestructura Hospitalaria, Estructuras Metálicas y Sistemas Hidráulicos',
    division: 'civil',
    clientName: 'Clientes corporativos e industriales (múltiples proyectos)',
    location: 'Ecuador',
    year: 2024,
    description:
      'Capacidad de ejecución civil de Mega Ingeniería en infraestructura hospitalaria, estructuras metálicas y sistemas hidráulicos.',
    scope: [
      'Diseño y construcción de quirófanos',
      'Diseño y construcción de salas de UCI',
      'Infraestructura general hospitalaria',
      'Galpones industriales y estructuras metálicas',
      'Sistemas de presión constante',
      'Sistemas de aguas residuales',
      'Cimentaciones',
    ],
    mainImageUrl: '/assets/images/projects/civil-1.jpg',
    galleryImages: ['/assets/images/projects/division-overview-1.jpg', '/assets/images/projects/division-overview-2.jpg'],
    featured: false,
  },
  {
    id: 'proj-03',
    slug: 'sistemas-contraincendio-vapor-climatizacion',
    title: 'Sistemas Contra Incendio, Vapor y Climatización Industrial',
    division: 'mecanico',
    clientName: 'Clientes corporativos e industriales (múltiples proyectos)',
    location: 'Ecuador',
    year: 2024,
    description:
      'Capacidad de ejecución mecánica en sistemas contra incendio, generación de vapor y climatización industrial.',
    scope: [
      'Diseño y construcción de redes contra incendio',
      'Montaje de bombas eléctricas, motobombas y jockey',
      'Mantenimiento de redes y bombas de sistemas contra incendio',
      'Diseño y construcción de sistemas de vapor y bombeo de combustible',
      'Montaje y mantenimiento de calderas',
      'Asistencia técnica para sistemas de vapor',
      'Sistema de aire acondicionado y ventilación',
    ],
    mainImageUrl: '/assets/images/projects/mecanico-1.jpeg',
    galleryImages: ['/assets/images/projects/mecanico-2.jpeg'],
    featured: false,
  },
  {
    id: 'proj-04',
    slug: 'media-baja-tension-generacion',
    title: 'Media y Baja Tensión, Tableros y Sistemas de Generación',
    division: 'electrico',
    clientName: 'Clientes corporativos e industriales (múltiples proyectos)',
    location: 'Ecuador',
    year: 2024,
    description:
      'Capacidad de ejecución eléctrica en media y baja tensión, tableros de potencia/control y sistemas de generación.',
    scope: [
      'Montaje de transformadores de media tensión',
      'Montaje de líneas de media tensión',
      'Fabricación de tableros de potencia y control',
      'Montaje de líneas de puesta a tierra',
      'Montaje de acometidas eléctricas',
      'Montaje y mantenimiento de equipos de generación',
    ],
    mainImageUrl: '/assets/images/projects/division-overview-3.jpg',
    galleryImages: ['/assets/images/projects/division-overview-4.jpeg'],
    featured: false,
  },
]
