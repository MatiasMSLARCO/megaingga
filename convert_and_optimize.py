"""
Script maestro de optimización y vectorización de activos para MEGA INGENIERÍA
1. Convierte imágenes de JPG/PNG a WEBP con nombres semánticos.
2. Elimina archivos raster antiguos redundantes.
3. Genera logo.svg oficial de alta calidad sin fondo.
4. Genera favicon.svg, favicon.ico y apple-touch-icon.png para las pestañas.
"""

import os
import math
from PIL import Image, ImageDraw
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
from matplotlib.path import Path

# --- 1. MAPPING DE IMÁGENES A WEBP ---
IMAGE_MAPPINGS = [
    # Logo
    ("public/assets/images/logo.jpg", "public/assets/images/logo.webp"),
    # Hero
    ("public/assets/images/hero/hero-bg-plant.jpeg", "public/assets/images/hero/hero-planta-industrial.webp"),
    ("public/assets/images/hero/hero-bg-worker.jpg", "public/assets/images/hero/hero-ingeniero-operario.webp"),
    # Clientes
    ("public/assets/images/clients/logo-omni.jpg", "public/assets/images/clients/cliente-omni-hospital.webp"),
    ("public/assets/images/clients/client-01.png", "public/assets/images/clients/cliente-logo-01.webp"),
    ("public/assets/images/clients/client-02.jpg", "public/assets/images/clients/cliente-logo-02.webp"),
    ("public/assets/images/clients/client-03.jpg", "public/assets/images/clients/cliente-logo-03.webp"),
    ("public/assets/images/clients/client-04.png", "public/assets/images/clients/cliente-logo-04.webp"),
    ("public/assets/images/clients/client-05.jpg", "public/assets/images/clients/cliente-logo-05.webp"),
    ("public/assets/images/clients/client-06.png", "public/assets/images/clients/cliente-logo-06.webp"),
    ("public/assets/images/clients/client-07.jpg", "public/assets/images/clients/cliente-logo-07.webp"),
    ("public/assets/images/clients/client-08.png", "public/assets/images/clients/cliente-logo-08.webp"),
    # Proyectos
    ("public/assets/images/projects/hospitalario-siemens-1.jpeg", "public/assets/images/projects/proyecto-resonancia-siemens-hcam.webp"),
    ("public/assets/images/projects/hospitalario-siemens-2.jpeg", "public/assets/images/projects/proyecto-remodelacion-medica-siemens.webp"),
    ("public/assets/images/projects/civil-1.jpg", "public/assets/images/projects/proyecto-civil-infraestructura.webp"),
    ("public/assets/images/projects/division-overview-1.jpg", "public/assets/images/projects/proyecto-civil-estructuras-metalicas.webp"),
    ("public/assets/images/projects/division-overview-2.jpg", "public/assets/images/projects/proyecto-civil-galpones-industriales.webp"),
    ("public/assets/images/projects/mecanico-1.jpeg", "public/assets/images/projects/proyecto-mecanico-redes-contraincendio.webp"),
    ("public/assets/images/projects/mecanico-2.jpeg", "public/assets/images/projects/proyecto-mecanico-calderas-vapor.webp"),
    ("public/assets/images/projects/division-overview-3.jpg", "public/assets/images/projects/proyecto-electrico-media-tension.webp"),
    ("public/assets/images/projects/division-overview-4.jpeg", "public/assets/images/projects/proyecto-electrico-tableros-potencia.webp"),
    # Productos
    ("public/assets/images/products/vinil-hospitalario-1.jpeg", "public/assets/images/products/piso-vinilico-alto-trafico.webp"),
    ("public/assets/images/products/vinil-hospitalario-2.jpeg", "public/assets/images/products/piso-vinilico-conductivo.webp"),
    ("public/assets/images/products/acabados-hospitalarios-1.jpeg", "public/assets/images/products/proteccion-pared-acero-inox.webp"),
    ("public/assets/images/products/acabados-hospitalarios-2.jpeg", "public/assets/images/products/puerta-plomada-radiacion.webp"),
    ("public/assets/images/products/acabados-hospitalarios-3.jpeg", "public/assets/images/products/panel-sanitario-antibacteriano.webp"),
    ("public/assets/images/products/acabados-hospitalarios-4.jpeg", "public/assets/images/products/puerta-quirofano-acero-304.webp"),
    ("public/assets/images/products/acabados-hospitalarios-5.jpeg", "public/assets/images/products/acabados-quirofano-modular.webp"),
    ("public/assets/images/products/acabados-hospitalarios-6.jpeg", "public/assets/images/products/perfileria-sanitaria-curva.webp"),
    ("public/assets/images/products/climatizacion-1.jpeg", "public/assets/images/products/climatizacion-split-cassette.webp"),
    ("public/assets/images/products/climatizacion-2.jpeg", "public/assets/images/products/unidad-manejadora-aire-ahu.webp"),
    ("public/assets/images/products/climatizacion-3.jpeg", "public/assets/images/products/ventilacion-mecanica-filtros.webp"),
    ("public/assets/images/products/climatizacion-4.jpeg", "public/assets/images/products/equipo-climatizacion-rooftop.webp"),
    ("public/assets/images/products/sistemas-generacion.jpeg", "public/assets/images/products/sistema-generacion-electrica.webp"),
    ("public/assets/images/products/estudios-energia-1.jpg", "public/assets/images/products/analizador-calidad-energia-1.webp"),
    ("public/assets/images/products/estudios-energia-2.jpg", "public/assets/images/products/analizador-calidad-energia-2.webp"),
    ("public/assets/images/products/estudios-energia-3.jpeg", "public/assets/images/products/analizador-calidad-energia-diagnostico.webp"),
]

