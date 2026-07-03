// Daily motivational quote bank for the motivation push cron.
// One quote per calendar day, picked deterministically from the bank so every
// member sees the same quote on a given day and cron re-runs are idempotent.
//
// Voice rules (DESIGN.md voice-and-tone): direct and athletic, no corporate
// hedging. Keep every line short enough for a push notification body.

export type MotivationQuote = {
  text: string
  author?: string   // omitted for original brand-voice lines
}

const QUOTES: MotivationQuote[] = [
  { text: 'The hardest lift of the day is lifting yourself off the couch.' },
  { text: 'You don’t have to feel ready. You have to start.' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln (attr.)' },
  { text: 'The body achieves what the mind believes.' },
  { text: 'Sore today. Strong tomorrow.' },
  { text: 'A one-hour workout is 4% of your day. No excuses.' },
  { text: 'You are one workout away from a better mood.' },
  { text: 'Small daily wins beat rare heroic efforts. Show up.' },
  { text: 'It never gets easier. You get stronger.' },
  { text: 'Motivation gets you started. Habit keeps you going.', author: 'Jim Ryun' },
  { text: 'The pain you feel today will be the strength you feel tomorrow.' },
  { text: 'Don’t count the days. Make the days count.', author: 'Muhammad Ali' },
  { text: 'The only bad workout is the one that didn’t happen.' },
  { text: 'Success starts with self-discipline.' },
  { text: 'Your future self is watching you right now. Make them proud.' },
  { text: 'Strength doesn’t come from what you can do. It comes from overcoming what you once couldn’t.', author: 'Rikki Rogers' },
  { text: 'Push yourself, because no one else is going to do it for you.' },
  { text: 'Champions train. Losers complain.' },
  { text: 'What seems impossible today will one day be your warm-up.' },
  { text: 'Nobody ever regretted a workout after finishing it.' },
  { text: 'Fall in love with the process and the results will come.', author: 'Eric Thomas' },
  { text: 'You didn’t come this far to only come this far.' },
  { text: 'Energy creates energy. Move first, feel better after.' },
  { text: 'Be stronger than your strongest excuse.' },
  { text: 'Consistency is what transforms average into excellence.' },
  { text: 'Do something today that your future self will thank you for.' },
  { text: 'The clock is ticking. Are you becoming the person you want to be?', author: 'Greg Plitt' },
  { text: 'Wake up with determination. Go to bed with satisfaction.' },
  { text: 'Slow progress is still progress. Standing still is not.' },
  { text: 'You don’t find willpower. You build it — one rep at a time.' },
  { text: 'If it doesn’t challenge you, it doesn’t change you.', author: 'Fred DeVito' },
  { text: 'The best project you’ll ever work on is you.' },
  { text: 'Rest when you’re done, not when you’re tired.' },
  { text: 'Excuses burn zero calories.' },
  { text: 'Every workout is a vote for the person you’re becoming.' },
  { text: 'Today’s effort is tomorrow’s edge.' },
  { text: 'Your streak doesn’t care how you feel. Protect it.' },
  { text: 'Strive for progress, not perfection.' },
  { text: 'Sweat is just your body applauding your effort.' },
  { text: 'One day or day one. You decide.' },
  { text: 'Comfort is the enemy of progress.' },
  { text: 'You’ve survived 100% of your hardest days. Today is no different.' },
  { text: 'Train like your goal is chasing you.' },
  { text: 'The gym doesn’t care about your mood. Show up anyway — the mood follows.' },
  { text: 'A year from now you’ll wish you had started today.', author: 'Karen Lamb' },
  { text: 'Make your body the strongest thing you own.' },
  { text: 'Doubt kills more dreams than failure ever will.', author: 'Suzy Kassem' },
  { text: 'Five minutes of movement beats zero minutes of intention.' },
  { text: 'You earn your body one decision at a time. Decide well today.' },
]

/**
 * Deterministically pick the quote for a given date (YYYY-MM-DD or Date).
 * Day-of-epoch modulo bank size — stable across re-runs, rotates daily.
 */
export function quoteForDay(day: string | Date): MotivationQuote {
  const d = typeof day === 'string' ? new Date(`${day}T00:00:00Z`) : day
  const daysSinceEpoch = Math.floor(d.getTime() / 86_400_000)
  return QUOTES[daysSinceEpoch % QUOTES.length]
}

/** Format a quote as a push-notification body. */
export function formatQuoteBody(q: MotivationQuote): string {
  return q.author ? `“${q.text}” — ${q.author}` : q.text
}
