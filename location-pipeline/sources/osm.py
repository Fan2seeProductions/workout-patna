import requests
import time

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

OVERPASS_QUERY = """
[out:json][timeout:60][bbox:{south},{west},{north},{east}];
(
  node["leisure"="fitness_centre"];
  way["leisure"="fitness_centre"];
  node["leisure"="sports_centre"];
  way["leisure"="sports_centre"];
  node["amenity"="gym"];
  way["amenity"="gym"];
  node["leisure"="track"];
  way["leisure"="track"];
  node["leisure"="pitch"];
  node["leisure"="park"];
  way["leisure"="park"]["name"];
);
out center tags;
"""


class OSMSource:
    def __init__(self, bbox: tuple):
        self.south, self.west, self.north, self.east = bbox

    def fetch(self) -> list[dict]:
        query = OVERPASS_QUERY.format(
            south=self.south, west=self.west,
            north=self.north, east=self.east,
        )
        resp = requests.post(OVERPASS_URL, data={"data": query}, timeout=90)
        resp.raise_for_status()
        elements = resp.json().get("elements", [])
        return [self._normalize(e) for e in elements if self._has_coords(e)]

    def _has_coords(self, e: dict) -> bool:
        if e.get("lat") and e.get("lon"):
            return True
        center = e.get("center", {})
        return bool(center.get("lat") and center.get("lon"))

    def _normalize(self, e: dict) -> dict:
        tags = e.get("tags", {})
        lat = e.get("lat") or e["center"]["lat"]
        lon = e.get("lon") or e["center"]["lon"]
        return {
            "source": "osm",
            "external_id": f"osm:{e['type']}:{e['id']}",
            "name": tags.get("name", "Unnamed"),
            "lat": lat,
            "lon": lon,
            "address": tags.get("addr:full") or self._build_address(tags),
            "phone": tags.get("phone") or tags.get("contact:phone"),
            "website": tags.get("website") or tags.get("contact:website"),
            "category": tags.get("leisure") or tags.get("amenity"),
            "raw_tags": tags,
        }

    def _build_address(self, tags: dict) -> str | None:
        parts = [
            tags.get("addr:housenumber", ""),
            tags.get("addr:street", ""),
            tags.get("addr:city", ""),
            tags.get("addr:state", ""),
            tags.get("addr:postcode", ""),
        ]
        result = " ".join(p for p in parts if p).strip()
        return result or None
