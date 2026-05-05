// Curated Unsplash fitness photo IDs.
// All from unsplash.com, served via images.unsplash.com CDN.
// Quality bumped to 90, dimensions doubled for Retina screens.

const cdn = (id: string, w: number, h: number, q = 90) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=${q}`

// 3:4 portraits for match cards (rendered at ~80px wide; serve 360x480 for Retina)
export const matchPhotos = {
  marcus:  cdn('1583454110551-21f2fa2afe61', 480, 640),
  jasmine: cdn('1518611012118-696072aa579a', 480, 640),
  priya:   cdn('1571019613454-1cb2f99b2d8b', 480, 640),
  ethan:   cdn('1517836357463-d25dfeac3438', 480, 640),
  david:   cdn('1581009146145-b5ef050c2e1e', 480, 640),
}

// 4:5 hero portrait for profile detail (rendered full-bleed; serve 1200x1500)
export const profileHero = {
  marcus: cdn('1583454110551-21f2fa2afe61', 1200, 1500),
}

// Splash hero. Blonde woman doing crunches in dark moody gym, dark athletic look.
export const splashHero = cdn('1594381898411-846e7d193883', 1600, 1000)
export const splashHeroFallback = splashHero

// 16:9 wide for splash and location pages
export const heroWide = cdn('1534438327276-14e5300c3a48', 1600, 900)

// Location placeholders
export const locationPhotos = {
  gym:      cdn('1534438327276-14e5300c3a48', 1200, 675),
  runclub:  cdn('1571008887538-b36bb32f4571', 1200, 675),
  yoga:     cdn('1545205597-3d9d02c29597', 1200, 675),
  park:     cdn('1538805060514-97d9cc17730c', 1200, 675),
}
