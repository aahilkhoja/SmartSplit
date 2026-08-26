/** Formats a signed dollar amount with the minus sign before the $, e.g. -$50.00
 * rather than $-50.00 (what `${amount.toFixed(2)}` produces for negatives). */
export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  return `${sign}$${Math.abs(amount).toFixed(2)}`
}

/** Treats a too-short name (a stray single letter from quick testing, an
 * accidental space) as effectively unset, so greetings never render as an
 * orphaned "a ·" or "Welcome back, x" next to a punctuation mark. */
export function displayName(name: string): string | null {
  const trimmed = name.trim()
  return trimmed.length >= 2 ? trimmed : null
}

/** Time-of-day greeting for the Dashboard welcome header. */
export function timeGreeting(now = new Date()): string {
  const hour = now.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
