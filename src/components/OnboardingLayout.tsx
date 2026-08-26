import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

const STEP_LABELS = ['Age', 'Status', 'Work type', 'Income', 'Plan', 'Deposit']

export function OnboardingLayout({ step, children }: { step: number; children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="h-8 w-8 flex items-center justify-center rounded-full bg-surface text-onbg"
        >
          ←
        </button>
        <div className="flex-1 flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-surface-2'}`}
            />
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}
