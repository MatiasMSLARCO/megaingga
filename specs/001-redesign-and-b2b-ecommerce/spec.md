# Feature Specification: Rediseño Institucional y E-Commerce B2B (Demo)

**Feature Branch**: `feature/001-redesign-and-b2b-ecommerce`  
**Created**: 2026-10-13  
**Status**: Draft  
**Input**: Rediseño integral de megaingga.com basado en dirección visual Bechtel + Arup, catálogo de productos y cotizador B2B (RFQ) interactivo simulado.  

---

## 1. Contexto y Objetivos

MEGA INGENIERÍA GARZON MEGAINGGA S.A. es una compañía ecuatoriana líder en diseño y construcción de infraestructura hospitalaria, climatización industrial (HVAC) y proyectos de ingeniería civil, mecánica y eléctrica. Su presencia digital actual adolece de problemas severos de credibilidad, duplicación de contenidos y obsolescencia visual.

Este documento especifica la transformación integral del portal web en una experiencia digital corporativa de estándar internacional, integrando un catálogo de soluciones y un sistema de cotización B2B sin requerir backend en esta fase (Demo interactiva y funcional).

---

## 2. Historias de Usuario Priorizadas (User Journeys)

### User Story 1 - Navegación Institucional y Autoridad Corporativa (Prioridad: P1)
**Como** tomador de decisiones hospitalario, industrial o corporativo,  
**Quiero** navegar por un portal institucional sobrio, moderno y veloz estructurado en 6 áreas claras (Inicio, Nosotros, Servicios, Proyectos, Clientes, Contacto),  
**Para** evaluar la capacidad técnica, certificaciones y solvencia de Mega Ingeniería antes de iniciar una contratación.

- **Por qué esta prioridad**: Es la base reputacional de la empresa. Sin una presentación institucional impecable, ningún cliente confiará en sus servicios de alta ingeniería.
- **Prueba Independiente**: Un usuario puede recorrer todas las secciones, visualizar el video de obra en el hero, conocer la misión, valores y clientes, y enviar un mensaje de contacto directo.

**Criterios de Aceptación (BDD)**:
1. **Escenario: Portada con video y métricas de impacto**
   - **Given** que un visitante ingresa a la portada del sitio,
   - **When** se carga la sección Hero,
   - **Then** el visitante visualiza el video de obra real en loop con overlay de contraste, el titular de propósito corporativo en mayúsculas ("INGENIERÍA Y CONSTRUCCIÓN DE INFRAESTRUCTURA HOSPITALARIA E INDUSTRIAL") y una franja de indicadores métricos cuantitativos (proyectos ejecutados, años de experiencia, clientes atendidos).
2. **Escenario: Navegación limpia y sticky**
   - **Given** que el usuario hace scroll hacia abajo en cualquier vista,
   - **When** rebasa la altura de la cabecera,
   - **Then** la barra de navegación permanece visible en la parte superior con acceso directo a las 6 áreas principales y un botón de acción rápida para cotizar.
3. **Escenario: Identidad corporativa y trayectoria**
   - **Given** que el usuario accede a la sección "Nosotros",
   - **When** explora la página,
   - **Then** se presentan los pilares de la empresa (Misión, Visión, Política de Calidad y los 8 Valores corporativos) con diseño editorial estructurado.

---

### User Story 2 - Exploración del Catálogo de Productos y Soluciones (Prioridad: P2)
**Como** arquitecto hospitalario, jefe de mantenimiento o director de compras,  
**Quiero** explorar un catálogo técnico organizado por líneas de especialidad (Acabados Hospitalarios, Equipos de Climatización HVAC, Equipos Especiales),  
**Para** conocer especificaciones detalladas, normativas aplicables y productos disponibles para mis proyectos.

- **Por qué esta prioridad**: Permite a los clientes técnicos encontrar exactamente los suministros y equipos que necesitan sin navegar por páginas rotas o desorganizadas.
- **Prueba Independiente**: El usuario puede filtrar por categoría, buscar por nombre técnico y abrir la vista detallada de cualquier producto para ver sus especificaciones y fotografías.

**Criterios de Aceptación (BDD)**:
1. **Escenario: Filtrado dinámico por categoría técnica**
   - **Given** que el usuario se encuentra en la vista de Catálogo / Servicios,
   - **When** selecciona el filtro "Acabados Hospitalarios",
   - **Then** la cuadrícula de productos actualiza su contenido de forma inmediata mostrando únicamente elementos de esa división (puertas herméticas, pisos vinílicos conductivos, paneles sanitarios, protectores de pared).
2. **Escenario: Búsqueda rápida por palabra clave**
   - **Given** que el usuario ingresa un término en la barra de búsqueda (ej. "chiller" o "quirófano"),
   - **When** el texto supera los 2 caracteres,
   - **Then** la vista filtra los ítems coincidentes en tiempo real mostrando el conteo de resultados encontrados.
