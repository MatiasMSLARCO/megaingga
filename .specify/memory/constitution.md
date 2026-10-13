# Mega Ingeniería (megaingga) Constitution

**Proyecto:** Rediseño Institucional y E-Commerce B2B para MEGA INGENIERÍA GARZON MEGAINGGA S.A.  
**Versión:** 1.0.0 | **Ratificado:** 2026-10-13 | **Estado:** Vigente  

---

## Principios Fundamentales (Innegociables)

### Principio I: Arquitectura en Capas Desacopladas (Strict Layering & TanStack Query)
El sistema debe mantener una separación rígida y unidireccional de responsabilidades. Ningún componente de interfaz accederá directamente a datos crudos o simulará llamadas asíncronas en línea:
1. **Entidades y Contratos (`src/types/`)**: Todos los modelos del dominio (`Product`, `Project`, `Division`, `QuoteItem`, `QuoteRequest`) deben declararse con TypeScript estricto. Son el contrato canónico.
2. **Capa de Servicios Simulada (`src/services/`)**: Los servicios encapsulan la lógica de acceso a datos (`products.service.ts`, `projects.service.ts`, etc.) implementando llamadas `async/await` con retardos de red realistas (200ms - 400ms) y estructuras reproducibles idénticas a una API REST real.
3. **Capa de Estado y Caché de Servidor (`src/hooks/`)**: El acceso a datos en la UI se realiza **exclusivamente** mediante `@tanstack/react-query` (`useQuery`, `useMutation`), gestionando estados de carga (`isLoading`), errores (`isError`) y caché automatizado.
4. **Componentes Modulares (`src/components/`)**:
   - `ui/`: Componentes atómicos de diseño reutilizables (Button, Input, Badge, Modal, Card).
   - `layout/`: Estructura global (Navbar sticky, Footer corporativo, QuoteDrawer flotante).
   - `features/`: Vistas y módulos de dominio organizados por contexto (`catalog`, `projects`, `quote`, `about`, `contact`).

### Principio II: Dirección Visual Industrial de Alta Gama (Bechtel + Arup Standards)
La estética del sitio debe transmitir máxima autoridad técnica, solvencia y estándares de ingeniería hospitalaria e industrial internacional:
1. **Paleta Corporativa Calibrada**:
   - Rojo Corporativo (Acento): `#E31E24`
   - Superficie Oscura (Hero / Footer / Secciones de contraste): `#141414`
   - Gris Técnico Medio: `#8B8B8D`
   - Fondo Principal / Tarjetas: `#FFFFFF`
   - Bordes y Separadores Sutiles: `#D9D9D9` / `#E5E7EB`
2. **Uso Quirúrgico del Rojo**: El rojo corporativo `#E31E24` se reserva para CTAs primarios, líneas indicadoras bajo encabezados, badges de estado activo y micro-interacciones. **Queda terminantemente prohibido el uso de fondos rojos masivos** o estilos tipo folleto promocional.
3. **Tipografía y Estructura**:
   - Titulares: Tipografía sans-serif condensada y geométrica en mayúsculas firmes, emulando la autoridad de Bechtel.
   - Cuerpo de texto: Tipografía neutra de alta legibilidad (`Inter` o sistema de alta gama), con amplio espacio en blanco y layout editorial estilo Arup.

### Principio III: Modelo E-commerce B2B & Cotizador RFQ (Request for Quote)
El e-commerce industrial no es una tienda minorista con pasarela de pago directo; funciona como un sistema integral de **especificación técnica y cotización comercial**:
1. **Catálogo con Especificaciones Reales**: Cada producto debe contar con categoría técnica (Hospitalario, Climatización HVAC, Equipos Especiales), atributos detallados, estado de disponibilidad y ficha técnica (datasheet) visualizable.
2. **Cotizador / Carrito Persistente**:
   - Los clientes pueden agregar productos, ajustar cantidades solicitadas y detallar notas o requerimientos específicos.
   - El estado del carrito debe persistir localmente (`localStorage`) para una experiencia de usuario fluida.
3. **Cierre de Cotización (RFQ Checkout)**:
   - Generación de resumen de cotización formal con número de referencia generado.
   - Opciones directas de exportación/descarga o enlace de envío directo preformateado a WhatsApp corporativo oficial (+593 998314070).

### Principio IV: Calidad de Código, Cero Regresiones y Verificación Continua
1. **Compilación y Tipado**: `tsc -b` debe compilar sin emitir un solo error o advertencia. Se prohíbe el uso de `any` sin justificación explícita.
2. **Análisis Estático**: `npm run lint` (Oxlint) debe mantenerse permanentemente en 0 errores y 0 advertencias.
3. **Accesibilidad y Rendimiento**: Código HTML semántico, imágenes con atributos `alt`, tiempos de respuesta interactivos instantáneos y navegación responsiva fluida en móvil, tablet y escritorio.

---

## Restricciones Tecnológicas del Proyecto

| Área | Tecnología / Biblioteca | Propósito |
|---|---|---|
| **Runtime & Bundler** | Vite 8 + React 19 + TypeScript | Base del frontend SPA |
| **Estilos** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utilidades atómicas y variables de diseño |
| **Data Fetching / Cache** | `@tanstack/react-query` | Consumo asíncrono y caché de servicios mock |
| **Iconografía** | `lucide-react` | Iconos técnicos coherentes |
| **Utilidades de clase** | `clsx` + `tailwind-merge` (`cn()`) | Composición condicional de estilos |

---

## Gobernanza y Flujo de Desarrollo (SDD)

1. **Jerarquía Viva**: Todo cambio arquitectural o nueva funcionalidad debe nacer de la secuencia:
   ```text
   constitution.md → spec.md (QUÉ/POR QUÉ) → plan.md (CÓMO TÉCNICO) → tasks.md → código
   ```
2. **Spec-as-Source**: Las especificaciones y planes contenidos en el repositorio son la única fuente de verdad. El código implementado debe reflejar exactamente los criterios de aceptación especificados.
3. **Criterio de Aceptación (BDD & EARS)**: Cada historia de usuario debe contar con escenarios verificables `Given - When - Then` antes de ser considerada terminada.
