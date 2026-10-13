# Data Model: Rediseño Institucional y E-Commerce B2B

**Feature**: `001-redesign-and-b2b-ecommerce`  
**Estado**: Validado  

---

## 1. Entidades Principales

### `Product` (Catálogo de Soluciones y Equipos)
Representa un equipo, material o solución técnica ofertada por Mega Ingeniería.

```typescript
export type ProductDivision = 
  | 'hospitalario'    // Acabados hospitalarios (paneles, puertas, pisos conductivos)
  | 'climatizacion'   // Climatización HVAC industrial/médica (chillers, manejadoras)
  | 'especiales'      // Equipos y montajes especiales

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  division: ProductDivision
  category: string
  shortDescription: string
  fullDescription: string
  specifications: ProductSpecification[]
  standards: string[]          // ej. ["ISO 14644", "ASHRAE 170", "FDA / GMP"]
  imageUrl: string
  gallery?: string[]
  datasheetAvailable: boolean
  featured: boolean
}
```

---

### `Project` (Portafolio de Obras y Proyectos Ejecutados)
Representa una obra civil, mecánica, eléctrica u hospitalaria ejecutada por la empresa.

```typescript
export type ProjectDivision = 
  | 'hospitalario'
  | 'civil'
  | 'mecanico'
  | 'electrico'

export interface Project {
  id: string
  slug: string
  title: string
  division: ProjectDivision
  clientName: string
  location: string             // ej. "Quito, Ecuador", "Guayaquil"
  year: number
  description: string
  scope: string[]              // Actividades realizadas
  mainImageUrl: string
  galleryImages: string[]
  featured: boolean
}
```

---

### `QuoteItem` & `QuoteRequest` (Cotizador B2B / Carrito RFQ)
Modelo para la selección de equipos y formalización de solicitudes de cotización.

```typescript
export interface QuoteItem {
  productId: string
  product: Product
  quantity: number
  customNotes?: string
}

export interface QuoteCustomerData {
  fullName: string
  companyName: string
  email: string
  phone: string
  cityOrProjectLocation: string
  projectScopeNotes?: string
}

export interface QuoteRequest {
  id: string                   // ej. "RFQ-2026-8941"
  customer: QuoteCustomerData
  items: QuoteItem[]
  totalItemsCount: number
  createdAt: string
  status: 'draft' | 'generated' | 'sent_whatsapp'
}
```

---

### `CompanyInfo` (Datos Canónicos de Mega Ingeniería)
Fuente única de verdad para datos de contacto, misión, visión y estadísticas extraídas de la empresa.

```typescript
export interface CompanyStat {
  value: string
  label: string
  suffix?: string
}

export interface CompanyInfo {
  legalName: string            // "MEGA INGENIERÍA GARZON MEGAINGGA S.A."
  brandName: string            // "Mega Ingeniería"
  country: string              // "Ecuador"
  officialPhone: string        // "+593 998314070"
  whatsappNumber: string       // "593998314070"
  contactEmail: string
  stats: CompanyStat[]
  mission: string
  vision: string
  qualityPolicy: string
  values: string[]
}
```
