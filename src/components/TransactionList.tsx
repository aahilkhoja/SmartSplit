import type { Transaction } from '../types'

const KIND_LABEL: Record<Transaction['kind'], string> = {
  'deposit-split': 'Paycheck split',
  spend: 'Spend',
  'subscription-charge': 'Subscription',
}

export function TransactionList({
  transactions,
  limit,
}: {
  transactions: Transaction[]
  limit?: number
}) {
  const list = limit ? transactions.slice(0, limit) : transactions

  if (list.length === 0) {
    return <p className="text-sm text-muted">No transactions yet.</p>
  }

  return (
    <ul className="divide-y divide-white/10">
      {list.map((tx) => {
        const isCredit = tx.kind === 'deposit-split'
        return (
          <li key={tx.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="font-medium text-onbg">{tx.label}</p>
              <p className="text-xs text-muted">
                {KIND_LABEL[tx.kind]} · {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`tabular-nums font-medium ${isCredit ? 'text-accent' : 'text-onbg'}`}>
              {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
