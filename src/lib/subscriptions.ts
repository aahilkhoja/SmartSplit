import type { DetectedSubscription, Transaction } from '../types'

/**
 * Recurring-charge detection: groups spend transactions by (label, amount)
 * and flags anything that has repeated at least twice. Deliberately simple —
 * this is a demo heuristic, not a production merchant-matching pipeline.
 */
export function detectSubscriptions(transactions: Transaction[]): DetectedSubscription[] {
  const groups = new Map<string, Transaction[]>()

  for (const tx of transactions) {
    if (tx.kind !== 'spend' && tx.kind !== 'subscription-charge') continue
    const key = `${tx.label}::${tx.amount}`
    const group = groups.get(key) ?? []
    group.push(tx)
    groups.set(key, group)
  }

  const subscriptions: DetectedSubscription[] = []
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date))
    subscriptions.push({
      label: sorted[0].label,
      amount: sorted[0].amount,
      occurrences: sorted.length,
      lastDate: sorted[sorted.length - 1].date,
    })
  }

  return subscriptions.sort((a, b) => b.occurrences - a.occurrences)
}
