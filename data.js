// Workout Patna — mock data

window.WP_GYMS = [
  { id: 'planet-southside', name: 'Planet Fitness — Southside', area: 'Southside', members: 1240 },
  { id: 'iron-house', name: 'Iron House Strength Co.', area: 'Riverside', members: 380 },
  { id: 'eastpark-y', name: 'Eastpark YMCA', area: 'Eastpark', members: 920 },
  { id: 'crunch-mid', name: 'Crunch — Midtown', area: 'Midtown', members: 1610 },
  { id: 'gold-uptown', name: "Gold's Gym — Uptown", area: 'Uptown', members: 870 },
  { id: 'orangetheory-w', name: 'Orangetheory — Westside', area: 'Westside', members: 540 },
];

const goals = [
  'Build muscle', 'Lose weight', 'Get stronger', 'Stay consistent',
  'Train for marathon', 'Powerlifting meet', 'Cut weight', 'Mobility',
  'Olympic lifts', 'General fitness', 'Hypertrophy',
];
const splits = ['Push/Pull/Legs', 'Upper/Lower', 'Bro split', 'Full body', '5/3/1', 'Conjugate'];
const vibes = ['🤝 Spotter buddy', '🎧 Quiet co-lifter', '🔥 Push me harder', '😂 Banter okay', '⏱ Strict timing', '🥤 Post-gym smoothies'];

window.WP_PEOPLE = [
  {
    id: 'p1', name: 'Maya Okafor', age: 28, gender: 'F',
    gym: 'planet-southside', level: 'Intermediate',
    schedule: 'Weekday 6–7am',
    goals: ['Build muscle', 'Stay consistent'],
    split: 'Push/Pull/Legs', vibe: ['🤝 Spotter buddy', '🎧 Quiet co-lifter'],
    bio: 'PPL girlie. Looking for a 6am regular who actually shows up. I bring the chalk, you bring the playlist.',
    hue: 18, distance: 'Same gym',
    rating: 4.9, sessions: 47, streak: 12,
  },
  {
    id: 'p2', name: 'Devon Reyes', age: 31, gender: 'M',
    gym: 'planet-southside', level: 'Advanced',
    schedule: 'Tue/Thu/Sat evenings',
    goals: ['Powerlifting meet', 'Get stronger'],
    split: '5/3/1', vibe: ['🔥 Push me harder', '⏱ Strict timing'],
    bio: 'Powerlifter, 4 years in. Training for a meet in October — need a serious bench spotter, no phone breaks.',
    hue: 210, distance: 'Same gym',
    rating: 4.7, sessions: 113, streak: 41,
  },
  {
    id: 'p3', name: 'Priya Shah', age: 26, gender: 'F',
    gym: 'planet-southside', level: 'Beginner',
    schedule: 'Mon/Wed/Fri lunch',
    goals: ['Get stronger', 'General fitness'],
    split: 'Full body', vibe: ['🤝 Spotter buddy', '😂 Banter okay'],
    bio: 'Six months in, finally past gym anxiety. Want someone patient who can show me the rack etiquette.',
    hue: 280, distance: 'Same gym',
    rating: 5.0, sessions: 22, streak: 6,
  },
  {
    id: 'p4', name: 'Jordan Liu', age: 34, gender: 'NB',
    gym: 'iron-house', level: 'Advanced',
    schedule: 'Weekend mornings',
    goals: ['Olympic lifts', 'Hypertrophy'],
    split: 'Conjugate', vibe: ['🔥 Push me harder', '🥤 Post-gym smoothies'],
    bio: 'Snatch and clean nerd. Will critique your hook grip with love. Coffee after, always.',
    hue: 140, distance: '0.4 mi away',
    rating: 4.8, sessions: 76, streak: 18,
  },
  {
    id: 'p5', name: 'Sam Whitfield', age: 24, gender: 'M',
    gym: 'planet-southside', level: 'Intermediate',
    schedule: 'Weekday evenings',
    goals: ['Build muscle', 'Cut weight'],
    split: 'Upper/Lower', vibe: ['😂 Banter okay', '🤝 Spotter buddy'],
    bio: 'Cutting before summer. Need someone who won\'t let me skip leg day. I will absolutely complain.',
    hue: 35, distance: 'Same gym',
    rating: 4.6, sessions: 58, streak: 9,
  },
  {
    id: 'p6', name: 'Renata Alvarez', age: 39, gender: 'F',
    gym: 'planet-southside', level: 'Intermediate',
    schedule: 'Early mornings',
    goals: ['Train for marathon', 'Mobility'],
    split: 'Full body', vibe: ['🎧 Quiet co-lifter', '⏱ Strict timing'],
    bio: 'Marathon #4 in March. Lift twice a week to support running. In and out, no chitchat — but I will wave.',
    hue: 320, distance: 'Same gym',
    rating: 4.9, sessions: 142, streak: 67,
  },
  {
    id: 'p7', name: 'Theo Bennett', age: 29, gender: 'M',
    gym: 'eastpark-y', level: 'Beginner',
    schedule: 'Flexible',
    goals: ['Lose weight', 'Stay consistent'],
    split: 'Full body', vibe: ['🤝 Spotter buddy', '😂 Banter okay'],
    bio: 'New dad, 30 lbs to lose, learning as I go. Looking for someone equally non-judgmental.',
    hue: 200, distance: '1.1 mi away',
    rating: 4.5, sessions: 14, streak: 3,
  },
  {
    id: 'p8', name: 'Aiko Tanaka', age: 27, gender: 'F',
    gym: 'iron-house', level: 'Advanced',
    schedule: 'Weekday 5–6pm',
    goals: ['Hypertrophy', 'Get stronger'],
    split: 'Upper/Lower', vibe: ['🔥 Push me harder', '🥤 Post-gym smoothies'],
    bio: 'Two years on Upper/Lower. Will absolutely rep out with you. Currently chasing a 1.5x BW bench.',
    hue: 5, distance: '0.4 mi away',
    rating: 4.8, sessions: 91, streak: 22,
  },
];