def convert_images():
    total_old_size = 0
    total_new_size = 0
    to_delete = []

    for src, dst in IMAGE_MAPPINGS:
        if not os.path.exists(src):
            print(f"Skipping (not found): {src}")
            continue

        old_size = os.path.getsize(src)
        total_old_size += old_size

        with Image.open(src) as img:
            save_kwargs = {'quality': 85, 'method': 6}
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                save_kwargs['lossless'] = False
                img.save(dst, 'WEBP', **save_kwargs)
            else:
                rgb_img = img.convert('RGB')
                rgb_img.save(dst, 'WEBP', **save_kwargs)

        new_size = os.path.getsize(dst)
        total_new_size += new_size
        to_delete.append(src)
        print(f"OK: {src} -> {dst} ({old_size/1024:.1f} KB -> {new_size/1024:.1f} KB)")

    for old_file in to_delete:
        try:
            os.remove(old_file)
            print(f"Deleted old asset: {old_file}")
        except Exception as e:
            print(f"Error deleting {old_file}: {e}")

    print(f"\nResumen Imágenes: {total_old_size/1024:.1f} KB -> {total_new_size/1024:.1f} KB (Ahorro: {(1 - total_new_size/total_old_size)*100:.1f}%)")

# --- 2. VECTORIZACIÓN DE LOGO Y FAVICONS ---

def path_to_svg_d(path, offset_x=0, offset_y=0, scale_y=-1):
    parts = []
    codes = path.codes
    verts = path.vertices
    i = 0
    while i < len(verts):
        code = codes[i]
        x = verts[i, 0] + offset_x
        y = verts[i, 1] * scale_y + offset_y
        if code == Path.MOVETO:
            parts.append(f'M {x:.2f} {y:.2f}')
            i += 1
        elif code == Path.LINETO:
            parts.append(f'L {x:.2f} {y:.2f}')
            i += 1
        elif code == Path.CURVE3:
            x1 = verts[i+1, 0] + offset_x
            y1 = verts[i+1, 1] * scale_y + offset_y
            parts.append(f'Q {x:.2f} {y:.2f} {x1:.2f} {y1:.2f}')
            i += 2
        elif code == Path.CURVE4:
            x1 = verts[i+1, 0] + offset_x
            y1 = verts[i+1, 1] * scale_y + offset_y
            x2 = verts[i+2, 0] + offset_x
            y2 = verts[i+2, 1] * scale_y + offset_y
            parts.append(f'C {x:.2f} {y:.2f} {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f}')
            i += 3
        elif code == Path.CLOSEPOLY:
            parts.append('Z')
            i += 1
        else:
            i += 1
    return ' '.join(parts)

