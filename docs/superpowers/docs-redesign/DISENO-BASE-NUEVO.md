# Diseño base — rediseño megaingga.com

Referencias de dirección visual: **bechtel.com** y **arup.com** (estructura capturada en
`resources/ref_sites_structure.json`, HTML crudo en `resources/ref_bechtel.html` y `resources/ref_arup.html`).

Contenido fuente (todo lo que hay que migrar) en `CONTENIDO-EXTRAIDO.md`.

Fase actual: **solo rediseño**. E-commerce queda para fase 2, no se diseña ni estructura todavía
(solo se deja mencionado al final como nota de roadmap).

---

## 1. Paleta de colores

Sacada por muestreo de píxeles del logo real (`resources/images/cropped-logo.jpg`), no a ojo:

| Uso | Color | Hex |
|---|---|---|
| Primario (acento, CTAs, líneas, hover) | Rojo corporativo | `#E31E24` |
| Texto secundario / ícono engranaje | Gris medio | `#8B8B8D` |
| Fondo principal | Blanco | `#FFFFFF` |
| Fondo oscuro (secciones hero, footer) — tomado del lenguaje Bechtel/Arup | Casi negro | `#141414` |
| Texto sobre oscuro | Gris claro | `#E6E6E6` |
| Bordes / separadores sutiles | Gris claro | `#D9D9D9` |

Regla: rojo se usa **con cuidado, como acento** (línea bajo títulos, botón, ícono activo, barra de progreso en stats) — no como fondo masivo. Bechtel y Arup ganan seriedad por usar mucho blanco/negro/foto y el color de marca solo como acento puntual. Nada de fondos rojos grandes tipo folleto.

## 2. Qué tomar de cada referencia

**Bechtel** (`ref_bechtel.html`):
- Hero full-bleed con foto/video de obra real + headline corto en mayúsculas ("We Live for a Challenge").
- Bloques de "Markets / Regions / Services" como grid de tarjetas con ícono + link, no texto largo.
- Sección de liderazgo/equipo con fotos reales, no stock genérico.
- Blog/noticias como carrusel de 3 tarjetas, fecha + título + imagen.
- Menú mega-dropdown por categoría (Markets, Services, Projects, Careers, Media).

**Arup** (`ref_arup.html`):
- Minimalismo extremo: mucho blanco, tipografía grande, poco texto por pantalla.
- Navegación plana de 6 ítems: Markets / Services / Projects / Insights / About / Careers.
- Hero con frase de propósito corta ("We are engineering a more sustainable world") sin relleno.
- Fotografía editorial de proyectos reales en vez de íconos genéricos.
- Scroll largo con secciones separadas por mucho whitespace, no cajas con bordes.

**Síntesis para Mega Ingeniería:** estructura de navegación tipo Arup (plana, pocos ítems) +
densidad de contenido/tarjetas tipo Bechtel (porque Mega Ingeniería sí necesita mostrar catálogo
de productos y proyectos, no solo branding puro) + paleta propia roja/blanca/negra.

## 3. Tipografía

- Titulares: sans-serif condensada/geométrica en mayúsculas para headlines (eco del H3 actual
  "ESPECIALISTAS EN REMODELACIÓN..."), peso bold. Sugerencia: `Archivo` o `Barlow Condensed`.
- Cuerpo: sans-serif neutra de alta legibilidad. Sugerencia: `Inter` o `Source Sans 3`.
- Nada de cursiva decorativa ni sombras de texto (el sitio actual abusa de esto en el hero).

## 4. Arquitectura de información nueva (pestañas)

El sitio actual tiene 13 URLs con slugs sueltos y duplicados (`equipos-de-climatizacion` vs
`equipos-de-climatizacion-2`, `acabados-hospitalarios` vs `acabados-hospitalarios-3`). Se
consolida en una nav plana de 6 pestañas, estilo Arup:

