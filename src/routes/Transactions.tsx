import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { TransactionList } from '../components/TransactionList'
import type { BucketId } from '../types'

const FILTERS: { value: BucketId | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'spend', label: 'Spend' },
  { value: 'save', label: 'Save' },
  { value: 'invest', label: 'Invest' },
]

export function Transactions() {
  const { state } = useStore()
  const [filter, setFilter] = useState<BucketId | 'all'>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? state.transactions : state.transactions.filter((tx) => tx.bucket === filter)),
    [state.transactions, filter],
  )

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-onbg">Activity</h1>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === f.value ? 'bg-accent text-bg' : 'bg-surface text-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <TransactionList transactions={filtered} />
      </div>
    </div>
  )
}
