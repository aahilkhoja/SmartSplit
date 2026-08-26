export type ResidencyStatus = 'international' | 'domestic'
export type WorkType = 'part-time' | 'full-time'
export type IncomeBasis = 'before-tax' | 'after-tax'

export interface UserProfile {
  status: ResidencyStatus
  workType: WorkType
  /** Monthly income amount. */
  incomeAmount: number
  incomeBasis: IncomeBasis
}

export type BucketId = 'spend' | 'save' | 'invest'

export type PlanChoice = 'saver' | 'growth' | 'custom'

export interface Plan {
  choice: PlanChoice
  spendPct: number
  savePct: number
  investPct: number
  /** Self-set monthly spend ceiling used for the discreet spend-limit meter and alerts. */
  spendLimit: number
  confirmedAt: string
}

export type Buckets = Record<BucketId, number>

export type TransactionKind = 'deposit-split' | 'spend' | 'subscription-charge'

export interface Transaction {
  id: string
  date: string
  bucket: BucketId
  kind: TransactionKind
  amount: number
  label: string
}

export interface DetectedSubscription {
  label: string
  amount: number
  occurrences: number
  lastDate: string
}

export interface Alert {
  id: string
  date: string
  message: string
}

export interface Auth {
  displayName: string
  /** Account handle, shown on Profile and editable there — separate from
   * displayName so a returning user with no username yet (from before this
   * existed) has somewhere to set one, without it blocking sign-in. */
  username: string
  signedIn: boolean
}

/** Mock, display-only category breakdown shown on the Plan Detail screen. */
export interface CategorySlice {
  bucket: BucketId
  label: string
  pct: number
}

/** Mock, display-only "what it's invested in" breakdown for the Learning screen. */
export interface InvestmentSlice {
  label: string
  pct: number
  blurb: string
}

/** Mock monthly income/expense series for the Statistics screen. */
export interface TrendPoint {
  month: string
  income: number
  expenses: number
}

/** In-progress onboarding answers, persisted so navigating back to an earlier
 * step (or refreshing mid-flow) restores what was already entered instead of
 * resetting it. Cleared once the plan is confirmed. */
export interface OnboardingDraft {
  age?: number
  status?: ResidencyStatus
  workType?: WorkType
  incomeAmount?: number
  incomeBasis?: IncomeBasis
  planChoice?: PlanChoice
  spendPct?: number
  savePct?: number
  investPct?: number
  spendLimit?: number
}

export interface AppState {
  auth: Auth
  profile: UserProfile | null
  plan: Plan | null
  buckets: Buckets
  transactions: Transaction[]
  alerts: Alert[]
  onboardingComplete: boolean
  onboardingDraft: OnboardingDraft
  /** ISO timestamp marking the start of the current spend-guideline cycle.
   * Reset to "now" whenever a paycheck is simulated, since this demo never
   * advances real calendar time — without this, "monthly" spend was measured
   * against the real calendar month and could never reset no matter how many
   * paychecks you simulated in one sitting. */
  cycleStart: string
}
