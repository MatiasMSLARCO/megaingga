# Feature Specification: Migración a Arquitectura Multi-Página

**Feature Branch**: `feature/002-multipage-routing`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Migración de la landing de una sola página a una arquitectura multi-página con react-router, manteniendo intacto todo el contenido, datos, tipos, servicios, hooks y componentes ya construidos en feature/001-redesign-and-b2b-ecommerce. Rutas: / (home con hero + resumen institucional), /nosotros, /servicios (catálogo con filtros), /servicios/:slug (ficha de producto como página completa en vez de modal), /proyectos (portafolio con filtros), /proyectos/:slug (caso de estudio completo por proyecto, ej. renovacion-resonancia-magnetica-hcam con el cliente Siemens Healthineers), /clientes, /contacto. El carrito de cotización (useQuoteCart, persistido en localStorage) y el flujo RFQ (QuoteDrawer + QuoteCheckoutModal) deben sobrevivir la navegación entre rutas via un layout raíz compartido. Motivación completa y análisis de qué se gana/pierde ya documentados en specs/001-redesign-and-b2b-ecommerce/spec.md sección 7 'Propuesta Futura: Migración a Arquitectura Multi-Página'."

---

## Contexto

`feature/001-redesign-and-b2b-ecommerce` implementó el rediseño institucional y el catálogo B2B como una landing de una sola página con navegación por anchors (`#nosotros`, `#servicios`, etc.). Al revisar el resultado, se detectó que contenido real de alto valor queda comprimido dentro de tarjetas en vez de tener espacio propio — el ejemplo más claro es el caso de obra **Siemens Healthineers en el Hospital Carlos Andrade Marín** (renovación de resonancia magnética), hoy una tarjeta más dentro de la grilla de "Proyectos". Lo mismo aplica a cada ficha de producto del catálogo (hoy resuelta como modal). Esta feature migra esa estructura a páginas reales, independientes y compartibles.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegación institucional por URL propia (Priority: P1)

**Como** visitante que llega desde un enlace externo o un buscador, **quiero** acceder directamente a la sección institucional que me interesa (Nosotros, Servicios, Proyectos, Clientes, Contacto) mediante su propia URL, **para** no depender de hacer scroll dentro de una única página larga.

**Why this priority**: Es la base de toda la migración — sin rutas reales, el resto de historias (ficha de producto, caso de proyecto) no tiene dónde vivir.

**Independent Test**: Visitar `/nosotros` directamente (sin pasar por `/`) y ver la sección completa renderizada con su propio título de pestaña.

**Acceptance Scenarios**:

1. **Given** un usuario con la URL `/servicios` guardada, **When** la abre directamente, **Then** ve el catálogo técnico completo sin pasar primero por el inicio.
2. **Given** un usuario navegando en cualquier página, **When** hace clic en un ítem del menú, **Then** la URL del navegador cambia a la ruta correspondiente y el título de la pestaña refleja la sección activa.
3. **Given** un usuario en cualquier página, **When** recarga el navegador (F5), **Then** la misma página se vuelve a renderizar correctamente, sin redirigir al inicio ni mostrar un error.

---

### User Story 2 - Ficha de producto compartible (Priority: P2)

**Como** encargado de adquisiciones, **quiero** recibir o compartir el enlace directo de un producto específico del catálogo, **para** que quien lo abra vea esa ficha técnica completa de inmediato, sin tener que buscarla manualmente en el catálogo.

**Why this priority**: Es el caso de uso comercial más directo del catálogo B2B — hoy la ficha es un modal sin URL propia, imposible de compartir.

**Independent Test**: Copiar la URL de un producto (ej. `/servicios/puertas-quirofano-acero-inox-304`), abrirla en una pestaña nueva y verificar que carga directamente esa ficha con toda su información y el botón de agregar a cotización funcional.

**Acceptance Scenarios**:

1. **Given** el catálogo técnico, **When** el usuario hace clic en un producto, **Then** navega a una página propia de ese producto (no un modal superpuesto).
2. **Given** la URL de un producto válido, **When** se abre en una pestaña nueva sin navegación previa, **Then** la página carga con las especificaciones, normas y galería completas.
3. **Given** la URL de un producto que no existe, **When** se visita, **Then** se muestra una página de error amigable con enlace de regreso al catálogo.

---

### User Story 3 - Caso de estudio de proyecto con espacio completo (Priority: P2)

**Como** cliente potencial evaluando la experiencia de la empresa, **quiero** ver el detalle completo de un proyecto ejecutado (ej. el caso Siemens Healthineers) en su propia página, **para** entender el alcance real sin que la información quede comprimida en una tarjeta de grilla.

**Why this priority**: Es el problema concreto que motivó esta migración — casos de obra reales merecen su propio espacio, no una tarjeta genérica.

**Independent Test**: Visitar `/proyectos/renovacion-resonancia-magnetica-hcam` directamente y verificar que se muestra el cliente, ubicación, descripción, alcance completo y galería de imágenes sin truncar.

**Acceptance Scenarios**:

1. **Given** el portafolio de proyectos, **When** el usuario hace clic en un proyecto, **Then** navega a una página propia con el detalle completo (no una tarjeta truncada).
2. **Given** la página de un proyecto destacado (ej. Siemens Healthineers), **When** se visualiza, **Then** se muestra el alcance completo (`scope`) sin el límite de "+N más" usado en la vista de grilla.

---

### User Story 4 - Cotizador RFQ persistente entre páginas (Priority: P3)

