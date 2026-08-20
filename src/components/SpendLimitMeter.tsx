export function SpendLimitMeter({ spent, limit }: { spent: number; limit: number }) {
  if (limit <= 0) return null
  const ratio = Math.min(spent / limit, 1.25)
  const pct = Math.min(ratio * 100, 100)

  const tone =
    ratio < 0.7
      ? { bar: 'bg-accent', text: 'text-muted' }
      : ratio < 1
        ? { bar: 'bg-accent-2', text: 'text-accent-2' }
        : { bar: 'bg-danger', text: 'text-danger' }

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className={tone.text}>
          {ratio >= 1
            ? "You're past your spend guideline this cycle"
            : ratio >= 0.7
              ? 'Getting close to your spend guideline'
              : 'Within your spend guideline'}
        </span>
        <span className="tabular-nums text-muted">
          ${spent.toFixed(0)} / ${limit.toFixed(0)}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
