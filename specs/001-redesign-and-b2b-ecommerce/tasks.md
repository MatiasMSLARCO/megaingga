# Tasks: Rediseño Institucional y E-Commerce B2B (Demo)

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md)  
**Branch**: `feature/001-redesign-and-b2b-ecommerce`  

---

## Phase 1: Setup & Infraestructura Compartida

**Propósito**: Preparación de dependencias, assets multimedia y configuración del cliente de datos.

- [X] T001 Instalar dependencias `@tanstack/react-query`
- [X] T002 Copiar y organizar assets multimedia (`hero-video.mp4`, imágenes de obras y logos) desde `docs/superpowers/docs-redesign/resources/` hacia `public/assets/`
- [X] T003 Configurar tokens de diseño corporativo (Rojo `#E31E24`, Superficie `#141414`, Gris `#8B8B8D`) en `src/index.css`
- [X] T004 [P] Crear instancia configurada de `QueryClient` en `src/lib/queryClient.ts` y envolver la aplicación en `src/main.tsx`

---

## Phase 2: Capa Fundacional (Types, Mock Data & Servicios Asíncronos)

**Propósito**: Contratos de datos inmutables y simulación asíncrona tipo REST API.

- [X] T005 [P] Implementar contratos de tipos TypeScript en `src/types/product.types.ts`, `src/types/project.types.ts`, `src/types/quote.types.ts`
- [X] T006 [P] Implementar `src/data/company.data.ts` con la información corporativa real (Misión, Visión, Valores, Métricas)
- [X] T007 [P] Implementar `src/data/products.mock.ts` y `src/data/projects.mock.ts` con especificaciones técnicas completas y rutas de imágenes
- [X] T008 Implementar simulador de latencia y red en `src/services/delay.ts`
- [X] T009 Implementar servicios asíncronos en `src/services/products.service.ts`, `src/services/projects.service.ts`, `src/services/quote.service.ts`
- [X] T010 Implementar custom hooks con TanStack Query en `src/hooks/useProducts.ts`, `src/hooks/useProjects.ts`, `src/hooks/useQuoteCart.ts`

**Checkpoint**: Base de datos simulada y hooks reactivos listos y tipados al 100%.

---

## Phase 3: Componentes Atómicos UI & Layout Global

**Propósito**: Elementos atómicos y marco de navegación corporativo con estética Bechtel + Arup.

- [X] T011 [P] Implementar componentes atómicos de diseño en `src/components/ui/` (`Button.tsx`, `Badge.tsx`, `Modal.tsx`, `Card.tsx`, `Input.tsx`, `Textarea.tsx`)
- [X] T012 Implementar barra de navegación sticky en `src/components/layout/Navbar.tsx` con selector de 6 pestañas, logo corporativo y botón del cotizador
- [X] T013 Implementar pie de página corporativo en `src/components/layout/Footer.tsx` en `#141414` con enlaces institucionales, datos de contacto y copyright
- [X] T014 Implementar panel lateral deslizante de cotización en `src/components/quote/QuoteDrawer.tsx` con listado de ítems, selector de cantidades y totalizador

---

## Phase 4: User Story 1 - Presencia Institucional y Autoridad Corporativa (P1) 🎯 MVP

**Propósito**: Entrega de la portada y vistas corporativas con contenido migrado.

- [X] T015 [US1] Implementar `src/components/sections/HeroSection.tsx` con reproducción de video en loop, titular en mayúsculas y franja de métricas tipo Bechtel (franja de métricas omitida: sin datos reales, decisión de usuario)
- [X] T016 [US1] Implementar `src/components/sections/AboutSection.tsx` con Misión, Visión, Política de Calidad y grid de los 8 Valores corporativos
- [X] T017 [US1] Implementar `src/components/sections/ClientsSection.tsx` con showcase de clientes y referencias de Mega Ingeniería
- [X] T018 [US1] Implementar `src/components/sections/ContactSection.tsx` con formulario formal de contacto y enlace directo a WhatsApp corporativo

**Checkpoint**: Toda la experiencia institucional es navegable, responsiva y funcional.

---

## Phase 5: User Story 2 & 3 - Catálogo Técnico & Cotizador B2B RFQ (P2 & P3)

**Propósito**: Experiencia interactiva de catálogo con especificaciones y formalización de solicitudes de cotización.

- [X] T019 [US2] Implementar `src/components/catalog/ProductCard.tsx` y barra de filtrado por categoría en `src/components/catalog/ProductFilters.tsx`
- [X] T020 [US2] Implementar modal de ficha técnica en `src/components/catalog/ProductDetailModal.tsx` con atributos técnicos, normas y botón para agregar al cotizador
- [X] T021 [US3] Conectar acciones de agregar/quitar productos con el hook `useQuoteCart` y persistencia en `localStorage`
- [X] T022 [US3] Implementar `src/components/quote/QuoteCheckoutModal.tsx` para generar folio formal RFQ (`RFQ-2026-XXXX`) y redireccionar a WhatsApp oficial con mensaje preformateado

**Checkpoint**: Catálogo B2B y cotizador RFQ 100% operativos.

---

## Phase 6: User Story 4 - Portafolio de Obras y Proyectos Ejecutados (P4)

**Propósito**: Showcase de proyectos civiles, mecánicos, eléctricos y hospitalarios.

- [X] T023 [US4] Implementar `src/components/sections/ProjectsSection.tsx` con filtros por disciplina técnica, tarjetas de proyectos y galería de imágenes de obra real

---

## Phase 7: Orquestación, Pulido & Verificación

**Propósito**: Integración final, verificación de compilación y pruebas de calidad.

- [X] T024 Orquestar la navegación y las vistas completas en `src/App.tsx`
- [X] T025 Ejecutar validación de escenarios en `quickstart.md` (5/5 escenarios verificados en navegador real vía Playwright, 0 errores de consola)
- [X] T026 Ejecutar `tsc -b` y `npm run lint` asegurando 0 errores y 0 advertencias
- [ ] T027 Commit y push de la versión completada
