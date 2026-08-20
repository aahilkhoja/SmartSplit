import type { PlanChoice, ResidencyStatus, WorkType } from '../types'

export interface PlanChoiceDefinition {
  choice: PlanChoice
  title: string
  spendPct: number
  savePct: number
  investPct: number
  blurb: string
}

/** "The Big 3" — exact split model from the brief. Custom is user-defined via SplitSliders. */
export const BIG_THREE: Record<'saver' | 'growth', PlanChoiceDefinition> = {
  saver: {
    choice: 'saver',
    title: 'The Saver',
    spendPct: 50,
    savePct: 50,
    investPct: 0,
    blurb: 'Split evenly between Spend and Save. No Invest yet — build your safety net first.',
  },
  growth: {
    choice: 'growth',
    title: 'The Growth',
    spendPct: 25,
    savePct: 25,
    investPct: 50,
    blurb: 'Lean into Invest while Spend and Save stay balanced. For steadier income.',
  },
}

/** The app "learns the user's situation first" — a lightweight nudge, not a hard rule. */
export function recommendPlanChoice(status: ResidencyStatus, workType: WorkType): 'saver' | 'growth' {
  if (workType === 'part-time') return 'saver'
  if (status === 'international') return 'saver'
  return 'growth'
}

export function isValidSplit(spendPct: number, savePct: number, investPct: number): boolean {
  return spendPct + savePct + investPct === 100 && spendPct >= 0 && savePct >= 0 && investPct >= 0
}
