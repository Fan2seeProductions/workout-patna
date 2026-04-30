import streamlit as st
import re

def _sentences(text: str) -> list[str]:
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if len(s.strip()) > 20]

def _paragraphs(text: str) -> list[str]:
    return [p.strip() for p in re.split(r'\n{2,}', text) if len(p.strip()) > 30]

def _word_count(text: str) -> int:
    return len(text.split())

def _find_answer_snippets(paragraphs: list[str]) -> list[str]:
    snippets = []
    for p in paragraphs:
        wc = _word_count(p)
        if 40 <= wc <= 120:
            snippets.append(p)
    return snippets[:5]

def _find_faq_candidates(text: str) -> list[str]:
    candidates = []
    # Sentences that contain question words
    question_triggers = [
        r'\bwhat is\b', r'\bhow do(es)?\b', r'\bwho (is|are|can)\b',
        r'\bwhere (can|do|is)\b', r'\bwhy (does|is|should)\b',
        r'\bcan (i|you|users)\b', r'\bis (it|this|workoutpatna)\b',
        r'\bdoes (it|this|workoutpatna)\b',
    ]
    for sent in _sentences(text):
        for pattern in question_triggers:
            if re.search(pattern, sent.lower()):
                # Suggest a question form
                candidates.append(sent)
                break
    return candidates[:8]

def _heading_suggestions(text: str) -> list[str]:
    suggestions = []
    paras = _paragraphs(text)
    for p in paras:
        first_sent = _sentences(p)
        if first_sent:
            sent = first_sent[0]
            if len(sent) > 20 and not sent.endswith('?'):
                # Suggest converting to a heading
                suggestions.append(f"Consider making a heading from: \"{sent[:80]}...\"" if len(sent) > 80 else f"Potential heading: \"{sent}\"")
    return suggestions[:6]

def _answer_engine_issues(text: str) -> list[str]:
    issues = []
    wc = _word_count(text)
    paras = _paragraphs(text)
    avg_para_len = sum(_word_count(p) for p in paras) / max(len(paras), 1)

    if wc < 200:
        issues.append("⚠️ Content is very short — AI systems prefer at least 200–300 words of substantive content.")
    if avg_para_len > 120:
        issues.append("⚠️ Paragraphs are long — break into shorter, 40–80 word chunks for better AI extraction.")
    if not re.search(r'\b(is|are|helps|provides|allows|enables|connects)\b', text.lower()):
        issues.append("⚠️ Missing clear declarative statements — AI systems prefer direct 'X is Y' language.")
    if not re.search(r'\?', text):
        issues.append("💡 No question-style headings detected — FAQ-style H2/H3 headings improve AI snippet selection.")
    if re.search(r'click here|learn more|read more', text.lower()):
        issues.append("⚠️ Vague CTAs like 'click here' or 'learn more' reduce citation quality — use descriptive link text.")
    return issues


def render():
    st.title("✂️ Content Chunker + Answer Engine Auditor")
    st.caption(
        "Paste any page content to get answer-engine snippets, FAQ opportunities, "
        "heading suggestions, and AI readiness recommendations."
    )

    text = st.text_area(
        "Paste your page content here",
        height=300,
        placeholder=(
            "WorkoutPatna is a fitness social networking app...\n\n"
            "Paste the full text of any webpage, blog post, or landing page."
        ),
    )

    if st.button("Audit Content", type="primary") and text.strip():
        paras    = _paragraphs(text)
        snippets = _find_answer_snippets(paras)
        faqs     = _find_faq_candidates(text)
        headings = _heading_suggestions(text)
        issues   = _answer_engine_issues(text)

        col1, col2, col3 = st.columns(3)
        col1.metric("Word Count",          _word_count(text))
        col2.metric("Paragraph Count",     len(paras))
        col3.metric("Answer Snippets Found", len(snippets))

        st.markdown("---")

        # Best Answer Snippets
        st.subheader("🎯 Best Answer Snippets (40–120 words)")
        st.caption("These are the paragraphs most likely to be quoted by AI answer engines.")
        if snippets:
            for i, s in enumerate(snippets, 1):
                with st.expander(f"Snippet {i} — {_word_count(s)} words"):
                    st.write(s)
        else:
            st.warning(
                "No ideal answer snippets found. Most paragraphs are either too short "
                "or too long. Aim for 40–120 word explanatory paragraphs."
            )

        st.markdown("---")

        # FAQ Candidates
        st.subheader("❓ FAQ Candidates")
        st.caption(
            "These sentences could become FAQ questions. Pair each with a 2–4 sentence answer."
        )
        if faqs:
            for f in faqs:
                st.markdown(f"- {f}")
        else:
            st.info("No obvious FAQ candidates found — try adding 'What is...', 'How does...', or 'Who is...' phrasing.")

        st.markdown("---")

        # Heading Suggestions
        st.subheader("📋 Suggested Heading Improvements")
        if headings:
            for h in headings:
                st.markdown(f"- {h}")
        else:
            st.success("Content already has good heading-ready sentences.")

        st.markdown("---")

        # Answer Engine Issues
        st.subheader("⚡ Answer Engine Improvements")
        if issues:
            for issue in issues:
                st.markdown(issue)
        else:
            st.success("No major answer engine issues detected.")

        st.markdown("---")

        # Content Structure Notes
        st.subheader("📝 Content Structure Notes")
        notes = []
        if len(paras) < 3:
            notes.append("Add more distinct paragraphs — aim for 5–10 focused paragraphs per page section.")
        if _word_count(text) < 400:
            notes.append("Expand content to 400–800 words for competitive AI visibility.")
        if not any(p.startswith(('-', '*', '1.')) for p in paras):
            notes.append("Consider adding a bulleted or numbered list — list items are highly extracted by AI systems.")
        if notes:
            for n in notes:
                st.markdown(f"- {n}")
        else:
            st.success("Content structure looks solid.")
