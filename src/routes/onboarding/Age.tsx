import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { useStore } from '../../lib/store'

const MIN_AGE = 18
const MAX_AGE = 120

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function earliestValidBirthdateISO(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - MAX_AGE)
  return d.toISOString().slice(0, 10)
}

/** Full birthday-aware age, not just a year subtraction — someone born
 * December 2008 isn't 18 yet in June, even though 2026-2008=18. */
function calculateAge(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())
  if (!hasHadBirthdayThisYear) age--
  return age
}

export function OnboardingAge() {
  const navigate = useNavigate()
  const { state, updateOnboardingDraft } = useStore()
  const [dateOfBirth, setDateOfBirth] = useState(state.onboardingDraft.dateOfBirth ?? '')

  const parsedDob = dateOfBirth ? new Date(`${dateOfBirth}T00:00:00`) : null
  const age = parsedDob && !Number.isNaN(parsedDob.getTime()) ? calculateAge(parsedDob) : null
  const isUnderage = age != null && age < MIN_AGE
  const canContinue = age != null && age >= MIN_AGE && age <= MAX_AGE

  const handleContinue = () => {
    if (!canContinue) return
    updateOnboardingDraft({ dateOfBirth })
    navigate('/onboarding/status')
  }

  return (
    <OnboardingLayout step={0}>
      <h1 className="font-heading text-2xl text-onbg">What's your date of birth?</h1>
      <p className="text-xs text-muted mt-1">
        SmartSplit's Invest bucket is simulated investing — you need to be 18 or older to open one,
        the same as a real investment account.
      </p>

      <div className="mt-6">
        <label htmlFor="onboarding-dob" className="text-xs font-medium text-muted">
          Date of birth
        </label>
        <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-surface px-3 focus-within:border-accent">
          <input
            id="onboarding-dob"
            type="date"
            min={earliestValidBirthdateISO()}
            max={todayISO()}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full bg-transparent px-2 py-2.5 text-sm text-onbg outline-none [color-scheme:dark]"
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
