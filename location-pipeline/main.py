#!/usr/bin/env python3
"""
WorkoutPatna Location Ingestion Pipeline
Run: python main.py [--metro houston] [--sources all|osm|yelp|chains|open_data]
"""
import argparse
import sys

from config import METROS, PRIMARY_METRO
from sources.osm import OSMSource
from sources.yelp import YelpSource
from sources.chain_sitemaps import ChainSitemapSource
from sources.open_data import OpenDataSource
from pipeline.deduplicator import Deduplicator
from pipeline.upsert import Upserter
from search.indexer import MeilisearchIndexer


def run(metro_key: str, sources_arg: str):
    metro = METROS[metro_key]
    print(f"\n=== WorkoutPatna Pipeline — {metro['city']}, {metro['state']} ===\n")

    raw: list[dict] = []

    if sources_arg in ("all", "osm"):
        print("[1/4] Fetching OSM...")
        osm = OSMSource(metro["bbox"])
        osm_records = osm.fetch()
        print(f"      {len(osm_records)} records from OSM")
        raw.extend(osm_records)

    if sources_arg in ("all", "yelp"):
        print("[2/4] Fetching Yelp...")
        yelp = YelpSource(metro["yelp_location"])
        yelp_records = yelp.fetch()
        print(f"      {len(yelp_records)} records from Yelp")
        raw.extend(yelp_records)

    if sources_arg in ("all", "chains"):
        print("[3/4] Fetching chain sitemaps...")
        chains = ChainSitemapSource()
        chain_records = chains.fetch()
        print(f"      {len(chain_records)} records from chain sitemaps")
        raw.extend(chain_records)

    if sources_arg in ("all", "open_data"):
        print("[4/4] Fetching open data portals...")
        od = OpenDataSource()
        od_records = od.fetch()
        print(f"      {len(od_records)} records from open data")
        raw.extend(od_records)

    # Filter records missing coordinates
    raw = [r for r in raw if r.get("lat") and r.get("lon")]
    print(f"\nTotal raw records (with coords): {len(raw)}")

    # Dedup
    print("Deduplicating...")
    deduper = Deduplicator()
    unique = deduper.deduplicate(raw)
    print(f"Unique locations after dedup: {len(unique)}")

    # Upsert to Postgres
    print("Upserting to database...")
    upserter = Upserter()
    upserter.ensure_table()
    upserter.upsert_batch(unique)

    # Index in Meilisearch
    print("Indexing in Meilisearch...")
    indexer = MeilisearchIndexer()
    indexer.ensure_index()
    indexer.index_records(unique)

    print(f"\nDone. {len(unique)} locations ready.\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--metro", default=PRIMARY_METRO, choices=list(METROS.keys()))
    parser.add_argument("--sources", default="all",
                        choices=["all", "osm", "yelp", "chains", "open_data"])
    args = parser.parse_args()
    run(args.metro, args.sources)
