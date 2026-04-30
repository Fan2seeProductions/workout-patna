import os
import psycopg2
import psycopg2.extras

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS locations (
    id            SERIAL PRIMARY KEY,
    fingerprint   TEXT UNIQUE NOT NULL,
    source        TEXT,
    external_id   TEXT,
    name          TEXT NOT NULL,
    lat           DOUBLE PRECISION NOT NULL,
    lon           DOUBLE PRECISION NOT NULL,
    address       TEXT,
    phone         TEXT,
    website       TEXT,
    category      TEXT,
    rating        NUMERIC(3,1),
    review_count  INT,
    raw_tags      JSONB,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
"""

UPSERT_SQL = """
INSERT INTO locations
    (fingerprint, source, external_id, name, lat, lon,
     address, phone, website, category, rating, review_count, raw_tags)
VALUES %s
ON CONFLICT (fingerprint) DO UPDATE SET
    name         = EXCLUDED.name,
    address      = COALESCE(EXCLUDED.address, locations.address),
    phone        = COALESCE(EXCLUDED.phone, locations.phone),
    website      = COALESCE(EXCLUDED.website, locations.website),
    rating       = COALESCE(EXCLUDED.rating, locations.rating),
    review_count = COALESCE(EXCLUDED.review_count, locations.review_count),
    raw_tags     = locations.raw_tags || EXCLUDED.raw_tags,
    updated_at   = NOW();
"""

import json as _json


class Upserter:
    def __init__(self, dsn: str | None = None):
        self.dsn = dsn or os.getenv("DATABASE_URL")
        if not self.dsn:
            raise ValueError("DATABASE_URL not set")

    def ensure_table(self):
        with psycopg2.connect(self.dsn) as conn, conn.cursor() as cur:
            cur.execute(CREATE_TABLE_SQL)

    def upsert_batch(self, records: list[dict]):
        rows = [
            (
                r["fingerprint"],
                r.get("source"),
                r.get("external_id"),
                r["name"],
                r["lat"],
                r["lon"],
                r.get("address"),
                r.get("phone"),
                r.get("website"),
                r.get("category"),
                r.get("rating"),
                r.get("review_count"),
                _json.dumps(r.get("raw_tags") or {}),
            )
            for r in records
        ]
        with psycopg2.connect(self.dsn) as conn, conn.cursor() as cur:
            psycopg2.extras.execute_values(cur, UPSERT_SQL, rows, page_size=200)
        print(f"[upsert] {len(rows)} records upserted")
