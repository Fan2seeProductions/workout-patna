METROS = {
    "houston": {
        "city": "Houston",
        "state": "TX",
        "bbox": (29.52, -95.79, 30.11, -95.01),  # south, west, north, east
        "focus_areas": [
            "Cypress, TX",
            "Katy, TX",
            "Spring, TX",
            "The Woodlands, TX",
            "Sugar Land, TX",
            "Pearland, TX",
            "Humble, TX",
            "Tomball, TX",
        ],
        "yelp_location": "Cypress, TX",
    }
}

PRIMARY_METRO = "houston"

AMENITY_PATTERNS = [
    r"gym",
    r"fitness",
    r"crossfit",
    r"ymca",
    r"planet fitness",
    r"anytime fitness",
    r"la fitness",
    r"crunch",
    r"24 hour",
    r"equinox",
    r"orangetheory",
    r"f45",
    r"workout",
    r"sport",
    r"recreation center",
    r"rec center",
    r"aquatic",
    r"swimming",
    r"run club",
    r"trail",
    r"park.*fitness",
]

DEDUP_RADIUS_METERS = 75
FUZZY_MATCH_THRESHOLD = 88
