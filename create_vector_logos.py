"""
Generador de Logotipos Vectoriales SVG de Alta Fidelidad para MEGA INGENIERÍA
"""

import math
import os
from PIL import Image, ImageDraw
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
from matplotlib.path import Path

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
    # Organic precision flame/leaf centered at (35, 35)
    d = (
        'M 35.00 46.50 '
        'C 30.80 44.80 27.20 40.20 27.80 34.50 '
        'C 28.30 29.20 31.80 25.20 37.50 23.20 '
        'C 37.00 26.60 38.80 29.20 40.80 31.20 '
        'C 42.00 32.50 41.60 34.40 40.20 35.40 '
        'C 41.60 37.00 42.60 39.00 42.20 41.50 '
        'C 41.70 44.50 38.80 46.20 35.00 46.50 Z'
    )
    return d

def generate_vein():
    return 'M 35.00 45.80 C 34.80 41.50 35.30 36.80 37.00 30.50'

def main():
    # Typography: Century Gothic Bold for top, Bahnschrift bold for bottom
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

    # Exact geometric alignment:
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

    # 1. COLOR LOGO (Official transparent)
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

    # 2. WHITE MONOCHROME LOGO (For dark headers, footers, heroes)
    svg_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" width="{total_width}" height="70" fill="none">
  <g id="badge">
    <rect x="3" y="3" width="64" height="64" rx="8" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" />
    <path d="{gear_d}" fill="#FFFFFF" />
    <circle cx="35" cy="35" r="16" fill="#FFFFFF" fill-opacity="0.25" />
    <path d="{flame_d}" fill="#FFFFFF" />
    <path d="{vein_d}" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.6" />
  </g>
  <g id="typography">
    <path d="{d_top}" fill="#FFFFFF" />
    <line x1="{rule_left_x1:.2f}" y1="{rule_y:.2f}" x2="{rule_left_x2:.2f}" y2="{rule_y:.2f}" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.75" />
    <path d="{d_bottom}" fill="#FFFFFF" fill-opacity="0.9" />
    <line x1="{rule_right_x1:.2f}" y1="{rule_y:.2f}" x2="{rule_right_x2:.2f}" y2="{rule_y:.2f}" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.75" />
  </g>
</svg>'''

    # 3. NEGATIVE / DARK MODE WITH RED ACCENT
    svg_negative = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" width="{total_width}" height="70" fill="none">
  <g id="badge">
    <rect x="3" y="3" width="64" height="64" rx="8" fill="#1F2937" stroke="#374151" stroke-width="1.2" />
    <path d="{gear_d}" fill="#F9FAFB" />
    <circle cx="35" cy="35" r="16" fill="#E31E24" />
    <path d="{flame_d}" fill="#FFFFFF" />
    <path d="{vein_d}" stroke="#E31E24" stroke-width="1.3" stroke-linecap="round" fill="none" />
  </g>
  <g id="typography">
    <path d="{d_top}" fill="#FFFFFF" />
    <line x1="{rule_left_x1:.2f}" y1="{rule_y:.2f}" x2="{rule_left_x2:.2f}" y2="{rule_y:.2f}" stroke="#9CA3AF" stroke-width="1.5" />
    <path d="{d_bottom}" fill="#D1D5DB" />
    <line x1="{rule_right_x1:.2f}" y1="{rule_y:.2f}" x2="{rule_right_x2:.2f}" y2="{rule_y:.2f}" stroke="#9CA3AF" stroke-width="1.5" />
  </g>
</svg>'''

    # 4. STANDALONE BADGE / ISOTIPO (70x70)
    svg_badge = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="70" height="70" fill="none">
  <rect x="3" y="3" width="64" height="64" rx="8" fill="#7B828A" />
  <path d="{gear_d}" fill="#FFFFFF" />
  <circle cx="35" cy="35" r="16" fill="#E31E24" />
  <path d="{flame_d}" fill="#FFFFFF" />
  <path d="{vein_d}" stroke="#E31E24" stroke-width="1.3" stroke-linecap="round" fill="none" />