3. **Escenario: Ficha técnica y especificaciones**
   - **Given** que el usuario hace clic en un producto del catálogo,
   - **When** se abre el detalle o modal de especificación técnica,
   - **Then** se muestran las características técnicas, normas de conformidad (ISO/ASHRAE), galería de imágenes y opción para agregar al cotizador.

---

### User Story 3 - Sistema de Cotización B2B / Carrito RFQ (Prioridad: P3)
**Como** encargado de adquisiciones,  
**Quiero** seleccionar productos del catálogo, indicar cantidades estimadas y generar una Solicitud de Cotización (RFQ) formal con opción de envío directo por WhatsApp corporativo,  
**Para** recibir una propuesta económica formal sin trámites lentos.

- **Por qué esta prioridad**: Es el motor comercial de la plataforma; convierte el interés técnico en una oportunidad de negocio real.
- **Prueba Independiente**: El usuario añade productos al carrito, abre el panel de cotización, ajusta unidades, completa sus datos y genera la orden con enlace directo a WhatsApp.

**Criterios de Aceptación (BDD)**:
1. **Escenario: Incorporación de productos a la solicitud**
   - **Given** que el usuario visualiza un producto en el catálogo,
   - **When** pulsa el botón "Agregar a Cotización",
   - **Then** el contador del carrito se actualiza visiblemente en la barra superior y se muestra una confirmación visual no invasiva.
2. **Escenario: Gestión y persistencia del cotizador**
   - **Given** que el usuario tiene ítems en su cotizador y recarga la página,
   - **When** vuelve a abrir el panel del cotizador,
   - **Then** los ítems y cantidades se mantienen intactos (persistencia local).
3. **Escenario: Envío y formalización de la solicitud**
   - **Given** que el cotizador contiene al menos un producto,
   - **When** el usuario ingresa sus datos (Nombre, Empresa, Correo, Teléfono) y presiona "Solicitar Cotización vía WhatsApp",
   - **Then** el sistema genera un identificador único (ej. `RFQ-2026-XXXX`), muestra la confirmación en pantalla y abre una conversación de WhatsApp con el número corporativo (+593 998314070) con el mensaje desglosado y codificado.

---

### User Story 4 - Galería y Showcase de Proyectos Ejecutados (Prioridad: P4)
**Como** cliente potencial,  
**Quiero** examinar obras y proyectos reales organizados por especialidad (Civiles, Mecánicos, Eléctricos, Hospitalarios),  
**Para** constatar la experiencia práctica en campo y la calidad de terminación de Mega Ingeniería.

- **Por qué esta prioridad**: Refuerza la credibilidad y el historial de ejecución tangible de la empresa.
- **Prueba Independiente**: El usuario puede filtrar proyectos por disciplina y ver fotografías de obra real.

**Criterios de Aceptación (BDD)**:
1. **Escenario: Filtrado de portafolio de proyectos**
   - **Given** que el visitante está en la sección "Proyectos",
   - **When** alterna entre las pestañas "Todos", "Hospitalarios", "Mecánicos", "Eléctricos" y "Civiles",
   - **Then** las tarjetas de proyectos se reorganizan mostrando fotografías de las obras registradas con su ubicación y alcance técnico.

---

## 3. Requisitos Funcionales (Sintaxis EARS)

- **FR-001**: El sistema DEBERÁ proporcionar una navegación fluida entre las 6 secciones clave: Inicio, Nosotros, Servicios, Proyectos, Clientes y Contacto.
- **FR-002**: En la portada, el sistema DEBERÁ reproducir en ciclo continuo el video de obras sin audio y con superposición de contraste para garantizar legibilidad del texto.
- **FR-003**: Cuando el usuario filtre el catálogo por división o categoría, el sistema DEBERÁ actualizar los productos visibles sin recargar la página completa.
- **FR-004**: Cuando el usuario añada un producto a la cotización, el sistema DEBERÁ actualizar el badge de conteo en la cabecera y conservar el estado en el almacenamiento del navegador.
- **FR-005**: Cuando se envíe el formulario de cotización, el sistema DEBERÁ generar un número de folio correlativo único y generar un enlace de WhatsApp con el detalle formateado para el número +593 998314070.
- **FR-006**: El sistema DEBERÁ mostrar estados de carga visuales (esqueletos o indicadores sutiles) durante la consulta y filtrado de datos para simular una API real con latencia.
- **FR-007**: El sistema DEBERÁ permitir al usuario vaciar o modificar las cantidades de cualquier producto dentro del panel de cotización.
- **FR-008**: En la sección de Clientes, el sistema DEBERÁ exhibir los logotipos y referencias reales documentadas en el inventario de la empresa.

---

## 4. Casos Borde y Manejo de Errores

