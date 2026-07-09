// Curated Unsplash fitness photos — all verified to feature Black athletes.
// WorkoutPartna is a Black-owned company; our imagery reflects our community.
// All photos are free to use under the Unsplash License.
// Served via images.unsplash.com CDN. q=90, 2× dimensions for Retina.

const cdn = (id: string, w: number, h: number, q = 90) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=${q}`

// ── Demo / match card portraits (3:4, serve 480×640 for Retina) ─────────────
//
// marcus  — Black man, muscular build, gym setting, San Francisco
//           Photo: Edgar Chaparro, unsplash.com/photos/AVOADaTBtT4
// jasmine — Black woman, squats in gym, Los Angeles
//           Photo: SUNDAY II SUNDAY, unsplash.com/photos/snM3yEpvklU
// priya   — Black woman in athletic wear, Houston TX (our home city)
//           Photo: Corey Watson, unsplash.com/photos/2qgOFsZEC4w
// ethan   — Black man doing pull-ups outdoors
//           Photo: Fortune Vieyra, unsplash.com/photos/yaPv5sQ91PI
// (a fifth portrait, "david", was removed 2026-07 — its Unsplash CDN id now 404s)
export const matchPhotos = {
  marcus:  cdn('1572459815549-873917ec8c0a', 480, 640),
  jasmine: cdn('1649887974297-4be052375a67', 480, 640),
  priya:   cdn('1600069109571-4a033ae54be2', 480, 640),
  ethan:   cdn('1616803928273-39775ac000ca', 480, 640),
}

// ── Full-bleed profile hero portraits (4:5, 1200×1500 for Retina) ───────────
export const profileHero = {
  marcus: cdn('1572459815549-873917ec8c0a', 1200, 1500),
}

// ── Additional verified Black athlete portraits ──────────────────────────────
// Available for seeded profiles or UI previews
export const extraPortraits = {
  // Black man doing push-ups outdoors — Fortune Vieyra
  man1:   cdn('1616803689943-5601631c7fec', 480, 640),
  // Black woman boxing, punching bag, Los Angeles — SUNDAY II SUNDAY
  woman2: cdn('1649888137201-491856105a1a', 480, 640),
  // (a third portrait, "woman1", was removed 2026-07 — its Unsplash CDN id now 404s)
}

// ── Splash / hero ────────────────────────────────────────────────────────────
// hero-woman.jpg — African American woman in fitness class, bright studio
// (local asset in /public, original: Bruce Mars / Unsplash)
export const splashHero = '/hero-woman.jpg'
export const splashHeroFallback = splashHero

// ── Wide / landscape (16:9, 1600×900) ───────────────────────────────────────
// Black man doing pull-ups outdoors — Fortune Vieyra
export const heroWide = cdn('1616803928273-39775ac000ca', 1600, 900)

// ── Location card placeholders (4:3, 1200×675) ──────────────────────────────
// All verified Black athletes or Black-led group shots
export const locationPhotos = {
  // Gym interior — Black man, muscular, San Francisco
  gym:     cdn('1572459815549-873917ec8c0a', 1200, 675),
  // Run / outdoor — Black man doing pull-ups, natural light
  runclub: cdn('1616803928273-39775ac000ca', 1200, 675),
  // Yoga — Two Black women on yoga mats, Los Angeles (SUNDAY II SUNDAY)
  yoga:    cdn('1649888187589-552bfa7bf681', 1200, 675),
  // Park / outdoor — Black man push-ups, outdoor fitness
  park:    cdn('1616803689943-5601631c7fec', 1200, 675),
}
