import streamlit as st
import requests
from urllib.robotparser import RobotFileParser
from urllib.parse import urlparse

AI_BOTS = {
    "GPTBot":          "OpenAI — ChatGPT training and browsing",
    "ClaudeBot":       "Anthropic — Claude AI training and browsing",
    "Google-Extended": "Google — Gemini / AI Overviews training",
    "PerplexityBot":   "Perplexity AI — Answer engine",
    "Applebot-Extended": "Apple — Apple Intelligence",
    "cohere-ai":       "Cohere — Enterprise LLM",
    "Bytespider":      "TikTok / ByteDance AI",
    "CCBot":           "Common Crawl — Used by many LLM training datasets",
    "Googlebot":       "Google Search (standard)",
}

STARTER_ROBOTS = """User-agent: *
Allow: /

# AI crawlers — explicitly allow
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
"""

def fetch_robots(url: str) -> tuple[str | None, str | None]:
    try:
        base   = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        robots_url = f"{base}/robots.txt"
        resp   = requests.get(robots_url, timeout=8,
                              headers={"User-Agent": "LLMVisibilityBot/1.0"})
        if resp.status_code == 200:
            return resp.text, robots_url
        return None, robots_url
    except Exception as e:
        return None, str(e)

def check_bot(rp: RobotFileParser, bot: str, url: str) -> str:
    try:
        return "✅ Allowed" if rp.can_fetch(bot, url) else "🚫 Blocked"
    except Exception:
        return "⚠️ Unknown"

def render():
    st.title("🤖 AI Bot Validator")
    st.caption("Check whether AI crawlers can access your site")

    url = st.text_input("Enter your website URL", value="https://workoutpatna.com",
                        placeholder="https://example.com")

    if st.button("Check AI Bot Access", type="primary"):
        if not url.startswith("http"):
            url = "https://" + url

        with st.spinner("Fetching robots.txt..."):
            content, robots_url = fetch_robots(url)

        if content is None:
            st.error(f"Could not fetch robots.txt from {robots_url}")
            st.info("This may mean robots.txt does not exist or the site is unreachable.")
        else:
            st.success(f"robots.txt found at: {robots_url}")

            with st.expander("📄 View raw robots.txt"):
                st.code(content, language="text")

            # Parse
            rp = RobotFileParser()
            rp.parse(content.splitlines())

            st.subheader("AI Crawler Access Results")
            base = f"{urlparse(url).scheme}://{urlparse(url).netloc}/"

            rows = []
            for bot, description in AI_BOTS.items():
                status = check_bot(rp, bot, base)
                rows.append({"Bot": bot, "Description": description, "Status": status})

            import pandas as pd
            df = pd.DataFrame(rows)
            st.dataframe(df, use_container_width=True, hide_index=True)

            # Recommendations
            blocked = [r["Bot"] for r in rows if "Blocked" in r["Status"]]
            unknown = [r["Bot"] for r in rows if "Unknown" in r["Status"]]

            st.subheader("Recommendations")
            if not blocked and not unknown:
                st.success("All major AI bots are allowed. Your site is well-configured for AI crawling.")
            else:
                if blocked:
                    st.warning(f"These bots are explicitly blocked: **{', '.join(blocked)}**")
                    st.markdown("Consider allowing these if you want AI assistants to cite and discover your content.")
                if unknown:
                    st.info(f"Status unclear for: **{', '.join(unknown)}** — add explicit Allow rules to be safe.")

        st.subheader("📋 Starter robots.txt Template")
        st.caption("Use this if your robots.txt is missing or needs AI crawler rules")
        st.code(STARTER_ROBOTS.replace("yourdomain.com",
                urlparse(url).netloc if url else "yourdomain.com"), language="text")
