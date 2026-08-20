interface SplitSlidersProps {
  spendPct: number
  savePct: number
  investPct: number
  onChange: (next: { spendPct: number; savePct: number; investPct: number }) => void
}

/**
 * Three linked sliders that always sum to 100: moving one proportionally
 * rescales the other two rather than allowing the total to drift.
 */
export function SplitSliders({ spendPct, savePct, investPct, onChange }: SplitSlidersProps) {
  const handleChange = (key: 'spendPct' | 'savePct' | 'investPct', value: number) => {
    const current = { spendPct, savePct, investPct }
    const others = (['spendPct', 'savePct', 'investPct'] as const).filter((k) => k !== key)
    const otherTotal = others.reduce((sum, k) => sum + current[k], 0)
    const remaining = 100 - value

    let next = { ...current, [key]: value }
    if (otherTotal === 0) {
      next[others[0]] = remaining
      next[others[1]] = 0
    } else {
      next[others[0]] = Math.round((current[others[0]] / otherTotal) * remaining)
      next[others[1]] = remaining - next[others[0]]
    }
    onChange(next)
  }

  const rows: { key: 'spendPct' | 'savePct' | 'investPct'; label: string; value: number }[] = [
    { key: 'spendPct', label: 'Spend', value: spendPct },
    { key: 'savePct', label: 'Save', value: savePct },
    { key: 'investPct', label: 'Invest', value: investPct },
  ]

  return (
    <div className="space-y-5">
      {rows.map((row) => (
        <div key={row.key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-onbg">{row.label}</span>
            <span className="tabular-nums text-muted">{row.value}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={row.value}
            className="w-full"
            onChange={(e) => handleChange(row.key, Number(e.target.value))}
          />
        </div>
      ))}
    </div>
  )
}
