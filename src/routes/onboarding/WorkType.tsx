import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { IconCheckCircle } from '../../components/icons'
import { useStore } from '../../lib/store'
import type { WorkType } from '../../types'

export function OnboardingWorkType() {
  const navigate = useNavigate()
  const { state, updateOnboardingDraft } = useStore()
  const draft = state.onboardingDraft
  const [workType, setWorkType] = useState<WorkType | null>(draft.workType ?? null)

  if (!draft.status) return <Navigate to="/onboarding/status" replace />

  const handleContinue = () => {
    if (!workType) return
    updateOnboardingDraft({ workType })
    navigate('/onboarding/income')
  }

  return (
    <OnboardingLayout step={1}>
      <h1 className="font-heading text-2xl text-onbg">What's your work schedule?</h1>
      <p className="text-xs text-muted mt-1">Variable hours make monthly planning harder — we'll account for that.</p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {(['part-time', 'full-time'] as const).map((opt) => {
          const selected = workType === opt
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              onClick={() => setWorkType(opt)}
              className={`flex items-center justify-center gap-1.5 rounded-2xl border px-4 py-4 text-sm capitalize ${
                selected ? 'border-accent bg-accent/10 text-onbg font-semibold' : 'border-white/10 bg-surface text-onbg font-medium'
              }`}
            >
              {selected && (
                <span className="text-accent" aria-hidden="true">
                  <IconCheckCircle width={16} height={16} />
                </span>
              )}
              {opt.replace('-', ' ')}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!workType}
        onClick={handleContinue}
        className="mt-8 w-full rounded-full bg-accent disabled:bg-surface-2 disabled:text-muted text-bg font-semibold px-6 py-3 text-sm"
      >
        Continue
      </button>
    </OnboardingLayout>
  )
}
