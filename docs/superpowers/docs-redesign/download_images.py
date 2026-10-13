import json, os, urllib.request, time
from urllib.parse import urlparse

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

with open("resources/all_images.json", encoding="utf-8") as f:
    images = json.load(f)

os.makedirs("resources/images", exist_ok=True)

manifest = []
seen_names = set()

for i, (url, alt) in enumerate(images.items()):
    name = os.path.basename(urlparse(url).path)
    if not name or "." not in name:
        name = f"image_{i}.jpg"
    base, ext = os.path.splitext(name)
    final = name
    n = 1
    while final in seen_names:
        final = f"{base}_{n}{ext}"
        n += 1
    seen_names.add(final)

    dest = f"resources/images/{final}"
    status = "ok"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(dest, "wb") as f:
            f.write(data)
        size = len(data)
    except Exception as e:
        status = f"error: {e}"
        size = 0

    manifest.append({"url": url, "alt": alt, "file": final, "size_bytes": size, "status": status})
    print(final, status, size)
    time.sleep(1)

with open("resources/images_manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("DONE", len(manifest))
