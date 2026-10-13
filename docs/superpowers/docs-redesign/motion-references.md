# Referencias de Motion/Animación — Hero y Dirección Visual

**Fuente**: pedido del usuario (jefe quiere "más animaciones, más llamativo"). Dos sitios de referencia inspeccionados en vivo (Playwright, screenshots reales, no solo texto).

---

## 1. blueprintarising.netlify.app — "Blueprint to Built Residence"

**Mecanismo observado** (scroll 0 → 900 → 2600px):
- Hero arranca con un **plano arquitectónico 2D plano** (líneas técnicas color crema sobre fondo casi negro, anotaciones de cotas, sello "SHEET A-101 · SCALE 1:100", viñeta "01/04 — BLUEPRINT").
- Al hacer scroll, las mismas líneas del plano **se extruyen progresivamente en 3D isométrico** — las paredes "suben" desde las líneas del piso, sincronizado 1:1 con el scroll (scrub, no autoplay).
- Hacia scroll ~2600px (capítulo "02/04 — STRUCTURE") las líneas ya son **volúmenes sólidos oscuros** (masas extruidas, ventanas como cortes), todavía monocromático, sin textura/foto real.
- Texto editorial aparece por capítulo, sincronizado al mismo scroll ("Every residence begins as a set of lines" → "Form follows the way people will live").
- Sin `window.gsap`/`window.THREE` expuestos globalmente (bundleado) — pero el efecto (líneas → volumen) es el tipo de trabajo típico de SVG con `stroke-dashoffset`/transform 3D o Three.js con extrusión de geometría; no se pudo confirmar cuál exactamente sin ver el bundle.

**Lo rescatable para Mega Ingeniería** (encaja temáticamente perfecto: es literalmente una empresa de construcción/ingeniería):
- Metáfora "plano → construido" aplicada al Hero: un dibujo técnico/esquema (línea blanca sobre oscuro, cotas, sello tipo plano) que se **dibuja a sí mismo** (stroke draw-in) sincronizado al scroll inicial del Hero, antes de ceder paso al video real de obra.
- Viñetas tipo "SHEET A-101", cotas, sello de escala → encajan con la identidad "ingeniería seria" ya definida en la constitution.

**Lo que NO vamos a clonar** (fuera de alcance, demasiado costoso para esta iteración): el motor de extrusión 3D isométrico completo tipo WebGL/Three.js. Replicar eso exigiría modelado 3D propio; no es viable en este sprint.

---

## 2. tabasco.hilostudiolab.com — "Interactive 3D Experience" (Hilo Studio)

**Lo observado**: preloader de marca ("BOTTLING... 100%"), luego escena 3D en tiempo real (modelo 3D de una planta de chile renderizado con Three.js/R3F, iluminación realista) a la izquierda, texto editorial a la derecha ("THE ROOT OF A LEGACY" con la palabra **"LEGACY" resaltada en un bloque sólido rojo**), tipografía condensada en mayúsculas muy bold, fondo casi negro, acento rojo puro.

**Lo rescatable** (coincide 1:1 con la paleta ya fija de Mega Ingeniería — negro `#141414` + rojo `#E31E24`):
- Técnica tipográfica: palabra clave de un titular envuelta en un **bloque sólido de color de acento** (no solo texto rojo — fondo rojo, texto blanco, como un marcador de resaltador). Barato de implementar, alto impacto, cero riesgo técnico.
- Jerarquía: titular gigante condensado + un subtítulo corto en una línea + párrafo breve debajo — ritmo editorial, no "card grid".

**Lo que NO vamos a clonar**: el modelo 3D real-time (otro WebGL pesado, fuera de alcance).

---

## 3. Plan de implementación (factible con GSAP + ScrollTrigger ya instalado, sin WebGL)

### Hero: "Blueprint → Built" (scroll-scrub al entrar al Hero)
1. Agregar un overlay SVG de líneas técnicas (esquema simplificado: planta arquitectónica u diagrama HVAC/eléctrico, estilo "blueprint" — trazo blanco/crema, cotas falsas tipo "A-101", sello de escala) posicionado sobre el video del Hero.
2. Las líneas del SVG se **dibujan con `stroke-dashoffset`** (de 100% a 0%) atadas al scroll inicial del Hero (`scrollTrigger` con `scrub`, `start: 'top top'`, `end: '+=60%'` del alto del Hero).
3. A medida que el dibujo se completa, el overlay se desvanece (`opacity` → 0) revelando el video real de obra ya existente — metáfora literal "del plano a lo construido", usando asset que YA tenemos (sin fabricar contenido nuevo).
4. Mantener el timeline de entrada ya implementado (eyebrow/headline-clip/subtext/CTA) — el nuevo efecto SVG convive con eso, no lo reemplaza.

### Tipografía: bloque de acento en titulares clave
- En el H1 del Hero y en 1-2 headers de sección, envolver la palabra más importante en un `<span>` con fondo `bg-brand-red` sólido + texto blanco (técnica tipo Tabasco), en vez de solo colorear el texto. Uso quirúrgico (máx. 1 por titular), consistente con la regla de la constitution de "rojo solo en acentos, nunca fondos masivos" — acá es un bloque pequeño del tamaño de una palabra, no una sección completa.

### Alcance de "e-commerce aparte" (pendiente de decisión, no implementado aún)
El usuario está evaluando mover el catálogo/cotizador a su propia sección/página separada de la landing institucional, dejando en la landing solo un teaser de "productos/servicios destacados". Esto es una decisión de arquitectura de información (IA) distinta a la de motion — se trata por separado, no se actúa todavía sobre esto en este documento.

---

## Checklist de implementación
- [ ] SVG blueprint overlay en Hero, draw-in atado a scroll (GSAP ScrollTrigger scrub)
- [ ] Fade-out del overlay revelando el video real
- [ ] Bloque de acento rojo en 1 palabra del H1
- [ ] Verificar `prefers-reduced-motion` (overlay debe saltar directo a visible sin animar)
- [ ] tsc + lint + build limpios
