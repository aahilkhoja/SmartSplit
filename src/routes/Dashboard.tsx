import { useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { BucketCard } from '../components/BucketCard'
import { TransactionList } from '../components/TransactionList'
import { SpendLimitMeter } from '../components/SpendLimitMeter'
import { spentThisCycle } from '../lib/spend'
import { displayName, timeGreeting } from '../lib/format'
import { IconBook, IconPieChart } from '../components/icons'

const QUICK_LINKS = [
  { to: '/plan-detail', label: 'Plan detail', blurb: 'Category breakdown', Icon: IconPieChart },
  { to: '/learning', label: 'Learning', blurb: 'What Invest holds', Icon: IconBook },
]

export function Dashboard() {
  const { state, simulatePaycheck, recordSpend } = useStore()
  const { profile, plan, buckets, transactions, auth, cycleStart } = state

  const cycleSpend = useMemo(() => spentThisCycle(transactions, cycleStart), [transactions, cycleStart])
  const name = displayName(auth.displayName)

  const handleSimulateSpend = () => {
    const mocks = [
      { label: 'Groceries', amount: 24.5 },
      { label: 'Coffee Shop', amount: 6.25 },
      { label: 'Rideshare', amount: 15.8 },
      { label: 'Streaming rental', amount: 5.99 },
    ]
    const pick = mocks[Math.floor(Math.random() * mocks.length)]
    recordSpend(pick.amount, pick.label)
  }

  if (!profile || !plan) {
    return <Navigate to="/onboarding/age" replace />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-onbg">
          {timeGreeting()}
          {name ? `, ${name}` : ''}
        </h1>
        <p className="text-xs text-muted mt-1">Here's where your accounts stand today.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <BucketCard bucket="spend" balance={buckets.spend} />
        <BucketCard bucket="save" balance={buckets.save} />
        <BucketCard bucket="invest" balance={buckets.invest} />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={simulatePaycheck}
          className="flex-1 rounded-full bg-accent text-bg font-semibold px-4 py-2.5 text-sm"
        >
          Simulate paycheck
        </button>
        <button
          type="button"
          onClick={handleSimulateSpend}
          className="flex-1 rounded-full border border-white/15 text-onbg px-4 py-2.5 text-sm"
        >
          Simulate spend
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <SpendLimitMeter spent={cycleSpend} limit={plan.spendLimit} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-2xl border border-white/10 bg-surface p-3.5"
          >
            <div className="h-8 w-8 rounded-lg bg-accent-2/15 text-accent-2 flex items-center justify-center mb-2">
              <link.Icon />
            </div>
            <p className="text-sm font-medium text-onbg">{link.label}</p>
            <p className="text-xs text-muted mt-0.5">{link.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-onbg">Recent activity</h2>
          <Link to="/transactions" className="text-xs text-accent-2">
            See all
          </Link>
        </div>
        <TransactionList transactions={transactions} limit={5} />
      </div>
    </div>
  )
}
