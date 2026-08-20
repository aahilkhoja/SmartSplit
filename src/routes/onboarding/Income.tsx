import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { IconCheckCircle } from '../../components/icons'
import { useStore } from '../../lib/store'
import type { IncomeBasis, ResidencyStatus, WorkType } from '../../types'

export function OnboardingIncome() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setProfile } = useStore()
  const draft = location.state as { status?: ResidencyStatus; workType?: WorkType } | null

  const [amount, setAmount] = useState('')
  const [basis, setBasis] = useState<IncomeBasis>('after-tax')

  if (!draft?.status || !draft?.workType) return <Navigate to="/onboarding/status" replace />

  const canContinue = Number(amount) > 0

  const handleContinue = () => {
    if (!canContinue) return
    setProfile({
      status: draft.status!,
      workType: draft.workType!,
      incomeAmount: Number(amount),
      incomeBasis: basis,
    })
    navigate('/onboarding/plan')
  }

  return (
    <OnboardingLayout step={2}>
      <h1 className="font-heading text-2xl text-onbg">How much do you make monthly?</h1>
      <p className="text-xs text-muted mt-1">A rough number is fine — you can always adjust later.</p>

      <div className="mt-6">
        <span className="text-xs font-medium text-muted">Monthly income</span>
        <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-surface px-3">
          <span className="text-muted">$</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1800"
            className="w-full bg-transparent px-2 py-2.5 text-sm text-onbg outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <span className="text-xs font-medium text-muted">Before or after tax?</span>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(['before-tax', 'after-tax'] as const).map((opt) => {
            const selected = basis === opt
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={selected}
                onClick={() => setBasis(opt)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm capitalize ${
                  selected ? 'border-accent bg-accent/10 text-onbg font-semibold' : 'border-white/10 bg-surface text-onbg'
                }`}
              >
                {selected && (
                  <span className="text-accent" aria-hidden="true">
                    <IconCheckCircle width={14} height={14} />
                  </span>
                )}
                {opt.replace('-', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="mt-8 w-full rounded-full bg-accent disabled:bg-surface-2 disabled:text-muted text-bg font-semibold px-6 py-3 text-sm"
      >
        Continue
      </button>
    </OnboardingLayout>
  )
}