// Pre-existing matches & threads
window.WP_THREADS = [
  {
    id: 't1', personId: 'p1', unread: 2, last: 'See you 6am? I\'ll grab the bench.',
    lastTime: '12m', messages: [
      { from: 'them', text: 'Hey! Saw your profile — you\'re always at PF Southside?', time: 'Mon 8:14pm' },
      { from: 'me', text: 'Yep! Almost daily 6am. You?', time: 'Mon 8:22pm' },
      { from: 'them', text: 'Same window. Want to lift together Wed?', time: 'Mon 8:23pm' },
      { from: 'me', text: 'Wed works. Push day for me.', time: 'Mon 8:30pm' },
      { from: 'them', text: 'Perfect, mine too.', time: 'Mon 8:30pm' },
      { from: 'them', text: 'See you 6am? I\'ll grab the bench.', time: '12m ago' },
    ],
  },
  {
    id: 't2', personId: 'p4', unread: 0, last: 'Smoothie place across the street is open',
    lastTime: '2h', messages: [
      { from: 'them', text: 'Nice clean today!', time: 'Sat 10:01am' },
      { from: 'me', text: 'You too — that 3rd set was clean.', time: 'Sat 10:02am' },
      { from: 'them', text: 'Smoothie place across the street is open', time: '2h ago' },
    ],
  },
  {
    id: 't3', personId: 'p6', unread: 0, last: '👍', lastTime: 'Yesterday',
    messages: [
      { from: 'me', text: 'Catch you tomorrow at 5:45?', time: 'Yesterday' },
      { from: 'them', text: '👍', time: 'Yesterday' },
    ],
  },
];

window.WP_ACTIVITY = [
  { id: 'a1', personId: 'p2', kind: 'pr', text: 'hit a 365 lb deadlift PR', time: '34m ago' },
  { id: 'a2', personId: 'p6', kind: 'streak', text: 'is on a 67-day streak 🔥', time: '1h ago' },
  { id: 'a3', personId: 'p3', kind: 'session', text: 'logged Leg Day — squat 3×5 @135', time: '3h ago' },
  { id: 'a4', personId: 'p8', kind: 'match', text: 'matched with Devon R.', time: '5h ago' },
  { id: 'a5', personId: 'p1', kind: 'session', text: 'logged Push Day — 52 min', time: 'Yesterday' },
];

window.WP_GOALS = goals;
window.WP_SPLITS = splits;
window.WP_VIBES = vibes;
