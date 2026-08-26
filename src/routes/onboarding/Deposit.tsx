import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { useStore } from '../../lib/store'

export function OnboardingDeposit() {
  const navigate = useNavigate()
  const { state, confirmPlan, updateOnboardingDraft } = useStore()
  const profile = state.profile
  const draft = state.onboardingDraft

  const defaultLimit =
    profile && draft.spendPct != null ? Math.round(profile.incomeAmount * (draft.spendPct / 100) * 0.85) : 0
  const [spendLimit, setSpendLimit] = useState(draft.spendLimit ?? defaultLimit)

  if (!profile || !draft.planChoice || draft.spendPct == null || draft.savePct == null || draft.investPct == null) {
    return <Navigate to="/onboarding/status" replace />
  }

  const amounts = {
    spend: Math.round(profile.incomeAmount * (draft.spendPct / 100) * 100) / 100,
    save: Math.round(profile.incomeAmount * (draft.savePct / 100) * 100) / 100,
    invest: Math.round(profile.incomeAmount * (draft.investPct / 100) * 100) / 100,
  }

  const handleSpendLimitChange = (value: number) => {
    setSpendLimit(value)
    updateOnboardingDraft({ spendLimit: value })
  }

  const handleConfirm = () => {
    confirmPlan({
      choice: draft.planChoice!,
      spendPct: draft.spendPct!,
      savePct: draft.savePct!,
      investPct: draft.investPct!,
      spendLimit,
    })
    navigate('/dashboard')
  }

  return (
    <OnboardingLayout step={4}>
      <h1 className="font-heading text-2xl text-onbg">Your first deposit</h1>
      <p className="text-xs text-muted mt-1">
        Here's how each paycheck will route into your Spend, Save, and Invest accounts.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-surface divide-y divide-white/10">
        {(['spend', 'save', 'invest'] as const).map((bucket) => (
          <div key={bucket} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm capitalize text-onbg">{bucket}</span>
            <span className="text-sm font-medium tabular-nums text-accent">${amounts[bucket].toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <span className="text-xs font-medium text-muted">Monthly spend guideline</span>
        <p className="text-[11px] text-muted mt-0.5 mb-1">
          We'll discreetly notify you when you're close — no naggy in-app banners.
        </p>
        <div className="flex items-center rounded-xl border border-white/10 bg-surface px-3 max-w-[180px]">
          <span className="text-muted">$</span>
          <input
            type="number"
            min={0}
            value={spendLimit}
            onChange={(e) => handleSpendLimitChange(Number(e.target.value))}
            className="w-full bg-transparent px-2 py-2.5 text-sm text-onbg outline-none"
          />
        </div>
      </div>

      <p className="mt-6 text-[11px] text-muted">
        This is simulated — no real money moves. Deposits auto-route back into accounts you
        already control every time you simulate a paycheck.
      </p>

      <button
        type="button"
        onClick={handleConfirm}
        className="mt-6 w-full rounded-full bg-accent text-bg font-semibold px-6 py-3 text-sm"
      >
        Confirm & enter dashboard
      </button>
    </OnboardingLayout>
  )
}
