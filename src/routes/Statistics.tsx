import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../lib/store'
import { incomeExpenseTrend } from '../lib/mockData'

export function Statistics() {
  const { state } = useStore()
  const { profile, plan } = state

  const trend = useMemo(() => incomeExpenseTrend(profile?.incomeAmount ?? 0), [profile])

  if (!profile || !plan) return <Navigate to="/onboarding/age" replace />

  const savingsRate = plan.savePct + plan.investPct

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-onbg">Statistics</h1>
        <p className="text-xs text-muted mt-1">Income vs. expenses over time, simulated from your plan.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <p className="text-xs text-muted">Savings rate</p>
        <p className="font-heading text-3xl text-accent mt-1">{savingsRate}%</p>
        <p className="text-xs text-muted mt-1">Share of income going to Save + Invest each month.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-onbg">Income vs. expenses</h2>
          {/* Text legend, not color alone: each bar series is named here, not just
              distinguished by hue, so it still reads correctly for color-blind users. */}
          <div className="flex items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-accent" aria-hidden="true" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-danger" aria-hidden="true" />
              Expenses
            </span>
          </div>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8a93a3' }} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11, fill: '#8a93a3' }} width={46} />
              <Tooltip
                contentStyle={{ background: '#0d141f', border: '1px solid #ffffff1a', borderRadius: 12 }}
                labelStyle={{ color: '#8a93a3' }}
                formatter={(value, name) => [`$${Number(value)}`, name === 'income' ? 'Income' : 'Expenses']}
              />
              <Bar dataKey="income" fill="#36f1c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ff6b5b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted">Simulated monthly totals, not a promise of future income.</p>
      </div>
    </div>
  )
}
