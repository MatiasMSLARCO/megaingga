# Quickstart & Verification Scenarios: Rediseño y E-Commerce B2B

**Feature**: `001-redesign-and-b2b-ecommerce`  
**Objetivo**: Validar manualmente y de forma automatizada los flujos críticos de la aplicación.

---

## 1. Escenario 1: Portada Corporativa y Métricas (US1)
1. Ejecutar `npm run dev` y abrir `http://localhost:5173`.
2. **Validación**:
   - El Hero reproduce el video corporativo de obra en bucle (`hero-video.mp4`) con overlay oscuro.
   - Se aprecia el headline en mayúsculas: *"INGENIERÍA Y CONSTRUCCIÓN DE INFRAESTRUCTURA HOSPITALARIA E INDUSTRIAL"*.
   - La franja de métricas tipo Bechtel muestra: años de experiencia, obras ejecutadas, clientes atendidos.
   - La barra de navegación es sticky y resalta la pestaña activa en `#E31E24`.

---

## 2. Escenario 2: Navegación y Contenido Migrado (US1)
1. Hacer clic en **"Nosotros"**.
2. **Validación**: Se visualizan la Misión, Visión, Política de Calidad y los 8 Valores corporativos extraídos fielmente de megaingga.com.
3. Hacer clic en **"Clientes"**.
4. **Validación**: Se muestran los logos y referencias de clientes reales de Mega Ingeniería.

---

## 3. Escenario 3: Catálogo Técnico y Filtrado (US2)
1. Hacer clic en **"Servicios / Catálogo"**.
2. **Validación**:
   - Aparece un selector de filtros: *Todos*, *Acabados Hospitalarios*, *Climatización HVAC*, *Equipos Especiales*.
   - Al pulsar *"Acabados Hospitalarios"*, solo se despliegan puertas herméticas, pisos conductivos, etc.
   - Al escribir *"Chiller"* en la barra de búsqueda, se filtra el catálogo al instante.
   - Al hacer clic en un producto, se abre el modal con especificaciones técnicas y normas ISO/ASHRAE.

---

## 4. Escenario 4: Cotizador RFQ y WhatsApp (US3)
1. En la ficha o tarjeta de cualquier producto, pulsar **"Agregar a Cotización"**.
2. **Validación**:
   - El badge del carrito en el navbar incrementa su contador (`1`).
3. Abrir el panel de cotización (botón de cotizador en el navbar).
4. Cambiar la cantidad a `2`.
5. Recargar la página (`F5`).
6. **Validación**: El cotizador mantiene los `2` ítems en memoria (`localStorage`).
7. Completar el formulario con datos de contacto de prueba y presionar **"Solicitar Cotización vía WhatsApp"**.
8. **Validación**:
   - Se genera el folio (ej. `RFQ-2026-XXXX`).
   - Se abre el enlace `https://wa.me/593998314070?text=...` con el desglose exacto de los productos solicitados.

---

## 5. Escenario 5: Portafolio de Obras (US4)
1. Hacer clic en **"Proyectos"**.
2. **Validación**:
   - Filtros por disciplina (*Civiles*, *Mecánicos*, *Eléctricos*, *Hospitalarios*).
   - Tarjetas con fotografías de obras reales y descripción del alcance técnico.
