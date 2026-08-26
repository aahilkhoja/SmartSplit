import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { useStore } from '../../lib/store'

const MIN_AGE = 18
const MAX_AGE = 120

export function OnboardingAge() {
  const navigate = useNavigate()
  const { state, updateOnboardingDraft } = useStore()
  const [age, setAge] = useState(state.onboardingDraft.age != null ? String(state.onboardingDraft.age) : '')

  const parsedAge = Number(age)
  const hasEnteredAge = age.trim() !== '' && Number.isFinite(parsedAge)
  const isUnderage = hasEnteredAge && parsedAge < MIN_AGE
  const canContinue = hasEnteredAge && parsedAge >= MIN_AGE && parsedAge <= MAX_AGE

  const handleContinue = () => {
    if (!canContinue) return
    updateOnboardingDraft({ age: parsedAge })
    navigate('/onboarding/status')
  }

  return (
    <OnboardingLayout step={0}>
      <h1 className="font-heading text-2xl text-onbg">How old are you?</h1>
      <p className="text-xs text-muted mt-1">
        SmartSplit's Invest bucket is simulated investing — you need to be 18 or older to open one,
        the same as a real investment account.
      </p>

      <div className="mt-6">
        <label htmlFor="onboarding-age" className="text-xs font-medium text-muted">
          Your age
        </label>
        <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-surface px-3 max-w-[140px] focus-within:border-accent">
          <input
            id="onboarding-age"
            type="number"
            min={0}
            max={MAX_AGE}
            step={1}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="18"
            className="w-full bg-transparent px-2 py-2.5 text-sm text-onbg outline-none"
          />
        </div>
        {isUnderage && (
          <p className="mt-2 text-xs text-danger">
            You need to be 18 or older to create a SmartSplit account.
          </p>
        )}
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
