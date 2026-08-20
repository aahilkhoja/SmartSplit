import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { IconCheckCircle } from '../../components/icons'
import type { ResidencyStatus } from '../../types'

const OPTIONS: { value: ResidencyStatus; label: string; blurb: string }[] = [
  { value: 'international', label: 'International', blurb: "New to Canada's financial system" },
  { value: 'domestic', label: 'Domestic', blurb: 'Already banking locally' },
]

export function OnboardingStatus() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<ResidencyStatus | null>(null)

  return (
    <OnboardingLayout step={0}>
      <h1 className="font-heading text-2xl text-onbg">Are you international or domestic?</h1>
      <p className="text-xs text-muted mt-1">This helps us recommend the right starting plan.</p>

      <div className="mt-6 space-y-2">
        {OPTIONS.map((opt) => {
          const selected = status === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setStatus(opt.value)}
              className={`w-full flex items-start gap-3 text-left rounded-2xl border px-4 py-3.5 transition-colors ${
                selected ? 'border-accent bg-accent/10' : 'border-white/10 bg-surface'
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${selected ? 'text-accent' : 'text-muted/40'}`} aria-hidden="true">
                <IconCheckCircle width={20} height={20} />
              </span>
              <span>
                <p className="font-medium text-sm text-onbg">{opt.label}</p>
                <p className="text-xs text-muted">{opt.blurb}</p>
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!status}
        onClick={() => navigate('/onboarding/work-type', { state: { status } })}
        className="mt-8 w-full rounded-full bg-accent disabled:bg-surface-2 disabled:text-muted text-bg font-semibold px-6 py-3 text-sm"
      >
        Continue
      </button>
    </OnboardingLayout>
  )
}