| Pestaña nueva | Contenido viejo que absorbe |
|---|---|
| **Inicio** | `home` (hero, video, bienvenida) |
| **Nosotros** | `pagina-ejemplo/quienes-somos`, `division-proyectos` |
| **Servicios** | `ventas`, `equipos-de-climatizacion`, `equipos-de-climatizacion-2` (fusionar: eran la misma categoría duplicada) |
| **Proyectos** | `proyectos-civiles`, `proyectos-mecanicos`, `proyectos-electricos`, `acabados-hospitalarios`, `acabados-hospitalarios-3` (fusionar duplicado), `nuestros-productos` |
| **Clientes** | `nuestros-clientes` |
| **Contacto** | formulario (hoy mezclado como comentarios de WordPress en el footer — hay que sacarlo de ahí y hacer página real) |

Nota: detectado que `acabados-hospitalarios` y `acabados-hospitalarios-3` son contenido
duplicado/iterado (igual `equipos-de-climatizacion` y su `-2`). En el rediseño se unifican,
no se migran como páginas separadas.

## 5. Plantillas de página

**Inicio**
1. Hero full-bleed: usar `resources/videos/hero-video.mp4` (ya existe, es de obra real) en loop
   mudo, overlay oscuro al 40%, headline corto + 1 CTA ("Ver proyectos").
2. Franja de stats (años de experiencia, proyectos entregados, clientes) — formato Bechtel.
3. Grid de 3-4 líneas de servicio con ícono + link a `/servicios`.
4. Carrusel de proyectos destacados (foto + nombre + categoría).
5. Logos de clientes en fila (de `nuestros-clientes`).
6. CTA de contacto.

**Nosotros**
- Historia/misión (texto de `quienes-somos`), fotos reales del equipo si existen
  (revisar `resources/images/cropped-portrait-young-worker...jpg` — es stock, reemplazar por
  foto real del equipo si el cliente tiene).
- Línea de tiempo o valores (de `division-proyectos`).

**Servicios**
- Grid de tarjetas por línea de servicio (climatización, acabados hospitalarios, ventas de
  equipos), cada una con foto + descripción corta + "Ver más".

**Proyectos**
- Filtro por categoría (Civiles / Mecánicos / Eléctricos / Hospitalarios), grid de tarjetas con
  foto de `resources/images/`, estilo galería tipo Arup (foto grande, poco texto encima).

**Clientes**
- Grid de logos + opcional testimonios cortos.

**Contacto**
- Formulario real (nombre, correo, mensaje) — reemplaza el formulario de comentarios de
  WordPress detectado en el home actual, que no es un formulario de contacto real.

## 6. Componentes clave a construir

- Header sticky, fondo blanco, logo izquierda, nav 6 ítems, CTA rojo a la derecha ("Contacto" o "Cotizar").
- Hero con video/imagen full-bleed + overlay.
- Tarjeta de proyecto/servicio: foto 4:3, título, categoría, hover con línea roja inferior.
- Contador de stats animado.
- Footer oscuro (`#141414`) con columnas: Nosotros / Servicios / Proyectos / Contacto / redes.

## 7. Notas de assets (del inventario en `CONTENIDO-EXTRAIDO.md`)

- 41 imágenes originales descargadas en `resources/images/`. Varias son capturas de WhatsApp
  (`WhatsApp-Image-*.jpeg`) de baja resolución (300x300) — no sirven para hero ni full-bleed,
  solo como thumbnail de proyecto. Recomendado: pedir al cliente fotos en resolución original.
- 1 video (`resources/videos/hero-video.mp4`) usable como hero.
- Logo actual (`cropped-logo.jpg`) es rasterizado y con halo JPEG — pedir versión vectorial (SVG/AI)
  para el rediseño o re-vectorizar antes de usar en header/footer.

## 8. Roadmap (fuera de alcance de este documento)

- **Fase 1 (este documento):** rediseño completo del sitio institucional, 6 pestañas arriba.
- **Fase 2 (después):** sumar e-commerce (catálogo de equipos/productos con carrito y checkout).
  No se diseña estructura de e-commerce todavía — se retoma cuando fase 1 esté cerrada.
