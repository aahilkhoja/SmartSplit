import type { Buckets, CategorySlice, InvestmentSlice, Transaction, TrendPoint } from '../types'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** Seed history so the Dashboard isn't empty on first load, with a couple of
 * recurring charges baked in so the subscription detector has something to find. */
export function seedTransactions(): Transaction[] {
  return [
    { id: 'seed-1', date: daysAgo(58), bucket: 'spend', kind: 'subscription-charge', amount: 15.99, label: 'Streamly Video' },
    { id: 'seed-2', date: daysAgo(58), bucket: 'spend', kind: 'spend', amount: 42.1, label: 'Groceries' },
    { id: 'seed-3', date: daysAgo(44), bucket: 'spend', kind: 'spend', amount: 9.5, label: 'Coffee Shop' },
    { id: 'seed-4', date: daysAgo(29), bucket: 'spend', kind: 'subscription-charge', amount: 15.99, label: 'Streamly Video' },
    { id: 'seed-5', date: daysAgo(28), bucket: 'spend', kind: 'subscription-charge', amount: 9.99, label: 'TuneWave Music' },
    { id: 'seed-6', date: daysAgo(20), bucket: 'spend', kind: 'spend', amount: 61.2, label: 'Groceries' },
    { id: 'seed-7', date: daysAgo(14), bucket: 'spend', kind: 'spend', amount: 18.4, label: 'Rideshare' },
    { id: 'seed-8', date: daysAgo(1), bucket: 'spend', kind: 'subscription-charge', amount: 9.99, label: 'TuneWave Music' },
  ]
}

/** Small starting balances so the Dashboard reads as "already in progress"
 * rather than a blank slate, roughly consistent with the seeded transaction history. */
export function seedBuckets(): Buckets {
  return { spend: 118.81, save: 340, invest: 210 }
}

/** Illustrative category breakdown for the Plan Detail screen. Display-only mock data. */
export function categoryBreakdown(): CategorySlice[] {
  return [
    { bucket: 'spend', label: 'Essential', pct: 65 },
    { bucket: 'spend', label: 'Lifestyle', pct: 35 },
    { bucket: 'save', label: 'Short-term savings', pct: 100 },
    { bucket: 'invest', label: 'Retirement', pct: 100 },
  ]
}

/** Plain-language "what it's invested in" breakdown for the Learning screen. Mock only. */
export function investmentAllocation(): InvestmentSlice[] {
  return [
    { label: 'Broad Market Index Fund', pct: 60, blurb: 'A slice of thousands of companies at once, so no single one can sink you.' },
    { label: 'Government Bonds', pct: 30, blurb: 'Loans to stable governments — steadier, lower-risk growth.' },
    { label: 'Cash Reserve', pct: 10, blurb: 'Kept liquid so your Invest bucket can absorb bumps without selling anything.' },
  ]
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** The 6 real calendar months ending at the current one, e.g. run this in
 * December and it labels Jul-Dec, not a hardcoded "Mar-Aug" year-round. */
export function incomeExpenseTrend(monthlyIncome: number, now = new Date()): TrendPoint[] {
  const expenseRatios = [0.62, 0.58, 0.7, 0.55, 0.66, 0.6]
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(MONTH_NAMES[d.getMonth()])
  }
  return months.map((month, i) => ({
    month,
    income: Math.round(monthlyIncome),
    expenses: Math.round(monthlyIncome * expenseRatios[i]),
  }))
}
