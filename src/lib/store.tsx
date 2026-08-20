import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppState, Alert, BucketId, Plan, Transaction, UserProfile } from '../types'
import { seedBuckets, seedTransactions } from './mockData'
import { monthlySpend } from './spend'

const STORAGE_KEY = 'smartsplit.state.v2'

function freshState(): AppState {
  return {
    auth: { displayName: '', signedIn: false },
    profile: null,
    plan: null,
    buckets: seedBuckets(),
    transactions: seedTransactions(),
    alerts: [],
    onboardingComplete: false,
  }
}

function loadState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as AppState
    } catch {
      // fall through to fresh state
    }
  }
  return freshState()
}

interface StoreContextValue {
  state: AppState
  signUp: (displayName: string) => void
  signIn: (displayName: string) => void
  signOut: () => void
  setProfile: (profile: UserProfile) => void
  confirmPlan: (plan: Omit<Plan, 'confirmedAt'>) => void
  updatePlan: (plan: Omit<Plan, 'confirmedAt'>) => void
  simulatePaycheck: () => void
  recordSpend: (amount: number, label: string) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const signUp = (displayName: string) => {
    setState((s) => ({ ...s, auth: { displayName, signedIn: true } }))
  }

  const signIn = (displayName: string) => {
    setState((s) => ({ ...s, auth: { displayName: displayName || s.auth.displayName, signedIn: true } }))
  }

  const signOut = () => {
    setState((s) => ({ ...s, auth: { ...s.auth, signedIn: false } }))
  }

  const setProfile = (profile: UserProfile) => {
    setState((s) => ({ ...s, profile }))
  }

  const confirmPlan = (plan: Omit<Plan, 'confirmedAt'>) => {
    setState((s) => ({
      ...s,
      plan: { ...plan, confirmedAt: new Date().toISOString() },
      onboardingComplete: true,
    }))
  }

  const updatePlan = (plan: Omit<Plan, 'confirmedAt'>) => {
    setState((s) => ({
      ...s,
      plan: { ...plan, confirmedAt: s.plan?.confirmedAt ?? new Date().toISOString() },
    }))
  }

  const simulatePaycheck = () => {
    setState((s) => {
      if (!s.profile || !s.plan) return s
      const { incomeAmount } = s.profile
      const { spendPct, savePct, investPct } = s.plan
      const splitAmounts: Record<BucketId, number> = {
        spend: Math.round(incomeAmount * (spendPct / 100) * 100) / 100,
        save: Math.round(incomeAmount * (savePct / 100) * 100) / 100,
        invest: Math.round(incomeAmount * (investPct / 100) * 100) / 100,
      }

      const now = new Date().toISOString()
      const newTransactions: Transaction[] = (Object.keys(splitAmounts) as BucketId[])
        .filter((bucket) => splitAmounts[bucket] > 0)
        .map((bucket) => ({
          id: makeId('tx'),
          date: now,
          bucket,
          kind: 'deposit-split',
          amount: splitAmounts[bucket],
          label: `Paycheck split → ${bucket[0].toUpperCase()}${bucket.slice(1)}`,
        }))

      return {
        ...s,
        buckets: {
          spend: Math.round((s.buckets.spend + splitAmounts.spend) * 100) / 100,
          save: Math.round((s.buckets.save + splitAmounts.save) * 100) / 100,
          invest: Math.round((s.buckets.invest + splitAmounts.invest) * 100) / 100,
        },
        transactions: [...newTransactions, ...s.transactions],
      }
    })
  }

  const recordSpend = (amount: number, label: string) => {
    setState((s) => {
      const spentBefore = monthlySpend(s.transactions)
      const spentAfter = spentBefore + amount
      const newTx: Transaction = {
        id: makeId('tx'),
        date: new Date().toISOString(),
        bucket: 'spend',
        kind: 'spend',
        amount,
        label,
      }

      const crossedLimit = !!s.plan && s.plan.spendLimit > 0 && spentBefore < s.plan.spendLimit && spentAfter >= s.plan.spendLimit
      const newAlerts: Alert[] = crossedLimit
        ? [
            {
              id: makeId('alert'),
              date: new Date().toISOString(),
              message: `You've reached your $${s.plan!.spendLimit.toFixed(0)} monthly spend guideline.`,
            },
            ...s.alerts,
          ]
        : s.alerts

      return {
        ...s,
        buckets: { ...s.buckets, spend: Math.round((s.buckets.spend - amount) * 100) / 100 },
        transactions: [newTx, ...s.transactions],
        alerts: newAlerts,
      }
    })
  }

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(freshState())
  }

  return (
    <StoreContext.Provider
      value={{
        state,
        signUp,
        signIn,
        signOut,
        setProfile,
        confirmPlan,
        updatePlan,
        simulatePaycheck,
        recordSpend,
        resetAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
