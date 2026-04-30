import os
import meilisearch

INDEX_NAME = "locations"

SEARCHABLE = ["name", "address", "category"]
FILTERABLE = ["category", "source"]
SORTABLE = ["rating", "review_count"]


class MeilisearchIndexer:
    def __init__(self, url: str | None = None, key: str | None = None):
        self.client = meilisearch.Client(
            url or os.getenv("MEILISEARCH_URL", "http://localhost:7700"),
            key or os.getenv("MEILISEARCH_KEY", ""),
        )

    def ensure_index(self):
        try:
            self.client.create_index(INDEX_NAME, {"primaryKey": "id"})
        except Exception:
            pass
        index = self.client.index(INDEX_NAME)
        index.update_searchable_attributes(SEARCHABLE)
        index.update_filterable_attributes(FILTERABLE)
        index.update_sortable_attributes(SORTABLE)

    def index_records(self, records: list[dict]):
        docs = [
            {
                "id": r["fingerprint"],
                "name": r["name"],
                "lat": r["lat"],
                "lon": r["lon"],
                "address": r.get("address", ""),
                "category": r.get("category", ""),
                "source": r.get("source", ""),
                "rating": r.get("rating"),
                "review_count": r.get("review_count"),
                "website": r.get("website", ""),
            }
            for r in records
        ]
        self.client.index(INDEX_NAME).add_documents(docs, primary_key="id")
        print(f"[indexer] {len(docs)} documents sent to Meilisearch")