def generate_gear(cx=35, cy=35, r_outer=27, r_root=21, teeth=12):
    angle_step = 2 * math.pi / teeth
    pts = []
    offset = -math.pi / 2
    for i in range(teeth):
        mid = offset + i * angle_step
        a0 = mid - angle_step * 0.35
        a1 = mid - angle_step * 0.16
        a2 = mid + angle_step * 0.16
        a3 = mid + angle_step * 0.35
        pts.append(f'{cx + r_root * math.cos(a0):.2f},{cy + r_root * math.sin(a0):.2f}')
        pts.append(f'{cx + r_outer * math.cos(a1):.2f},{cy + r_outer * math.sin(a1):.2f}')
        pts.append(f'{cx + r_outer * math.cos(a2):.2f},{cy + r_outer * math.sin(a2):.2f}')
        pts.append(f'{cx + r_root * math.cos(a3):.2f},{cy + r_root * math.sin(a3):.2f}')
    return 'M ' + ' L '.join(pts) + ' Z'

def generate_flame():
    return (
        'M 35.00 46.50 '
        'C 30.80 44.80 27.20 40.20 27.80 34.50 '
        'C 28.30 29.20 31.80 25.20 37.50 23.20 '
        'C 37.00 26.60 38.80 29.20 40.80 31.20 '
        'C 42.00 32.50 41.60 34.40 40.20 35.40 '
        'C 41.60 37.00 42.60 39.00 42.20 41.50 '
        'C 41.70 44.50 38.80 46.20 35.00 46.50 Z'
    )

def generate_vein():
    return 'M 35.00 45.80 C 34.80 41.50 35.30 36.80 37.00 30.50'

def create_logos():
    fp_top = FontProperties(fname='C:/Windows/Fonts/GOTHICB.TTF', size=25)
    fp_bottom = FontProperties(fname='C:/Windows/Fonts/bahnschrift.ttf', size=16, weight='bold')

    tp_top = TextPath((0, 0), 'MEGA INGENIERÍA', prop=fp_top)
    tp_bottom = TextPath((0, 0), 'MEGAINGGA S.A.', prop=fp_bottom)

    bb_top = tp_top.get_extents()
    bb_bottom = tp_bottom.get_extents()

    text_x = 78
    top_y = 35.5
    bottom_y = 57.0

    d_top = path_to_svg_d(tp_top, offset_x=text_x, offset_y=top_y)

    top_left = text_x + bb_top.xmin
    top_right = text_x + bb_top.xmax
    top_center = (top_left + top_right) / 2

    bottom_center_orig = (bb_bottom.xmin + bb_bottom.xmax) / 2
    bottom_offset_x = top_center - bottom_center_orig

    bottom_left = bottom_offset_x + bb_bottom.xmin
    bottom_right = bottom_offset_x + bb_bottom.xmax

    d_bottom = path_to_svg_d(tp_bottom, offset_x=bottom_offset_x, offset_y=bottom_y)

    gap = 8.0
    rule_left_x1 = top_left
    rule_left_x2 = bottom_left - gap
    rule_right_x1 = bottom_right + gap
    rule_right_x2 = top_right
    rule_y = 51.0

    gear_d = generate_gear()
    flame_d = generate_flame()
    vein_d = generate_vein()

    total_width = int(top_right + 8)
    viewbox = f'0 0 {total_width} 70'

    # Official transparent color logo
    svg_color = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" width="{total_width}" height="70" fill="none">
  <g id="badge">
    <rect x="3" y="3" width="64" height="64" rx="8" fill="#7B828A" />
    <path d="{gear_d}" fill="#FFFFFF" />
    <circle cx="35" cy="35" r="16" fill="#E31E24" />
    <path d="{flame_d}" fill="#FFFFFF" />
    <path d="{vein_d}" stroke="#E31E24" stroke-width="1.3" stroke-linecap="round" fill="none" />
  </g>
  <g id="typography">
    <path d="{d_top}" fill="#E31E24" />
    <line x1="{rule_left_x1:.2f}" y1="{rule_y:.2f}" x2="{rule_left_x2:.2f}" y2="{rule_y:.2f}" stroke="#7B828A" stroke-width="1.5" />
    <path d="{d_bottom}" fill="#7B828A" />
    <line x1="{rule_right_x1:.2f}" y1="{rule_y:.2f}" x2="{rule_right_x2:.2f}" y2="{rule_y:.2f}" stroke="#7B828A" stroke-width="1.5" />
  </g>
