/**
 * Purely illustrative compounding model — a fixed mock annual rate, not a real
 * market return. Every consumer of this must surface a "simulated, not a
 * promise" disclaimer alongside the numbers.
 */
export const MOCK_ANNUAL_GROWTH_RATE = 0.06

export interface GrowthPoint {
  month: number
  balance: number
}

export function simulateGrowth(
  startingBalance: number,
  monthlyContribution: number,
  months = 12,
  annualRate = MOCK_ANNUAL_GROWTH_RATE,
): GrowthPoint[] {
  const monthlyRate = annualRate / 12
  const points: GrowthPoint[] = [{ month: 0, balance: startingBalance }]
  let balance = startingBalance

  for (let month = 1; month <= months; month++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate)
    points.push({ month, balance: Math.round(balance * 100) / 100 })
  }

  return points
}
