import urllib.request, os, re, json, time
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE = "http://megaingga.com"
URLS = [
    "/",
    "/pagina-ejemplo/quienes-somos/",
    "/division-proyectos/",
    "/nuestros-productos/",
    "/nuestros-clientes/",
    "/ventas/",
    "/equipos-de-climatizacion/",
    "/equipos-de-climatizacion-2/",
    "/proyectos-civiles/",
    "/proyectos-mecanicos/",
    "/proyectos-electricos/",
    "/acabados-hospitalarios/",
    "/acabados-hospitalarios-3/",
]

OUT_PAGES = "resources/pages"
OUT_IMAGES = "resources/images"
os.makedirs(OUT_PAGES, exist_ok=True)
os.makedirs(OUT_IMAGES, exist_ok=True)

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def slug(u):
    p = urlparse(u).path.strip("/")
    return p.replace("/", "_") or "home"

site_map = []
all_images = {}

for path in URLS:
    url = BASE + path
    s = slug(url)
    print("FETCH", url)
    try:
        html = fetch(url)
    except Exception as e:
        print("  ERROR", e)
        continue

    with open(f"{OUT_PAGES}/{s}.html", "wb") as f:
        f.write(html)

    soup = BeautifulSoup(html, "html.parser")

    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    meta_desc = ""
    md = soup.find("meta", attrs={"name": "description"})
    if md and md.get("content"):
        meta_desc = md["content"].strip()

    h1 = [h.get_text(strip=True) for h in soup.find_all("h1")]
    h2 = [h.get_text(strip=True) for h in soup.find_all("h2")]
    h3 = [h.get_text(strip=True) for h in soup.find_all("h3")]

    # remove script/style/nav/footer noise for body text but keep separately
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    main = soup.find("main") or soup.find(id="content") or soup.body
    text_blocks = []
    if main:
        for el in main.find_all(["p", "li", "blockquote", "figcaption", "a"]):
            t = el.get_text(" ", strip=True)
            if t and len(t) > 1:
                text_blocks.append(t)
    # dedupe keep order
    seen = set()
    clean_text = []
    for t in text_blocks:
        if t not in seen:
            seen.add(t)
            clean_text.append(t)

    # images
    imgs = []
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        srcset = img.get("srcset") or ""
        alt = img.get("alt", "")
        if src:
            full = urljoin(url, src)
            imgs.append({"src": full, "alt": alt})
            all_images[full] = alt

    # also background-image urls in style attrs
    for el in soup.find_all(style=True):
        m = re.findall(r'url\((.*?)\)', el["style"])
        for u in m:
            u = u.strip('\'" ')
            if u:
                full = urljoin(url, u)
                imgs.append({"src": full, "alt": "(background)"})
                all_images.setdefault(full, "(background)")

    page_data = {
        "url": url,
        "slug": s,
        "title": title,
        "meta_description": meta_desc,
        "h1": h1,
        "h2": h2,
        "h3": h3,
        "text_blocks": clean_text,
        "images": imgs,
    }
    with open(f"{OUT_PAGES}/{s}.json", "w", encoding="utf-8") as f:
        json.dump(page_data, f, ensure_ascii=False, indent=2)

    site_map.append(page_data)
    time.sleep(2)

with open("resources/sitemap_extracted.json", "w", encoding="utf-8") as f:
    json.dump(site_map, f, ensure_ascii=False, indent=2)

with open("resources/all_images.json", "w", encoding="utf-8") as f:
    json.dump(all_images, f, ensure_ascii=False, indent=2)

print("DONE pages:", len(site_map), "images:", len(all_images))
