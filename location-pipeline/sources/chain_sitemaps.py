import re
import time
import requests
from xml.etree import ElementTree

CHAINS = [
    {
        "name": "Planet Fitness",
        "sitemap": "https://www.planetfitness.com/sitemap.xml",
        "loc_pattern": re.compile(r"/gyms/texas/"),
    },
    {
        "name": "Anytime Fitness",
        "sitemap": "https://www.anytimefitness.com/sitemap.xml",
        "loc_pattern": re.compile(r"/gyms/us/tx/"),
    },
    {
        "name": "Crunch Fitness",
        "sitemap": "https://www.crunch.com/sitemap.xml",
        "loc_pattern": re.compile(r"/gyms/tx/|/texas/"),
    },
]

SCHEMA_PATTERNS = {
    "name": re.compile(r'"name"\s*:\s*"([^"]+)"'),
    "lat": re.compile(r'"latitude"\s*:\s*([\d.\-]+)'),
    "lon": re.compile(r'"longitude"\s*:\s*([\d.\-]+)'),
    "address": re.compile(r'"streetAddress"\s*:\s*"([^"]+)"'),
    "phone": re.compile(r'"telephone"\s*:\s*"([^"]+)"'),
}

HEADERS = {"User-Agent": "WorkoutPatnaBot/1.0 (fitness app location data)"}


class ChainSitemapSource:
    def fetch(self) -> list[dict]:
        results = []
        for chain in CHAINS:
            urls = self._get_location_urls(chain)
            for url in urls[:100]:  # cap at 100 per chain to stay polite
                record = self._scrape_page(url, chain["name"])
                if record:
                    results.append(record)
                time.sleep(1.0)
        return results

    def _get_location_urls(self, chain: dict) -> list[str]:
        try:
            resp = requests.get(chain["sitemap"], headers=HEADERS, timeout=15)
            root = ElementTree.fromstring(resp.content)
            ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            urls = []
            for loc in root.findall(".//sm:loc", ns):
                if loc.text and chain["loc_pattern"].search(loc.text):
                    urls.append(loc.text)
            return urls
        except Exception as e:
            print(f"[chain_sitemaps] {chain['name']} sitemap error: {e}")
            return []

    def _scrape_page(self, url: str, chain_name: str) -> dict | None:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code != 200:
                return None
            html = resp.text
            extracted = {}
            for field, pattern in SCHEMA_PATTERNS.items():
                m = pattern.search(html)
                if m:
                    extracted[field] = m.group(1)
            if not extracted.get("name") or not extracted.get("lat"):
                return None
            return {
                "source": "chain_sitemap",
                "external_id": f"chain:{url}",
                "name": extracted.get("name", chain_name),
                "lat": float(extracted["lat"]),
                "lon": float(extracted.get("lon", 0)),
                "address": extracted.get("address"),
                "phone": extracted.get("phone"),
                "website": url,
                "category": "gym_chain",
                "raw_tags": {"chain": chain_name},
            }
        except Exception as e:
            print(f"[chain_sitemaps] Error scraping {url}: {e}")
            return None
