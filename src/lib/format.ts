/** Formats a signed dollar amount with the minus sign before the $, e.g. -$50.00
 * rather than $-50.00 (what `${amount.toFixed(2)}` produces for negatives). */
export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  return `${sign}$${Math.abs(amount).toFixed(2)}`
}
