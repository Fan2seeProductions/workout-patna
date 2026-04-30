import time
import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent": "WorkoutPatnaBot/1.0 (sales@fan2seeproductions.com)"}
MIN_INTERVAL = 1.1  # Nominatim ToS: max 1 req/sec


class NominatimGeocoder:
    def __init__(self):
        self._last_call = 0.0

    def geocode(self, address: str) -> tuple[float, float] | None:
        self._throttle()
        try:
            resp = requests.get(
                NOMINATIM_URL,
                params={"q": address, "format": "json", "limit": 1},
                headers=HEADERS,
                timeout=10,
            )
            results = resp.json()
            if results:
                return float(results[0]["lat"]), float(results[0]["lon"])
        except Exception as e:
            print(f"[geocoder] Error geocoding '{address}': {e}")
        return None

    def _throttle(self):
        elapsed = time.monotonic() - self._last_call
        if elapsed < MIN_INTERVAL:
            time.sleep(MIN_INTERVAL - elapsed)
        self._last_call = time.monotonic()
