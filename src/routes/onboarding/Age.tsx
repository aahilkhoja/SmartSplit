import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../../components/OnboardingLayout'
import { Dropdown } from '../../components/Dropdown'
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

  const monthOptions = useMemo(
    () => MONTHS.map((name, i) => ({ value: String(i + 1), label: name })),
    [],
  )
  const dayOptions = useMemo(() => days.map((d) => ({ value: String(d), label: String(d) })), [days])
  const yearOptions = useMemo(() => years.map((y) => ({ value: String(y), label: String(y) })), [years])

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
          <Dropdown
            id="dob-month"
            ariaLabel="Month"
            placeholder="Month"
            value={month != null ? String(month) : ''}
            options={monthOptions}
            onChange={handleMonthChange}
          />
          <Dropdown
            id="dob-day"
            ariaLabel="Day"
            placeholder="Day"
            value={day != null ? String(day) : ''}
            options={dayOptions}
            onChange={(v) => setDay(v ? Number(v) : null)}
          />
          <Dropdown
            id="dob-year"
            ariaLabel="Year"
            placeholder="Year"
            value={year != null ? String(year) : ''}
            options={yearOptions}
            onChange={handleYearChange}
          />
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
