import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'

export function Welcome() {
  const { state } = useStore()

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-8 text-center">
      <h1 className="font-heading text-3xl leading-tight text-onbg">
        Your paycheck gets a <span className="text-accent">plan</span> before you spend it.
      </h1>
      <p className="mt-4 text-sm text-muted">
        A short onboarding recommends how to split what you earn across Spend, Save, and Invest —
        then routes deposits into accounts you already control.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-4 text-left text-xs text-muted space-y-1.5">
        <p className="font-medium text-onbg mb-1">SmartSplit is not a bank.</p>
        <p>• We don't own your money.</p>
        <p>• We don't promise returns.</p>
        <p>• We don't replace financial advice.</p>
        <p>• You're in control of everything.</p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {state.onboardingComplete && state.auth.signedIn ? (
          <Link
            to="/dashboard"
            className="rounded-full bg-accent text-bg font-semibold px-6 py-3 text-sm"
          >
            Go to your dashboard
          </Link>
        ) : (
          <>
            <Link to="/signup" className="rounded-full bg-accent text-bg font-semibold px-6 py-3 text-sm">
              Get started
            </Link>
            <Link to="/signin" className="rounded-full border border-white/15 text-onbg px-6 py-3 text-sm">
              I already have an account
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
