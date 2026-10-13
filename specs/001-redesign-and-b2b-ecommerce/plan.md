# Implementation Plan: Rediseño Institucional y E-Commerce B2B (Demo)

**Branch**: `feature/001-redesign-and-b2b-ecommerce`  
**Date**: 2026-10-13  
**Spec**: [spec.md](./spec.md) | **Data Model**: [data-model.md](./data-model.md)  

---

## 1. Resumen Ejecutivo
Transformar la aplicación en una experiencia web corporativa de estándar internacional (inspirada en Bechtel y Arup) para MEGA INGENIERÍA GARZON MEGAINGGA S.A. Se integrará un catálogo técnico de soluciones y un sistema de cotización B2B (RFQ) interactivo y simulado mediante una capa de servicios asíncronos y **TanStack Query**.

---

## 2. Contexto Técnico y Dependencias

- **Framework**: React 19 + Vite 8
- **Lenguaje**: TypeScript (Modo estricto, alias `@/*`)
- **Estilos**: Tailwind CSS v4 (`@tailwindcss/vite`) con tokens de diseño (#E31E24, #141414, #8B8B8D)
- **Caché y Asincronía**: `@tanstack/react-query` (v5)
- **Persistencia**: LocalStorage (para el carrito de cotización RFQ)
- **Iconos**: `lucide-react`
- **Linter**: `oxlint`

---

## 3. Chequeo de Constitución (Constitution Gates)

| Principio | Criterio de Cumplimiento | Estado |
|---|---|---|
| **I. Capas Desacopladas** | Types aislados en `src/types/`, llamadas mediante `src/services/` y consumidas exclusivamente con hooks `@tanstack/react-query`. | ✅ Planificado |
| **II. Estética Bechtel + Arup** | Fondo oscuro en Hero/Footer (`#141414`), rojo `#E31E24` limitado a acentos/CTAs, tipografía técnica, video real en Hero (`hero-video.mp4`). | ✅ Planificado |
| **III. Cotizador B2B (RFQ)** | Carrito persistente, generador de folio RFQ, enlace automático a WhatsApp corporativo oficial (+593 998314070). | ✅ Planificado |
| **IV. Cero Regresiones** | Verificaciones obligatorias de `tsc -b` y `npm run lint` en cada hito. | ✅ Planificado |

---

## 4. Estructura de Archivos del Proyecto

```text
src/
├── types/
│   ├── product.types.ts           # Interfaces de catálogo y divisiones
│   ├── project.types.ts           # Interfaces de obras y portafolio
│   └── quote.types.ts             # Interfaces de cotizador y RFQ
├── data/
│   ├── company.data.ts            # Misión, visión, política, valores y estadísticas
│   ├── products.mock.ts           # Catálogo con fotos y specs extraídas
│   └── projects.mock.ts           # Obras civiles, mecánicas, hospitalarias
├── services/
│   ├── delay.ts                   # Simulador de latencia de red (Promise con jitter)
│   ├── products.service.ts        # getProducts, getProductBySlug, getCategories
│   ├── projects.service.ts        # getProjects, getProjectById
│   └── quote.service.ts           # submitQuoteRequest, generateRFQFolio
├── hooks/
│   ├── useProducts.ts             # TanStack useQuery para catálogo
│   ├── useProjects.ts             # TanStack useQuery para obras
│   └── useQuoteCart.ts            # Hook personalizado de carrito con persistencia
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── layout/
│   │   ├── Navbar.tsx             # Sticky con selector de pestañas y botón RFQ
│   │   ├── Footer.tsx             # Estilo Bechtel/Arup #141414
│   │   └── QuoteDrawer.tsx        # Panel lateral deslizante de cotización
│   ├── sections/
│   │   ├── HeroSection.tsx        # Video hero real + métricas
│   │   ├── AboutSection.tsx       # Misión, visión, política y valores
│   │   ├── ServicesSection.tsx    # Cuadrícula de especialidades
│   │   ├── ProjectsSection.tsx    # Portafolio filtrable
│   │   ├── ClientsSection.tsx     # Logos y referencias
│   │   └── ContactSection.tsx     # Formulario formal y mapa/dirección
│   └── catalog/
│       ├── ProductCard.tsx
│       ├── ProductFilters.tsx
│       └── ProductDetailModal.tsx # Ficha técnica con atributos
├── lib/
│   ├── utils.ts                   # cn()
│   └── queryClient.ts             # Instancia configurada de QueryClient
├── App.tsx                        # Orquestador de vistas
└── main.tsx                       # QueryClientProvider wrapper
```

---

## 5. Fases de Ejecución

1. **Fase 1: Configuración de Infraestructura**:
   - Instalación de `@tanstack/react-query`.
   - Creación de `src/lib/queryClient.ts` y envoltura en `src/main.tsx`.
   - Configuración de tokens de color y fuentes en `src/index.css`.

2. **Fase 2: Capa de Dominio (Types, Mock Data & Services)**:
   - Implementación de `src/types/*.ts`.
   - Carga de datos reales de Mega Ingeniería en `src/data/*.ts`.
   - Implementación de servicios asíncronos con retardo en `src/services/*.ts`.

3. **Fase 3: Capa de Estado & Hooks TanStack Query**:
   - `useProducts`, `useProjects`, `useQuoteCart`.

4. **Fase 4: Componentes UI & Layout Corporativo**:
   - `Navbar`, `Footer`, `QuoteDrawer`, `Button`, `Badge`, `Modal`.

5. **Fase 5: Módulos de Secciones y Catálogo B2B**:
   - Implementación de las 6 vistas principales: Inicio (video + stats), Nosotros, Servicios/Catálogo, Proyectos, Clientes, Contacto.
   - Integración del flujo completo de cotización hacia WhatsApp.

6. **Fase 6: Verificación y Auditoría**:
   - `tsc -b`, `npm run lint`, `npm run build`.
