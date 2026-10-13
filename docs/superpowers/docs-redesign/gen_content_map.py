# -*- coding: utf-8 -*-
import json

with open("resources/sitemap_extracted.json", encoding="utf-8") as f:
    pages = json.load(f)

with open("resources/images_manifest.json", encoding="utf-8") as f:
    manifest = json.load(f)

url_to_file = {}
for m in manifest:
    url_to_file[m["url"]] = m["file"]

lines = []
lines.append("# Mapa de contenido extraido - megaingga.com")
lines.append("")
lines.append("Extraido via sitemap WordPress (`wp-sitemap.xml`) + fetch HTTP directo (sin render browser).")
lines.append(f"Total paginas: {len(pages)}. Total imagenes: {len(manifest)} (ver `resources/images/`).")
lines.append("")
lines.append("## Indice de paginas")
lines.append("")
for p in pages:
    lines.append(f"- [{p['title'] or p['slug']}](#{p['slug'].replace('_','-')}) — `{p['url']}`")
lines.append("")
lines.append("---")
lines.append("")

for p in pages:
    lines.append(f"## {p['title'] or p['slug']}")
    lines.append("")
    lines.append(f"- **URL:** {p['url']}")
    lines.append(f"- **Slug:** `{p['slug']}`")
    if p["meta_description"]:
        lines.append(f"- **Meta description:** {p['meta_description']}")
    lines.append("")

    if p["h1"]:
        lines.append("**H1:**")
        for h in p["h1"]:
            lines.append(f"- {h}")
        lines.append("")
    if p["h2"]:
        lines.append("**H2:**")
        for h in p["h2"]:
            lines.append(f"- {h}")
        lines.append("")
    if p["h3"]:
        lines.append("**H3:**")
        for h in p["h3"]:
            lines.append(f"- {h}")
        lines.append("")

    if p["text_blocks"]:
        lines.append("**Texto (bloques, orden de aparicion):**")
        for t in p["text_blocks"]:
            if len(t) > 3:
                lines.append(f"- {t}")
        lines.append("")

    if p["images"]:
        lines.append(f"**Imagenes en esta pagina ({len(p['images'])}):**")
        seen = set()
        for img in p["images"]:
            f_ = url_to_file.get(img["src"], img["src"])
            if f_ in seen:
                continue
            seen.add(f_)
            alt = img["alt"] or "(sin alt)"
            lines.append(f"- `resources/images/{f_}` — alt: {alt}")
        lines.append("")

    lines.append("---")
    lines.append("")

with open("CONTENIDO-EXTRAIDO.md", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("OK, lineas:", len(lines))
