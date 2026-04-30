import streamlit as st
import requests
import re

CHECKS = [
    # (id, label, description, weight, how_to_check)
    ("answer_first",    "Direct answer stated early",
     "Does the page open with a clear, direct statement of what the site/app does?", 15,
     "manual"),
    ("declarative",     "Declarative 'X is Y' language",
     "Does the page use clear declarative sentences like 'WorkoutPatna is a...'?", 10,
     "text"),
    ("faq_headings",    "FAQ-style headings present",
     "Does the page use question-style H2/H3 headings like 'What is...?'", 10,
     "text"),
    ("short_paragraphs","Short, extractable paragraphs (40–120 words)",
     "Are most paragraphs in the 40–120 word range AI systems prefer?", 10,
     "manual"),
    ("entity_name",     "Entity name appears in first 100 words",
     "Is the brand/business name clearly stated near the top?", 10,
     "text"),
    ("schema_present",  "JSON-LD structured data present",
     "Does the page include Organization, WebSite, or other schema markup?", 15,
     "url"),
    ("robots_ai",       "AI bots allowed in robots.txt",
     "Does robots.txt explicitly allow GPTBot, ClaudeBot, Google-Extended?", 10,
     "url"),
    ("llms_txt",        "llms.txt file present",
     "Does the site have a /llms.txt file for AI context?", 5,
     "url"),
    ("canonical",       "Canonical URL tag present",
     "Does the page have a canonical URL to prevent duplicate content issues?", 5,
     "url"),
    ("og_tags",         "Open Graph tags present",
     "Does the page have og:title, og:description, og:image?", 5,
     "url"),
    ("sitemap",         "sitemap.xml present",
     "Does the site have a sitemap at /sitemap.xml?", 5,
     "url"),
]

def check_url_signals(url: str) -> dict:
    results = {}
    try:
        base = "/".join(url.split("/")[:3])

        # Check robots.txt
        try:
            robots = requests.get(f"{base}/robots.txt", timeout=6).text.lower()
            results["robots_ai"] = any(
                bot in robots for bot in ["gptbot", "claudebot", "google-extended"]
            )
        except Exception:
            results["robots_ai"] = None

        # Check llms.txt
        try:
            r = requests.get(f"{base}/llms.txt", timeout=6)
            results["llms_txt"] = r.status_code == 200
        except Exception:
            results["llms_txt"] = None

        # Check sitemap
        try:
            r = requests.get(f"{base}/sitemap.xml", timeout=6)
            results["sitemap"] = r.status_code == 200
        except Exception:
            results["sitemap"] = None

        # Fetch homepage HTML for meta/schema checks
        try:
            page = requests.get(url, timeout=10,
                                headers={"User-Agent": "LLMVisibilityBot/1.0"}).text
            results["schema_present"] = "application/ld+json" in page
            results["canonical"]      = 'rel="canonical"' in page or "rel='canonical'" in page
            results["og_tags"]        = 'og:title' in page and 'og:description' in page
        except Exception:
            results["schema_present"] = None
            results["canonical"]      = None
            results["og_tags"]        = None

    except Exception:
        pass
    return results

def check_text_signals(text: str, url: str) -> dict:
    results = {}
    lower = text.lower()

    results["declarative"] = bool(re.search(
        r'\b(workoutpatna|this app|this site|this platform)\s+is\b', lower
    ))
    results["faq_headings"] = bool(re.search(
        r'\b(what is|how do|who is|where can|why does|can i)\b', lower
    ))
    # Entity name in first 100 words
    first_100 = " ".join(text.split()[:100]).lower()
    entity    = url.replace("https://", "").replace("http://", "").split("/")[0].replace(".", "").replace("www", "").lower()
    results["entity_name"] = entity in first_100 or "workoutpatna" in first_100

    return results


def render():
    st.title("✅ Answer Engine Readiness Checklist")
    st.caption("Score your page's readiness for AI assistants and answer engines")

    col1, col2 = st.columns(2)
    with col1:
        url = st.text_input("Page URL to check", value="https://workoutpatna.com")
    with col2:
        st.markdown("<br>", unsafe_allow_html=True)
        run_checks = st.button("Run Readiness Check", type="primary")

    text = st.text_area(
        "Optionally paste page text for deeper content checks",
        height=150,
        placeholder="Paste your homepage text here for content-level checks...",
    )

    manual_overrides = {}
    with st.expander("📋 Manual checks (answer these yourself)"):
        st.caption("These cannot be auto-detected — answer based on your knowledge of the page.")
        for check_id, label, desc, weight, method in CHECKS:
            if method == "manual":
                manual_overrides[check_id] = st.checkbox(
                    f"{label} ({weight} pts) — {desc}", key=f"manual_{check_id}"
                )

    if run_checks:
        with st.spinner("Checking URL signals..."):
            url_results  = check_url_signals(url)
            text_results = check_text_signals(text, url) if text.strip() else {}

        all_results = {**url_results, **text_results, **manual_overrides}

        total_possible = sum(w for _, _, _, w, _ in CHECKS)
        earned = 0
        rows   = []

        for check_id, label, desc, weight, method in CHECKS:
            val = all_results.get(check_id)
            if val is True:
                status = "✅ Pass"
                earned += weight
            elif val is False:
                status = "❌ Fail"
            elif val is None:
                status = "⚠️ Unknown"
            else:
                status = "⚠️ Unknown"

            rows.append({
                "Check":       label,
                "Status":      status,
                "Points":      f"{weight} pts",
                "Notes":       desc,
            })

        score_pct = round((earned / total_possible) * 100)

        # Score display
        st.markdown("---")
        col1, col2, col3 = st.columns(3)
        col1.metric("Score", f"{score_pct}/100")
        col2.metric("Points Earned", f"{earned}/{total_possible}")

        grade = "🟢 Good" if score_pct >= 70 else "🟡 Needs Work" if score_pct >= 45 else "🔴 Poor"
        col3.metric("Rating", grade)

        st.progress(score_pct / 100)

        st.markdown("---")
        import pandas as pd
        df = pd.DataFrame(rows)
        st.dataframe(df, use_container_width=True, hide_index=True)

        # Recommendations
        st.subheader("Priority Improvements")
        fails = [r for r in rows if "Fail" in r["Status"]]
        unknowns = [r for r in rows if "Unknown" in r["Status"]]

        if fails:
            st.error(f"**Fix these first ({len(fails)} failing):**")
            for f in fails:
                st.markdown(f"- **{f['Check']}** — {f['Notes']}")
        if unknowns:
            st.warning(f"**Could not auto-check ({len(unknowns)} items) — verify manually:**")
            for u in unknowns:
                st.markdown(f"- **{u['Check']}** — {u['Notes']}")
        if not fails and not unknowns:
            st.success("All checks passed! Your page has strong AI and answer engine readiness.")
