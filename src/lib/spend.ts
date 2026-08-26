import type { Transaction } from '../types'

/** Total Spend-bucket outflow since `cycleStart` — the window the spend-limit
 * meter and alerts are measured against. Cycle-based rather than calendar-month
 * based: this is a demo that never advances real time, so a paycheck simulated
 * five times in one sitting needs its own way to mark "a new cycle started." */
export function spentThisCycle(transactions: Transaction[], cycleStart: string): number {
  return transactions
    .filter((tx) => {
      if (tx.bucket !== 'spend' || (tx.kind !== 'spend' && tx.kind !== 'subscription-charge')) return false
      return tx.date >= cycleStart
    })
    .reduce((sum, tx) => sum + tx.amount, 0)
}
