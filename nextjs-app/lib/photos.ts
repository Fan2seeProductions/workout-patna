// Curated Unsplash fitness photo IDs.
// All from unsplash.com, served via images.unsplash.com CDN.
// Swap these for real user uploads later.

const cdn = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

// 3:4 portraits for match cards (300x400)
export const matchPhotos = {
  marcus:  cdn('1583454110551-21f2fa2afe61', 300, 400), // athletic man
  jasmine: cdn('1518611012118-696072aa579a', 300, 400), // woman fitness
  priya:   cdn('1571019613454-1cb2f99b2d8b', 300, 400), // woman in gym
  ethan:   cdn('1517836357463-d25dfeac3438', 300, 400), // runner
  david:   cdn('1581009146145-b5ef050c2e1e', 300, 400), // boxer / focused
}

// 4:5 hero portrait for profile detail (600x750)
export const profileHero = {
  marcus: cdn('1583454110551-21f2fa2afe61', 600, 750),
}

// 16:9 wide for splash and location pages (1200x675)
export const heroWide = cdn('1534438327276-14e5300c3a48', 1200, 675) // group gym

// 9:16 vertical for full-screen splash background (900x1600)
// Black woman athlete. Swap with a local /public/photos/splash.jpg later.
export const splashHero = cdn('1594737626072-90dc274bc2bd', 900, 1600)

// Location placeholders
export const locationPhotos = {
  gym:      cdn('1534438327276-14e5300c3a48', 800, 450),
  runclub:  cdn('1571008887538-b36bb32f4571', 800, 450),
  yoga:     cdn('1545205597-3d9d02c29597', 800, 450),
  park:     cdn('1538805060514-97d9cc17730c', 800, 450),
}
