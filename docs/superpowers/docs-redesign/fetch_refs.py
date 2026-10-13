import urllib.request, json
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}

SITES = {
    "bechtel": "https://www.bechtel.com",
    "arup": "https://www.arup.com",
}

out = {}
for key, url in SITES.items():
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as r:
            html = r.read()
        with open(f"resources/ref_{key}.html", "wb") as f:
            f.write(html)
        soup = BeautifulSoup(html, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else ""
        nav_links = []
        for nav in soup.find_all(["nav"]):
            for a in nav.find_all("a"):
                t = a.get_text(strip=True)
                if t:
                    nav_links.append(t)
        h1 = [h.get_text(strip=True) for h in soup.find_all("h1")]
        h2 = [h.get_text(strip=True) for h in soup.find_all("h2")][:30]
        out[key] = {"title": title, "nav_links": list(dict.fromkeys(nav_links))[:40], "h1": h1, "h2": h2}
        print(key, "OK", "len html:", len(html))
    except Exception as e:
        out[key] = {"error": str(e)}
        print(key, "ERROR", e)

with open("resources/ref_sites_structure.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
