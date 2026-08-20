import type { Transaction } from '../types'

/** Total Spend-bucket outflow within the current calendar month — the cycle the
 * spend-limit meter and alerts are measured against. */
export function monthlySpend(transactions: Transaction[], now = new Date()): number {
  return transactions
    .filter((tx) => {
      if (tx.bucket !== 'spend' || (tx.kind !== 'spend' && tx.kind !== 'subscription-charge')) return false
      const d = new Date(tx.date)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
    .reduce((sum, tx) => sum + tx.amount, 0)
}
