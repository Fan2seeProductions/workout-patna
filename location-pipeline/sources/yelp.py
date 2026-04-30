import os
import time
import requests

YELP_URL = "https://api.yelp.com/v3/businesses/search"
DAILY_CALL_LIMIT = 490  # stay under 500 free tier cap

CATEGORIES = [
    "gyms",
    "fitness",
    "yoga",
    "pilates",
    "crossfit",
    "martialarts",
    "swimmingpools",
    "parks",
    "sportscomplexes",
]


class YelpSource:
    def __init__(self, location: str, api_key: str | None = None):
        self.location = location
        self.api_key = api_key or os.getenv("YELP_API_KEY")
        if not self.api_key:
            raise ValueError("YELP_API_KEY not set")
        self._calls = 0

    def fetch(self) -> list[dict]:
        results = []
        for category in CATEGORIES:
            if self._calls >= DAILY_CALL_LIMIT:
                print(f"[yelp] Daily call limit reached — stopping at {self._calls} calls")
                break
            results.extend(self._fetch_category(category))
        return results

    def _fetch_category(self, category: str) -> list[dict]:
        records = []
        offset = 0
        while True:
            if self._calls >= DAILY_CALL_LIMIT:
                break
            params = {
                "location": self.location,
                "categories": category,
                "limit": 50,
                "offset": offset,
            }
            resp = requests.get(
                YELP_URL,
                headers={"Authorization": f"Bearer {self.api_key}"},
                params=params,
                timeout=10,
            )
            self._calls += 1
            time.sleep(0.2)
            if resp.status_code != 200:
                break
            data = resp.json()
            businesses = data.get("businesses", [])
            if not businesses:
                break
            records.extend(self._normalize(b) for b in businesses)
            if len(businesses) < 50:
                break
            offset += 50
        return records

    def _normalize(self, b: dict) -> dict:
        loc = b.get("location", {})
        coords = b.get("coordinates", {})
        return {
            "source": "yelp",
            "external_id": f"yelp:{b['id']}",
            "name": b.get("name", ""),
            "lat": coords.get("latitude"),
            "lon": coords.get("longitude"),
            "address": ", ".join(filter(None, [
                loc.get("address1"),
                loc.get("city"),
                loc.get("state"),
                loc.get("zip_code"),
            ])),
            "phone": b.get("display_phone"),
            "website": b.get("url"),
            "category": "yelp_" + "_".join(c["alias"] for c in b.get("categories", [])[:2]),
            "rating": b.get("rating"),
            "review_count": b.get("review_count"),
            "raw_tags": {},
        }