</svg>'''

    # Isotype alone (badge)
    svg_badge = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="70" height="70" fill="none">
  <rect x="3" y="3" width="64" height="64" rx="8" fill="#7B828A" />
  <path d="{gear_d}" fill="#FFFFFF" />
  <circle cx="35" cy="35" r="16" fill="#E31E24" />
  <path d="{flame_d}" fill="#FFFFFF" />
  <path d="{vein_d}" stroke="#E31E24" stroke-width="1.3" stroke-linecap="round" fill="none" />
</svg>'''

    # Browser tab favicon SVG
    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <rect width="64" height="64" rx="14" fill="#141414" />
  <g transform="translate(-3, -3)">
    <path d="{gear_d}" fill="#FFFFFF" />
    <circle cx="35" cy="35" r="16" fill="#E31E24" />
    <path d="{flame_d}" fill="#FFFFFF" />
    <path d="{vein_d}" stroke="#E31E24" stroke-width="1.3" stroke-linecap="round" fill="none" />
  </g>
</svg>'''

    with open('public/assets/images/logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_color)
    with open('public/assets/images/logo-badge.svg', 'w', encoding='utf-8') as f:
        f.write(svg_badge)
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)

    print("Created SVG files successfully!")

    # Favicon ICO and Apple Touch PNG
    def draw_mark(size):
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        radius = int(size * 0.22)
        draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=(20, 20, 20, 255))
        
        cx, cy = size / 2, size / 2
        r_outer = size * 0.38
        r_root = size * 0.29
        
        teeth = 12
        step = 2 * math.pi / teeth
        pts = []
        offset = -math.pi / 2
        for i in range(teeth):
            mid = offset + i * step
            a0 = mid - step * 0.35
            a1 = mid - step * 0.16
            a2 = mid + step * 0.16
            a3 = mid + step * 0.35
            pts.append((cx + r_root * math.cos(a0), cy + r_root * math.sin(a0)))
            pts.append((cx + r_outer * math.cos(a1), cy + r_outer * math.sin(a1)))
            pts.append((cx + r_outer * math.cos(a2), cy + r_outer * math.sin(a2)))
            pts.append((cx + r_root * math.cos(a3), cy + r_root * math.sin(a3)))
        draw.polygon(pts, fill=(255, 255, 255, 255))
        
        r_red = size * 0.22
        draw.ellipse([cx - r_red, cy - r_red, cx + r_red, cy + r_red], fill=(227, 30, 36, 255))
        
        flame_w = size * 0.10
        flame_h = size * 0.26
        draw.ellipse([cx - flame_w, cy - flame_h * 0.1, cx + flame_w, cy + flame_h * 0.55], fill=(255, 255, 255, 255))
        draw.polygon([(cx - flame_w * 0.8, cy + flame_h * 0.1), (cx + flame_w * 0.7, cy - flame_h * 0.55), (cx + flame_w * 0.8, cy + flame_h * 0.2)], fill=(255, 255, 255, 255))
        
        return img

    icon180 = draw_mark(180)
    icon180.save('public/apple-touch-icon.png', format='PNG')
    icon32 = draw_mark(32)
    icon32.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("Created ICO and PNG favicons successfully!")

if __name__ == '__main__':
    convert_images()
    create_logos()
