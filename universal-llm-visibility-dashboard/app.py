"""
Universal LLM Visibility + Answer Engine Optimization Dashboard
For: WorkoutPatna and any website
"""

import streamlit as st

st.set_page_config(
    page_title="LLM Visibility Dashboard",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Sidebar navigation ──────────────────────────────────────────────────────
st.sidebar.title("🔍 LLM Visibility Dashboard")
st.sidebar.caption("AI Discovery & Answer Engine Optimization")

MODULES = {
    "🏠 Home":                    "home",
    "🤖 AI Bot Validator":        "bot_validator",
    "📄 llms.txt Architect":      "llms_txt",
    "🧩 JSON-LD Schema Factory":  "schema_factory",
    "✂️ Content Chunker & Auditor": "content_chunker",
    "✅ Answer Engine Checklist": "checklist",
}

selected = st.sidebar.radio("Module", list(MODULES.keys()))
module   = MODULES[selected]

st.sidebar.markdown("---")
st.sidebar.caption("Built for WorkoutPatna · Reusable for any site")

# ─── Route to module ─────────────────────────────────────────────────────────
if module == "home":
    from modules import home; home.render()
elif module == "bot_validator":
    from modules import bot_validator; bot_validator.render()
elif module == "llms_txt":
    from modules import llms_txt; llms_txt.render()
elif module == "schema_factory":
    from modules import schema_factory; schema_factory.render()
elif module == "content_chunker":
    from modules import content_chunker; content_chunker.render()
elif module == "checklist":
    from modules import checklist; checklist.render()