**Como** usuario que está armando una solicitud de cotización, **quiero** que mis productos seleccionados se mantengan visibles y disponibles sin importar a qué página navegue, **para** no perder mi progreso al explorar distintas secciones.

**Why this priority**: Es un requisito de continuidad, no de contenido nuevo — ya funciona hoy dentro de una sola página; migrar sin romperlo es el riesgo principal técnico de este cambio.

**Independent Test**: Agregar un producto a la cotización desde `/servicios`, navegar a `/proyectos` y luego a `/contacto`, abrir el panel de cotización y confirmar que el producto sigue ahí con la cantidad correcta.

**Acceptance Scenarios**:

1. **Given** productos agregados a la cotización, **When** el usuario navega a cualquier otra página de la web, **Then** el contador del badge en el navbar y el contenido del panel de cotización no cambian.
2. **Given** una solicitud de cotización en curso, **When** el usuario recarga el navegador en cualquier página, **Then** los ítems persisten (ya cubierto por `localStorage`, debe seguir funcionando igual tras la migración).

### Edge Cases

- ¿Qué pasa cuando se visita una URL de producto o proyecto con un slug que no existe? → Página 404 amigable, con mensaje claro y enlace de regreso al catálogo o portafolio correspondiente.
- ¿Qué pasa con los enlaces antiguos basados en anchors (`#nosotros`, `#servicios`) que alguien pueda tener guardados? → No deben romper la carga de la página; como mínimo deben llevar a una página válida (el inicio) en vez de un error.
- ¿Qué pasa si el usuario recarga el navegador estando en una ruta profunda (`/servicios/:slug`, `/proyectos/:slug`)? → Debe cargar exactamente esa página, no redirigir al inicio ni mostrar un error de servidor.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE exponer una URL propia y navegable para cada sección institucional (inicio, nosotros, servicios, proyectos, clientes, contacto).
- **FR-002**: El sistema DEBE permitir acceder a la ficha de cualquier producto del catálogo mediante una URL única y compartible, mostrando toda la información hoy disponible en el modal (especificaciones, normas, galería, acción de agregar a cotización).
- **FR-003**: El sistema DEBE permitir acceder al caso de estudio de cualquier proyecto mediante una URL única y compartible, mostrando el alcance completo sin truncar.
- **FR-004**: El sistema DEBE mantener el estado del carrito de cotización (ítems, cantidades) accesible, visible y sin pérdida de datos al navegar entre cualquier combinación de páginas.
- **FR-005**: El sistema DEBE mostrar una página de error amigable (404) cuando la URL solicitada no corresponde a ningún producto, proyecto o ruta válida, con un enlace de retorno a la sección correspondiente.
- **FR-006**: El sistema DEBE permitir recargar directamente cualquier ruta, incluyendo rutas profundas de producto o proyecto, y obtener el contenido correcto sin pasos de navegación adicionales.
- **FR-007**: Cada página DEBE exponer un título de pestaña del navegador propio y descriptivo, reflejando su contenido específico (ej. el nombre del producto o proyecto cuando aplique).
- **FR-008**: Las rutas antiguas basadas en anchors que pudieran estar guardadas o compartidas DEBEN seguir llevando a una página válida del sitio, nunca a un error.

### Key Entities

No se introducen entidades de datos nuevas. Esta feature reutiliza sin cambios de contrato las entidades ya definidas en `feature/001-redesign-and-b2b-ecommerce` (`Product`, `Project`, `QuoteItem`, `QuoteRequest`, `CompanyInfo`); el cambio es puramente de navegación y presentación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede compartir el enlace directo de un producto o proyecto específico, y otra persona que lo abra ve exactamente esa ficha completa sin pasos de navegación adicionales.
- **SC-002**: Cada página principal (inicio, nosotros, servicios, proyectos, clientes, contacto) es alcanzable mediante su propia URL y conserva un título de pestaña distinto y descriptivo.
- **SC-003**: El carrito de cotización conserva el 100% de sus ítems y cantidades al navegar entre cualquier combinación de páginas durante una misma sesión.
- **SC-004**: Visitar una URL de producto o proyecto inexistente muestra un mensaje de error claro en menos de 1 segundo, con opción de volver a la sección correspondiente.
- **SC-005**: El 100% de las rutas definidas responden correctamente ante una recarga directa del navegador, sin pérdida ni redirección inesperada de contenido.

## Assumptions

- Se reutiliza sin modificaciones de contrato toda la capa de tipos, datos mock, servicios y hooks ya construida en `feature/001-redesign-and-b2b-ecommerce`.
- El carrito de cotización sigue persistiendo vía `localStorage` (ya implementado en `useQuoteCart`); el cambio requerido es de ubicación en el árbol de componentes (pasa a vivir en un layout raíz compartido entre rutas), no de lógica.
- No se requiere renderizado del lado del servidor (SSR); el soporte de recarga directa en rutas profundas se resuelve a nivel de configuración de servidor estático (fallback a `index.html`), no como parte del alcance funcional de esta spec.
- Las URLs amigables de producto y proyecto se basan en los campos `slug` ya existentes en los datos mock (`products.mock.ts`, `projects.mock.ts`).
- El contenido, textos y criterios de aceptación visual (paleta, tipografía, estándares de calidad) definidos en `specs/001-redesign-and-b2b-ecommerce/spec.md` siguen vigentes sin cambios; esta spec cubre exclusivamente la reestructuración de navegación.
