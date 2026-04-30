import streamlit as st

def render():
    st.title("📄 llms.txt Architect")
    st.caption(
        "Generate a structured llms.txt file — a plain-language guide for AI systems "
        "about what your site is and what matters most."
    )

    st.info(
        "llms.txt is an emerging convention (proposed at llmstxt.org) that gives AI "
        "assistants a curated, human-readable summary of your site — similar to what "
        "robots.txt does for crawlers, but optimized for LLM context windows."
    )

    with st.form("llms_form"):
        st.subheader("Site Details")

        col1, col2 = st.columns(2)
        with col1:
            site_name   = st.text_input("Site / Business Name", value="WorkoutPatna")
            domain      = st.text_input("Primary Domain", value="https://workoutpatna.com")
        with col2:
            tagline     = st.text_input("One-line tagline",
                                        value="Find Your Gym Partner")
            location    = st.text_input("Location (if local)",
                                        value="Houston, TX (Cypress area)")

        summary = st.text_area(
            "Short summary (2–4 sentences — what the site/app does and who it's for)",
            value=(
                "WorkoutPatna is a fitness social networking app that helps people find "
                "workout partners at gyms, apartment fitness centers, community centers, "
                "parks, and run clubs. It is designed for everyday fitness people who want "
                "accountability and community — not personal trainers. Currently launching "
                "in Houston, Texas, starting with Cypress and surrounding suburbs."
            ),
            height=120,
        )

        st.subheader("Key Pages (up to 6)")
        links = []
        for i in range(1, 7):
            col_url, col_desc = st.columns([2, 3])
            with col_url:
                url = st.text_input(f"URL {i}", key=f"url_{i}",
                                    value="https://workoutpatna.com" if i == 1 else "")
            with col_desc:
                desc = st.text_input(f"Description {i}", key=f"desc_{i}",
                                     value="Homepage — find workout partners near you" if i == 1 else "")
            if url:
                links.append((url, desc))

        st.subheader("What the site does (bullet list, one item per line)")
        features = st.text_area(
            "Key features / capabilities",
            value=(
                "Gym partner matching at local fitness centers\n"
                "Apartment complex fitness center community\n"
                "Run club and outdoor workout group discovery\n"
                "Fitness accountability partner matching\n"
                "Local fitness community building in Houston"
            ),
            height=130,
        )

        st.subheader("Who it's for")
        audience = st.text_area(
            "Target audience",
            value=(
                "Anyone who works out and wants a partner — not a trainer — to stay consistent. "
                "Gym-goers, runners, apartment residents with fitness centers, and people seeking "
                "a local fitness community in Houston, TX."
            ),
            height=80,
        )

        submitted = st.form_submit_button("Generate llms.txt", type="primary")

    if submitted:
        feature_lines = "\n".join(
            f"- {f.strip()}" for f in features.splitlines() if f.strip()
        )
        link_lines = "\n".join(
            f"- [{url}]({url}){': ' + desc if desc else ''}"
            for url, desc in links
        )

        output = f"""# {site_name}

> {summary}

## Key Information

**Tagline:** {tagline}
**Website:** {domain}
{"**Location:** " + location if location else ""}

## Key Links

{link_lines if link_lines else f"- [{domain}]({domain})"}

## What {site_name} Does

{feature_lines}

## Who It Is For

{audience}
"""

        st.subheader("Generated llms.txt")
        st.code(output, language="markdown")
        st.download_button("⬇️ Download llms.txt", data=output,
                           file_name="llms.txt", mime="text/plain")

        st.info(
            f"Deploy this file at: `{domain}/llms.txt`\n\n"
            "In Next.js, place it in `/public/llms.txt`.\n"
            "In any static site, place it in the root public directory."
        )
