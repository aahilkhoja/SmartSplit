import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { investmentAllocation } from '../lib/mockData'
import { simulateGrowth } from '../lib/growthSim'
import { GrowthChart } from '../components/GrowthChart'
import { IconTrendingUp } from '../components/icons'

export function Learning() {
  const { state } = useStore()
  const { profile, plan, buckets } = state

  const monthlyContribution = useMemo(() => {
    if (!profile || !plan) return 0
    return Math.round(profile.incomeAmount * (plan.investPct / 100) * 100) / 100
  }, [profile, plan])

  const growthPoints = useMemo(
    () => simulateGrowth(buckets.invest, monthlyContribution, 12),
    [buckets.invest, monthlyContribution],
  )

  if (!profile || !plan) return <Navigate to="/onboarding/status" replace />

  const allocation = investmentAllocation()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-danger/15 text-danger flex items-center justify-center">
          <IconTrendingUp />
        </div>
        <div>
          <h1 className="font-heading text-2xl text-onbg">How Invest works</h1>
          <p className="text-xs text-muted mt-1">
            No jargon — here's exactly what your Invest bucket is simulated to hold and why.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4 space-y-4">
        {allocation.map((slice) => (
          <div key={slice.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-onbg">{slice.label}</span>
              <span className="tabular-nums text-accent-2">{slice.pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden mb-1.5">
              <div className="h-full rounded-full bg-accent-2" style={{ width: `${slice.pct}%` }} />
            </div>
            <p className="text-xs text-muted">{slice.blurb}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <h2 className="text-sm font-semibold text-onbg mb-3">Projected growth</h2>
        <GrowthChart points={growthPoints} />
      </div>
    </div>
  )
}
