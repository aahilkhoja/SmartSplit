import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { SplitSliders } from '../components/SplitSliders'
import { IconCheckCircle } from '../components/icons'
import type { IncomeBasis, ResidencyStatus, WorkType } from '../types'

export function Profile() {
  const { state, updatePlan, setProfile, signOut, resetAll } = useStore()
  const { profile, plan, auth } = state
  const navigate = useNavigate()

  const [split, setSplit] = useState({ spendPct: 0, savePct: 0, investPct: 0 })
  const [spendLimit, setSpendLimit] = useState(0)
  const [status, setStatus] = useState<ResidencyStatus>('domestic')
  const [workType, setWorkType] = useState<WorkType>('full-time')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeBasis, setIncomeBasis] = useState<IncomeBasis>('after-tax')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (plan) {
      setSplit({ spendPct: plan.spendPct, savePct: plan.savePct, investPct: plan.investPct })
      setSpendLimit(plan.spendLimit)
    }
    if (profile) {
      setStatus(profile.status)
      setWorkType(profile.workType)
      setIncomeAmount(String(profile.incomeAmount))
      setIncomeBasis(profile.incomeBasis)
    }
  }, [plan, profile])

  if (!profile || !plan) return <Navigate to="/onboarding/status" replace />

  const handleSave = () => {
    updatePlan({ choice: plan.choice, ...split, spendLimit })
    setProfile({ status, workType, incomeAmount: Number(incomeAmount) || profile.incomeAmount, incomeBasis })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-onbg">Profile</h1>
        <p className="text-xs text-muted mt-1">
          {auth.displayName || 'You'} · revisit any answer whenever life changes.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4 space-y-4">
        <h2 className="text-sm font-semibold text-onbg">Your situation</h2>

        <div>
          <span className="text-xs font-medium text-muted">Status</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['international', 'domestic'] as const).map((opt) => {
              const selected = status === opt
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setStatus(opt)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs capitalize ${
                    selected ? 'border-accent bg-accent/10 text-onbg font-semibold' : 'border-white/10 text-onbg'
                  }`}
                >
                  {selected && (
                    <span className="text-accent" aria-hidden="true">
                      <IconCheckCircle width={13} height={13} />
                    </span>
                  )}
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-muted">Work type</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['part-time', 'full-time'] as const).map((opt) => {
              const selected = workType === opt
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setWorkType(opt)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs capitalize ${
                    selected ? 'border-accent bg-accent/10 text-onbg font-semibold' : 'border-white/10 text-onbg'
                  }`}
                >
                  {selected && (
                    <span className="text-accent" aria-hidden="true">
                      <IconCheckCircle width={13} height={13} />
                    </span>
                  )}
                  {opt.replace('-', ' ')}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-muted">Monthly income</span>
          <div className="mt-1 flex items-center rounded-xl border border-white/10 px-3">
            <span className="text-muted">$</span>
            <input
              type="number"
              min={0}
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="w-full bg-transparent px-2 py-2 text-sm text-onbg outline-none"
            />
            <select
              value={incomeBasis}
              onChange={(e) => setIncomeBasis(e.target.value as IncomeBasis)}
              className="bg-transparent text-xs text-muted outline-none"
            >
              <option value="before-tax">before tax</option>
              <option value="after-tax">after tax</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <h2 className="text-sm font-semibold text-onbg mb-4">Your split</h2>
        <SplitSliders {...split} onChange={setSplit} />
      </div>

      <div>
        <span className="text-xs font-medium text-muted">Monthly spend guideline</span>
        <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-surface px-3 max-w-[180px]">
          <span className="text-muted">$</span>
          <input
            type="number"
            min={0}
            value={spendLimit}
            onChange={(e) => setSpendLimit(Number(e.target.value))}
            className="w-full bg-transparent px-2 py-2.5 text-sm text-onbg outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-accent text-bg font-semibold px-6 py-2.5 text-sm"
        >
          Save changes
        </button>
        {saved && <span className="text-sm text-accent">Saved</span>}
      </div>

      <div className="pt-4 border-t border-white/10 space-y-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-full border border-white/15 text-onbg px-4 py-2.5 text-sm"
        >
          Sign out
        </button>

        <div>
          <p className="text-xs text-danger font-semibold">Reset prototype data</p>
          <p className="text-[11px] text-muted mt-0.5 mb-2">
            Clears all simulated balances, transactions, and your plan from this browser only.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="w-full rounded-full border border-danger/40 text-danger px-4 py-2.5 text-sm"
          >
            Reset everything
          </button>
        </div>
      </div>
    </div>
  )
}
