import streamlit as st
import json

def render():
    st.title("🧩 JSON-LD Schema Factory")
    st.caption("Generate valid structured data for SEO and AI entity recognition")

    schema_type = st.selectbox(
        "Select Schema Type",
        ["Organization", "LocalBusiness", "SoftwareApplication", "FAQPage"],
    )

    st.markdown("---")

    if schema_type == "Organization":
        _org_schema()
    elif schema_type == "LocalBusiness":
        _local_business_schema()
    elif schema_type == "SoftwareApplication":
        _software_app_schema()
    elif schema_type == "FAQPage":
        _faq_schema()


def _output(schema: dict):
    output = json.dumps(schema, indent=2)
    st.subheader("Generated JSON-LD")
    st.code(f'<script type="application/ld+json">\n{output}\n</script>', language="html")
    st.download_button("⬇️ Download JSON-LD", data=output,
                       file_name="schema.json", mime="application/json")
    st.info(
        "In Next.js App Router, add this inside `<head>` using a `<Script>` component "
        "with `strategy='beforeInteractive'` and `type='application/ld+json'`."
    )


def _org_schema():
    st.subheader("Organization Schema")
    with st.form("org_form"):
        col1, col2 = st.columns(2)
        with col1:
            name   = st.text_input("Organization Name", value="WorkoutPatna")
            url    = st.text_input("Website URL",        value="https://workoutpatna.com")
            logo   = st.text_input("Logo URL",           value="https://workoutpatna.com/logo.png")
        with col2:
            email  = st.text_input("Contact Email",      value="hello@workoutpatna.com")
            phone  = st.text_input("Phone (optional)",   value="")
        same_as = st.text_area(
            "sameAs URLs — social profiles, one per line",
            value="",
            placeholder="https://twitter.com/workoutpatna\nhttps://instagram.com/workoutpatna",
        )
        submitted = st.form_submit_button("Generate", type="primary")

    if submitted:
        schema: dict = {
            "@context": "https://schema.org",
            "@type":    "Organization",
            "name":     name,
            "url":      url,
        }
        if logo:  schema["logo"] = logo
        if email: schema["contactPoint"] = {"@type": "ContactPoint", "email": email, "contactType": "customer support"}
        if phone: schema["telephone"] = phone
        urls = [u.strip() for u in same_as.splitlines() if u.strip()]
        if urls: schema["sameAs"] = urls
        _output(schema)


def _local_business_schema():
    st.subheader("LocalBusiness Schema")
    st.caption("Use this for a physical location or service-area business")
    with st.form("local_form"):
        col1, col2 = st.columns(2)
        with col1:
            name        = st.text_input("Business Name",  value="WorkoutPatna")
            url         = st.text_input("Website",        value="https://workoutpatna.com")
            description = st.text_area("Description",
                value="Fitness social networking app for finding workout partners in Houston, TX.")
            biz_type    = st.text_input("Business Type (schema.org subtype)",
                value="SportsActivityLocation",
                help="e.g. SportsActivityLocation, HealthClub, SportsClub")
        with col2:
            street  = st.text_input("Street Address",    value="")
            city    = st.text_input("City",              value="Cypress")
            state   = st.text_input("State",             value="TX")
            zip_    = st.text_input("ZIP",               value="77429")
            phone   = st.text_input("Phone",             value="")
            area    = st.text_input("Area Served",       value="Houston, TX Metro Area")
        submitted = st.form_submit_button("Generate", type="primary")

    if submitted:
        schema: dict = {
            "@context": "https://schema.org",
            "@type":    biz_type or "LocalBusiness",
            "name":     name,
            "url":      url,
            "description": description,
            "areaServed": area,
        }
        addr: dict = {"@type": "PostalAddress", "addressCountry": "US"}
        if street: addr["streetAddress"]   = street
        if city:   addr["addressLocality"] = city
        if state:  addr["addressRegion"]   = state
        if zip_:   addr["postalCode"]      = zip_
        if len(addr) > 2: schema["address"] = addr
        if phone:  schema["telephone"]     = phone
        _output(schema)


def _software_app_schema():
    st.subheader("SoftwareApplication Schema")
    with st.form("app_form"):
        col1, col2 = st.columns(2)
        with col1:
            name        = st.text_input("App Name",         value="WorkoutPatna")
            url         = st.text_input("App URL",          value="https://workoutpatna.com")
            category    = st.text_input("Application Category",
                value="HealthApplication",
                help="e.g. HealthApplication, SportsApplication, LifestyleApplication")
            os          = st.text_input("Operating System", value="iOS, Android, Web")
        with col2:
            description = st.text_area("Description",
                value=(
                    "WorkoutPatna is a fitness social networking app that helps people "
                    "find workout partners at gyms, apartment fitness centers, parks, "
                    "and run clubs in Houston, TX."
                ))
            price       = st.text_input("Price",            value="0")
            currency    = st.text_input("Currency",         value="USD")
        features = st.text_area(
            "Feature list — one per line",
            value=(
                "Find gym workout partners near you\n"
                "Fitness accountability partner matching\n"
                "Apartment fitness center community\n"
                "Run club and outdoor workout group discovery"
            ),
        )
        submitted = st.form_submit_button("Generate", type="primary")

    if submitted:
        schema: dict = {
            "@context":            "https://schema.org",
            "@type":               "SoftwareApplication",
            "name":                name,
            "url":                 url,
            "applicationCategory": category,
            "operatingSystem":     os,
            "description":         description,
            "offers": {
                "@type":         "Offer",
                "price":         price,
                "priceCurrency": currency,
            },
        }
        feat_list = [f.strip() for f in features.splitlines() if f.strip()]
        if feat_list: schema["featureList"] = feat_list
        _output(schema)


def _faq_schema():
    st.subheader("FAQPage Schema")
    st.caption(
        "Only use FAQPage schema when the questions and answers are visibly rendered "
        "on the page. Do not use it for hidden or off-page content."
    )

    num_qs = st.number_input("Number of Q&A pairs", min_value=1, max_value=10, value=3)

    with st.form("faq_form"):
        pairs = []
        for i in range(int(num_qs)):
            st.markdown(f"**Q{i+1}**")
            col1, col2 = st.columns(2)
            with col1:
                q = st.text_input(f"Question {i+1}", key=f"q{i}",
                                  value=["What is WorkoutPatna?",
                                         "Is WorkoutPatna for finding trainers?",
                                         "What cities does WorkoutPatna serve?"][i]
                                  if i < 3 else "")
            with col2:
                a = st.text_area(f"Answer {i+1}", key=f"a{i}",
                                 value=[
                                     "WorkoutPatna is a fitness social networking app that helps people find workout partners at gyms, apartment fitness centers, parks, and run clubs.",
                                     "No. WorkoutPatna is not a personal trainer marketplace. It connects people who want a gym partner or workout buddy.",
                                     "WorkoutPatna is currently available in Houston, TX including Cypress, Katy, Spring, The Woodlands, and Sugar Land.",
                                 ][i] if i < 3 else "",
                                 height=80)
            pairs.append((q, a))
        submitted = st.form_submit_button("Generate", type="primary")

    if submitted:
        schema = {
            "@context": "https://schema.org",
            "@type":    "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name":  q,
                    "acceptedAnswer": {"@type": "Answer", "text": a},
                }
                for q, a in pairs if q and a
            ],
        }
        _output(schema)
