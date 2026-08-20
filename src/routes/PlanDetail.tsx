import { Navigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { categoryBreakdown } from '../lib/mockData'
import { IconPiggyBank, IconTrendingUp, IconWallet } from '../components/icons'
import type { BucketId } from '../types'

const BUCKET_META: Record<
  BucketId,
  { label: string; iconBg: string; iconColor: string; Icon: typeof IconWallet }
> = {
  spend: { label: 'Spend', iconBg: 'bg-accent-2/15', iconColor: 'text-accent-2', Icon: IconWallet },
  save: { label: 'Save', iconBg: 'bg-accent/15', iconColor: 'text-accent', Icon: IconPiggyBank },
  invest: { label: 'Invest', iconBg: 'bg-danger/15', iconColor: 'text-danger', Icon: IconTrendingUp },
}

export function PlanDetail() {
  const { state } = useStore()
  const { plan, buckets } = state
  if (!plan) return <Navigate to="/onboarding/status" replace />

  const slices = categoryBreakdown()
  const bucketIds: BucketId[] = ['spend', 'save', 'invest']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-onbg">Plan detail</h1>
        <p className="text-xs text-muted mt-1">
          How each account breaks down into categories. Illustrative — you can always simplify this in Profile.
        </p>
      </div>

      {bucketIds.map((bucket) => {
        const bucketSlices = slices.filter((s) => s.bucket === bucket)
        const meta = BUCKET_META[bucket]
        const { Icon } = meta
        return (
          <div key={bucket} className="rounded-2xl border border-white/10 bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${meta.iconBg} ${meta.iconColor}`}>
                  <Icon />
                </div>
                <h2 className="text-sm font-semibold text-onbg">{meta.label}</h2>
              </div>
              <span className="text-sm tabular-nums text-accent">${buckets[bucket].toFixed(2)}</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-surface-2">
              {bucketSlices.map((s, i) => (
                <div
                  key={s.label}
                  style={{ width: `${s.pct}%` }}
                  className={i % 2 === 0 ? 'bg-accent' : 'bg-accent-2'}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-1.5">
              {bucketSlices.map((s) => (
                <li key={s.label} className="flex justify-between text-xs">
                  <span className="text-muted">{s.label}</span>
                  <span className="text-onbg tabular-nums">{s.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
