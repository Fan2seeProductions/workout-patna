// Comprehensive route map for QA testing
export const ROUTES = {
  // Public pages (no auth required)
  public: [
    { path: '/', name: 'Homepage' },
    { path: '/app/auth', name: 'Auth (Login/Signup)' },
    { path: '/about', name: 'About' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/for-gyms-apartments', name: 'For Gyms & Apartments' },
    { path: '/terms', name: 'Terms of Service' },
    { path: '/privacy', name: 'Privacy Policy' },
    { path: '/waiver', name: 'Liability Waiver' },
  ],
  // Protected pages (auth required)
  protected: [
    { path: '/app/home', name: 'Dashboard Home' },
    { path: '/app/browse', name: 'Browse/Discover' },
    { path: '/app/discover', name: 'Discover' },
    { path: '/app/messages', name: 'Messages' },
    { path: '/app/profile', name: 'Profile' },
    { path: '/app/matches', name: 'Matches' },
    { path: '/app/challenges', name: 'Challenges' },
    { path: '/app/gyms', name: 'Gyms' },
    { path: '/app/workouts', name: 'Workouts' },
    { path: '/app/merch', name: 'Merch' },
    { path: '/app/notifications', name: 'Notifications' },
    { path: '/app/onboarding', name: 'Onboarding' },
    { path: '/app/coach', name: 'Coach' },
    { path: '/app/trainers', name: 'Trainers' },
  ],
} as const

// Viewports for responsive testing
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const

export type ViewportName = keyof typeof VIEWPORTS
