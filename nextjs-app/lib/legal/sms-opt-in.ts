// SMS opt-in language — TCPA-compliant disclosure for collecting consent to
// send AI Coach daily workout texts.
//
// Required elements (per TCPA / FCC / CTIA messaging guidelines):
//   1. Identify the program by name
//   2. State message frequency (recurring vs. one-off, expected volume)
//   3. Disclose carrier message & data rates may apply
//   4. Provide opt-out instructions ("Reply STOP")
//   5. Provide help instructions ("Reply HELP")
//   6. Reference the privacy policy
//   7. Confirm we won't share their number for third-party marketing
//
// Version this whenever the text materially changes. Each user's row records
// which version they accepted, giving us a clear legal record per user.

export const SMS_OPT_IN_VERSION = '2026-05-08-v1'

export const SMS_OPT_IN_HEADING = 'Daily workout text messages (optional)'

export const SMS_OPT_IN_INTRO =
  'Want your daily AI Coach workout sent to you via text message instead of (or in addition to) ' +
  'in-app delivery? Add your number and check the consent box below.'

export const SMS_OPT_IN_DISCLOSURE =
  'By providing your mobile number and checking the box below, you expressly consent to receive ' +
  'recurring SMS text messages from WorkoutPartna and Fan2See Productions LLC at the number above, ' +
  'including your daily AI Coach workout and occasional account-related messages. ' +
  'Message frequency: up to 7 messages per week. Message and data rates may apply. ' +
  'Reply STOP at any time to unsubscribe. Reply HELP for help. ' +
  'Consent to receive these messages is not a condition of any purchase. ' +
  'We will not sell or share your phone number with third parties for marketing purposes. ' +
  'See our Privacy Policy at workoutpartna.com/privacy for details on how we handle your data.'

export const SMS_OPT_IN_LABEL =
  'I consent to receive recurring AI Coach workout text messages at the phone number above. ' +
  'I understand I can reply STOP to unsubscribe at any time and that message and data rates may apply.'

/**
 * Loose phone-number sanity check. Accepts US 10-digit, +1-prefixed, and
 * international E.164 (up to 15 digits). Returns the digits-only string if
 * valid, null otherwise. Doesn't validate against a real carrier — that
 * happens at send time when we hit Twilio.
 */
export function normalizePhoneNumber(input: string | null | undefined): string | null {
  if (!input) return null
  const digits = input.replace(/[^\d]/g, '')
  if (digits.length === 10) return `+1${digits}` // bare US 10-digit
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}` // 1XXXXXXXXXX
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}` // E.164 international
  return null
}

/** Pretty-print a stored E.164 number for display. */
export function formatPhoneForDisplay(e164: string | null | undefined): string {
  if (!e164) return ''
  const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164
}