</svg>'''

    # 5. TAB FAVICON SVG (Crisp 64x64)
    # Gear + Red circle + Flame on rounded dark plate
    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <rect width="64" height="64" rx="14" fill="#141414" />
  <g transform="translate(-3, -3)">
    <path d="{gear_d}" fill="#FFFFFF" />
    <circle cx="35" cy="35" r="16" fill="#E31E24" />
    <path d="{flame_d}" fill="#FFFFFF" />
    <path d="{vein_d}" stroke="#E31E24" stroke-width="1.3" stroke-linecap="round" fill="none" />
  </g>
</svg>'''

    # Save SVG files
    out_dir = 'public/assets/images'
    os.makedirs(out_dir, exist_ok=True)

    files = {
        f'{out_dir}/logo.svg': svg_color,
        f'{out_dir}/logo-white.svg': svg_white,
        f'{out_dir}/logo-negative.svg': svg_negative,
        f'{out_dir}/logo-badge.svg': svg_badge,
        'public/favicon.svg': favicon_svg,
    }

    for path, content in files.items():
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Created: {path}')

    # Create high-res raster favicon (ICO & Apple Touch Icon PNG)
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

    icon16 = draw_mark(16)
    icon32 = draw_mark(32)
    icon48 = draw_mark(48)
    icon180 = draw_mark(180)

    icon180.save('public/apple-touch-icon.png', format='PNG')
    icon32.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print('Created: public/favicon.ico and public/apple-touch-icon.png')

    # Also render preview image to inspect
    import matplotlib.pyplot as plt
    import matplotlib.patches as patches
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(7, 4.5), dpi=180)
    
    def render_row(ax, bg, badge_fill, gear_fill, circle_fill, flame_fill, vein_stroke, top_fill, bottom_fill, rule_stroke):
        ax.set_facecolor(bg)
        rect = patches.FancyBboxPatch((3, 3), 64, 64, boxstyle='round,pad=0,rounding_size=8', facecolor=badge_fill, edgecolor='none')
        ax.add_patch(rect)
        gear_pts = []
        for i in range(12):
            mid = -math.pi/2 + i * 2 * math.pi / 12
            gear_pts.append((35 + 21 * math.cos(mid - 2*math.pi/12 * 0.35), 35 + 21 * math.sin(mid - 2*math.pi/12 * 0.35)))
            gear_pts.append((35 + 27 * math.cos(mid - 2*math.pi/12 * 0.16), 35 + 27 * math.sin(mid - 2*math.pi/12 * 0.16)))
            gear_pts.append((35 + 27 * math.cos(mid + 2*math.pi/12 * 0.16), 35 + 27 * math.sin(mid + 2*math.pi/12 * 0.16)))
            gear_pts.append((35 + 21 * math.cos(mid + 2*math.pi/12 * 0.35), 35 + 21 * math.sin(mid + 2*math.pi/12 * 0.35)))
        ax.add_patch(patches.Polygon(gear_pts, facecolor=gear_fill, edgecolor='none'))
        ax.add_patch(plt.Circle((35, 35), 16, color=circle_fill))
        ax.plot([35, 34.8, 35.5, 37], [45.8, 41.5, 36.8, 30.5], color=vein_stroke, lw=1.3)
        
        # Render Text
        patch_top = patches.PathPatch(tp_top, facecolor=top_fill, edgecolor='none', transform=ax.transData)
        # Position in ax coordinates (inverted Y)
        ax.text(text_x, top_y, 'MEGA INGENIERÍA', fontproperties=fp_top, color=top_fill, va='baseline')
        ax.text(bottom_offset_x, bottom_y, 'MEGAINGGA S.A.', fontproperties=fp_bottom, color=bottom_fill, va='baseline')
        ax.plot([rule_left_x1, rule_left_x2], [rule_y, rule_y], color=rule_stroke, lw=1.5)
        ax.plot([rule_right_x1, rule_right_x2], [rule_y, rule_y], color=rule_stroke, lw=1.5)
        
        ax.set_xlim(0, total_width)
        ax.set_ylim(0, 70)
        ax.invert_yaxis()
        ax.axis('off')

    render_row(ax1, '#FFFFFF', '#7B828A', '#FFFFFF', '#E31E24', '#FFFFFF', '#E31E24', '#E31E24', '#7B828A', '#7B828A')
    render_row(ax2, '#141414', (1.0, 1.0, 1.0, 0.18), '#FFFFFF', (1.0, 1.0, 1.0, 0.25), '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF')
    render_row(ax3, '#141414', '#1F2937', '#F9FAFB', '#E31E24', '#FFFFFF', '#E31E24', '#FFFFFF', '#D1D5DB', '#9CA3AF')

    fig.patch.set_facecolor('#E5E7EB')
    plt.tight_layout()
    plt.savefig('preview_rendered_v2.png', facecolor='#E5E7EB')
    print('Saved preview_rendered_v2.png')

if __name__ == '__main__':
    main()
