# Universal LLM Visibility + Answer Engine Optimization Dashboard

A Streamlit tool for auditing and improving how AI assistants discover, cite, and surface your web content.

## Modules

| Module | What it does |
|--------|-------------|
| **AI Bot Validator** | Fetches your robots.txt and checks access for 9 AI crawlers (GPTBot, ClaudeBot, Google-Extended, etc.) |
| **llms.txt Architect** | Generates a structured `/llms.txt` file — a plain-language AI context guide for your site |
| **Schema Factory** | Builds valid JSON-LD for Organization, LocalBusiness, SoftwareApplication, and FAQPage |
| **Content Chunker** | Audits pasted page text for answer snippets, FAQ opportunities, and AI readability issues |
| **Readiness Checklist** | Scores your page 0–100 across 11 weighted AEO signals with auto-checks and recommendations |

## Setup

```bash
cd universal-llm-visibility-dashboard
pip install -r requirements.txt
streamlit run app.py
```

The dashboard opens at `http://localhost:8501`.

## Deployment (Streamlit Community Cloud)

1. Push this directory to a public GitHub repo
2. Go to [share.streamlit.io](https://share.streamlit.io) → New app
3. Point it at `app.py` in this directory
4. Deploy — free, no server needed

## Pre-filled defaults

All inputs default to WorkoutPatna values. Clear them to audit any other site.