- **Búsqueda sin resultados**: Si el usuario busca un término que no coincide con ningún producto, el sistema debe mostrar un mensaje amigable con sugerencias y un botón para restablecer los filtros.
- **Cotizador vacío**: Si el usuario abre el panel de cotización sin haber agregado productos, debe visualizar un estado vacío claro que lo invite a explorar el catálogo.
- **Validación de formulario de contacto y RFQ**: No se debe permitir la generación de cotización si los campos de nombre o teléfono/email son inválidos o están en blanco.
- **Conectividad móvil**: Toda la experiencia, incluyendo el panel de cotización lateral y las tablas de especificaciones, debe adaptarse a pantallas móviles (320px a 480px) sin desbordamiento horizontal.

---

## 5. Criterios de Éxito Medibles

- **SC-001**: La interfaz debe alcanzar una puntuación de rendimiento y buenas prácticas superior a 90 en auditorías de Lighthouse.
- **SC-002**: Un usuario debe poder completar el flujo de selección de producto y generación de mensaje de cotización en menos de 60 segundos.
- **SC-003**: Cero errores de consola en tiempo de ejecución y cero inconsistencias de tipado TypeScript.
- **SC-004**: El 100% de las imágenes y textos canónicos extraídos de megaingga.com deben estar integrados de forma coherente en el nuevo diseño.

---

## 6. Suposiciones

- Los datos del catálogo y portafolio provienen de un servicio mock asíncrono que simula una API REST.
- Los pedidos de cotización en esta fase Demo se completan a través de WhatsApp corporativo y descarga de resumen en el cliente, sin requerir pasarela de pago o base de datos externa.
- Los assets fotográficos de baja resolución se utilizarán como miniaturas y se complementarán con un tratamiento visual técnico para maximizar su nitidez.

---

## 7. Propuesta Futura (no implementada): Migración a Arquitectura Multi-Página

> **Estado**: Propuesta abierta, pendiente de aprobación. No forma parte del alcance implementado en `feature/001-redesign-and-b2b-ecommerce`. De aprobarse, ejecutar en una rama dedicada (ej. `feature/002-multipage-routing`).

**Motivación**: la implementación actual es una landing de una sola página con navegación por anchors (`#nosotros`, `#servicios`, etc.). Al revisar el resultado en browser se detectó que contenido real de alto valor queda comprimido dentro de tarjetas en vez de tener espacio propio — el ejemplo más claro es el caso de obra **Siemens Healthineers en el Hospital Carlos Andrade Marín** (renovación de resonancia magnética), que hoy vive como una tarjeta más dentro de la grilla de "Proyectos", perdiendo detalle y protagonismo. Lo mismo aplica a los proyectos mecánicos, eléctricos y civiles, y a cada ficha de producto del catálogo (hoy resuelta como modal, no como página).

Adicionalmente, los referentes de dirección visual citados en la constitución (Bechtel, Arup) son en la práctica sitios **multi-página profundos** — cada división de servicio y cada proyecto ejecutado tiene su propia URL indexable — no landings de una sola página.

**Rutas propuestas**:
- `/` — Home (hero + resumen institucional + llamadas a las demás secciones)
- `/nosotros` — Misión, visión, política de calidad, valores
- `/servicios` — Catálogo técnico (listado + filtros)
- `/servicios/:slug` — Ficha de producto como página completa (hoy es modal: `ProductDetailModal`)
- `/proyectos` — Portafolio (listado + filtros)
- `/proyectos/:slug` — Caso de estudio completo por proyecto (ej. `/proyectos/renovacion-resonancia-magnetica-hcam`), con espacio para describir alcance, cliente y galería sin comprimir
- `/clientes` — Referencias y logos
- `/contacto` — Formulario y datos de contacto

**Qué se gana**:
- SEO real por división/producto/proyecto (cada página con su propio `<title>` y metadatos, indexable individualmente).
- URLs compartibles y marcables (ej. enviar el link directo del caso Siemens Healthineers a un cliente potencial).
- Espacio completo para casos de estudio y fichas técnicas, sin la restricción de un modal o una tarjeta de grilla.
- Mayor fidelidad al patrón real de sitios de ingeniería de esta escala (Bechtel, Arup).

**Qué cuesta**:
- Nueva dependencia de ruteo (ej. `react-router`), hoy ausente de la pila técnica definida en `plan.md`/constitution.
- Reestructuración de `src/App.tsx` (pasa de orquestador único a `RouterProvider` + layout compartido).
- El carrito de cotización (`useQuoteCart`, persistido en `localStorage`) debe sobrevivir la navegación entre rutas — la lógica actual ya es compatible (no depende de estado en memoria de una sola vista), pero el componente que lo consume debe vivir en un layout raíz compartido entre rutas, no dentro de `App.tsx` como vista única.
- `ProductDetailModal` y las tarjetas de proyecto migran de overlay/grilla a páginas reales con sus propias rutas.

**Decisión**: aprobada por el usuario para ejecutarse **en una rama separada**, posterior a esta. No bloquea ni modifica el alcance ya implementado de `feature/001-redesign-and-b2b-ecommerce`.
