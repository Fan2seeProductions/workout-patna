import requests

# Houston open data portals — parks and recreation facilities
OPEN_DATA_SOURCES = [
    {
        "name": "Houston Parks",
        "url": "https://data.houstontx.gov/resource/rv5k-txe2.json",
        "lat_field": "latitude",
        "lon_field": "longitude",
        "name_field": "name",
        "address_field": "address",
        "params": {"$limit": 1000},
    },
    {
        "name": "Houston Recreation Centers",
        "url": "https://data.houstontx.gov/resource/4neh-2e8t.json",
        "lat_field": "latitude",
        "lon_field": "longitude",
        "name_field": "facility_name",
        "address_field": "address",
        "params": {"$limit": 500},
    },
]

HEADERS = {"User-Agent": "WorkoutPatnaBot/1.0"}


class OpenDataSource:
    def fetch(self) -> list[dict]:
        results = []
        for source in OPEN_DATA_SOURCES:
            try:
                resp = requests.get(
                    source["url"],
                    params=source["params"],
                    headers=HEADERS,
                    timeout=20,
                )
                resp.raise_for_status()
                records = resp.json()
                for r in records:
                    normalized = self._normalize(r, source)
                    if normalized:
                        results.append(normalized)
            except Exception as e:
                print(f"[open_data] {source['name']} error: {e}")
        return results

    def _normalize(self, record: dict, source: dict) -> dict | None:
        try:
            lat = float(record.get(source["lat_field"], 0))
            lon = float(record.get(source["lon_field"], 0))
            if not lat or not lon:
                return None
            return {
                "source": "open_data",
                "external_id": f"opendata:{source['name']}:{record.get('id') or record.get('objectid') or hash(str(record))}",
                "name": record.get(source["name_field"], "Unknown"),
                "lat": lat,
                "lon": lon,
                "address": record.get(source.get("address_field"), ""),
                "phone": record.get("phone") or record.get("phone_number"),
                "website": record.get("website") or record.get("url"),
                "category": "park_or_rec_center",
                "raw_tags": record,
            }
        except (TypeError, ValueError):
            return None
