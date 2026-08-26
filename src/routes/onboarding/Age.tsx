import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { useStore } from '../../lib/store'

const MIN_AGE = 18
const MAX_AGE = 120

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** month is 1-12; day 0 of the *next* month is the last day of this one. */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Full birthday-aware age, not just a year subtraction — someone whose 18th
 * birthday is tomorrow is still 17 today. */
function calculateAge(dob: Date, now = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())
  if (!hasHadBirthdayThisYear) age--
  return age
}

function parseISODate(iso: string | undefined): { year: number | null; month: number | null; day: number | null } {
  if (!iso) return { year: null, month: null, day: null }
  const [y, m, d] = iso.split('-').map(Number)
  return { year: y || null, month: m || null, day: d || null }
}

const selectClass = 'w-full bg-transparent px-3 py-2.5 text-sm text-onbg outline-none'

export function OnboardingAge() {
  const navigate = useNavigate()
  const { state, updateOnboardingDraft } = useStore()
  const initial = parseISODate(state.onboardingDraft.dateOfBirth)

  const [year, setYear] = useState(initial.year)
  const [month, setMonth] = useState(initial.month)
  const [day, setDay] = useState(initial.day)

  const currentYear = new Date().getFullYear()
  // Most recent birth years first — the common convention, and it keeps the
  // list anchored near "today" the same way the old date input's max did.
  const years = useMemo(() => Array.from({ length: MAX_AGE + 1 }, (_, i) => currentYear - i), [currentYear])
  const maxDay = month && year ? daysInMonth(year, month) : 31
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay])

  // Changing month/year can invalidate an already-picked day (e.g. day 31 with
  // April selected) — clamp it down instead of leaving a now-impossible date.
  const handleMonthChange = (value: string) => {
    const m = value ? Number(value) : null
    setMonth(m)
    if (m && year && day && day > daysInMonth(year, m)) setDay(daysInMonth(year, m))
  }

  const handleYearChange = (value: string) => {
    const y = value ? Number(value) : null
    setYear(y)
    if (y && month && day && day > daysInMonth(y, month)) setDay(daysInMonth(y, month))
  }

  const isComplete = year != null && month != null && day != null
  const age = isComplete ? calculateAge(new Date(year, month - 1, day)) : null
  const isUnderage = age != null && age < MIN_AGE
  const canContinue = age != null && age >= MIN_AGE

  const handleContinue = () => {
    if (!canContinue || !year || !month || !day) return
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    updateOnboardingDraft({ dateOfBirth: iso })
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
        <span className="text-xs font-medium text-muted">Date of birth</span>
        <div className="mt-1 grid grid-cols-[1.4fr_1fr_1fr] gap-2">
          <div className="rounded-xl border border-white/10 bg-surface focus-within:border-accent">
            <label htmlFor="dob-month" className="sr-only">
              Month
            </label>
            <select
              id="dob-month"
              value={month ?? ''}
              onChange={(e) => handleMonthChange(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                Month
              </option>
              {MONTHS.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-white/10 bg-surface focus-within:border-accent">
            <label htmlFor="dob-day" className="sr-only">
              Day
            </label>
            <select
              id="dob-day"
              value={day ?? ''}
              onChange={(e) => setDay(e.target.value ? Number(e.target.value) : null)}
              className={selectClass}
            >
              <option value="" disabled>
                Day
              </option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-white/10 bg-surface focus-within:border-accent">
            <label htmlFor="dob-year" className="sr-only">
              Year
            </label>
            <select
              id="dob-year"
              value={year ?? ''}
              onChange={(e) => handleYearChange(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>
                Year
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isUnderage && (
          <p className="mt-2 text-xs text-danger">You need to be 18 or older to create a SmartSplit account.</p>
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
