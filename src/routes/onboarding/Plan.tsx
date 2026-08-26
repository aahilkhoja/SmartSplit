import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { PlanChoiceCard } from '../../components/PlanChoiceCard'
import { SplitSliders } from '../../components/SplitSliders'
import { useStore } from '../../lib/store'
import { BIG_THREE, recommendPlanChoice } from '../../lib/splitEngine'
import type { PlanChoice } from '../../types'

export function OnboardingPlan() {
  const navigate = useNavigate()
  const { state, updateOnboardingDraft } = useStore()
  const profile = state.profile
  const draft = state.onboardingDraft

  const [choice, setChoice] = useState<PlanChoice | null>(draft.planChoice ?? null)
  const [customSplit, setCustomSplit] = useState(
    draft.planChoice === 'custom' && draft.spendPct != null && draft.savePct != null && draft.investPct != null
      ? { spendPct: draft.spendPct, savePct: draft.savePct, investPct: draft.investPct }
      : { spendPct: 34, savePct: 33, investPct: 33 },
  )

  if (!profile) return <Navigate to="/onboarding/status" replace />

  const recommended = recommendPlanChoice(profile.status, profile.workType)

  const handleContinue = () => {
    if (!choice) return
    const split = choice === 'custom' ? customSplit : BIG_THREE[choice]
    updateOnboardingDraft({
      planChoice: choice,
      spendPct: split.spendPct,
      savePct: split.savePct,
      investPct: split.investPct,
    })
    navigate('/onboarding/deposit')
  }

  return (
    <OnboardingLayout step={3}>
      <h1 className="font-heading text-2xl text-onbg">Choose your plan</h1>
      <p className="text-xs text-muted mt-1">
        Based on your answers, we think {BIG_THREE[recommended].title} fits you well — but it's your call.
      </p>

      <div className="mt-6 space-y-3">
        <PlanChoiceCard
          title={BIG_THREE.saver.title}
          blurb={BIG_THREE.saver.blurb}
          splitLabel="50 / 50 / 0"
          recommended={recommended === 'saver'}
          selected={choice === 'saver'}
          onSelect={() => setChoice('saver')}
        />
        <PlanChoiceCard
          title={BIG_THREE.growth.title}
          blurb={BIG_THREE.growth.blurb}
          splitLabel="25 / 25 / 50"
          recommended={recommended === 'growth'}
          selected={choice === 'growth'}
          onSelect={() => setChoice('growth')}
        />
        <PlanChoiceCard
          title="Custom"
          blurb="Set your own Spend / Save / Invest split."
          selected={choice === 'custom'}
          onSelect={() => setChoice('custom')}
        >
          {choice === 'custom' && <SplitSliders {...customSplit} onChange={setCustomSplit} />}
        </PlanChoiceCard>
      </div>

      <button
        type="button"
        disabled={!choice}
        onClick={handleContinue}
        className="mt-8 w-full rounded-full bg-accent disabled:bg-surface-2 disabled:text-muted text-bg font-semibold px-6 py-3 text-sm"
      >
        Continue
      </button>
    </OnboardingLayout>
  )
}
