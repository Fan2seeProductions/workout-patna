import hashlib
import math
from rapidfuzz import fuzz


def make_fingerprint(name: str, lat: float, lon: float) -> str:
    rounded_lat = round(lat, 3)
    rounded_lon = round(lon, 3)
    key = f"{name.lower().strip()}|{rounded_lat}|{rounded_lon}"
    return hashlib.sha256(key.encode()).hexdigest()


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class Deduplicator:
    def __init__(self, radius_meters: int = 75, fuzzy_threshold: int = 88):
        self.radius = radius_meters
        self.threshold = fuzzy_threshold

    def deduplicate(self, records: list[dict]) -> list[dict]:
        seen: list[dict] = []
        for record in records:
            if not self._is_duplicate(record, seen):
                record["fingerprint"] = make_fingerprint(
                    record["name"], record["lat"], record["lon"]
                )
                seen.append(record)
        return seen

    def _is_duplicate(self, candidate: dict, seen: list[dict]) -> bool:
        for existing in seen:
            dist = haversine_meters(
                candidate["lat"], candidate["lon"],
                existing["lat"], existing["lon"],
            )
            if dist <= self.radius:
                score = fuzz.token_sort_ratio(
                    candidate["name"].lower(),
                    existing["name"].lower(),
                )
                if score >= self.threshold:
                    return True
        return False
