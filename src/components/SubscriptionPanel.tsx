import type { DetectedSubscription } from '../types'

export function SubscriptionPanel({ subscriptions }: { subscriptions: DetectedSubscription[] }) {
  if (subscriptions.length === 0) {
    return <p className="text-sm text-muted">No recurring charges detected yet.</p>
  }

  const monthlyTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div>
      <p className="text-xs text-muted mb-3">
        Quietly detected from repeat charges — about{' '}
        <span className="font-medium text-onbg">${monthlyTotal.toFixed(2)}</span> recurring each
        cycle.
      </p>
      <ul className="space-y-2">
        {subscriptions.map((sub) => (
          <li
            key={`${sub.label}-${sub.amount}`}
            className="flex items-center justify-between rounded-xl bg-danger/10 border border-danger/30 px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-onbg">{sub.label}</p>
              <p className="text-xs text-muted">
                Seen {sub.occurrences}× · last on {new Date(sub.lastDate).toLocaleDateString()}
              </p>
            </div>
            <span className="tabular-nums font-medium text-onbg">${sub.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
