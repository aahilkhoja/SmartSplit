import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'

export function SignIn() {
  const { state, signIn } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (state.auth.signedIn && state.onboardingComplete) {
    return <Navigate to="/dashboard" replace />
  }

  const canSubmit = email.trim().length > 0 && password.length > 0

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const fallbackName = email.split('@')[0] || 'there'
    signIn(state.auth.displayName || fallbackName)
    navigate(state.onboardingComplete ? '/dashboard' : '/onboarding/age')
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-4">
      <h1 className="font-heading text-2xl text-onbg">Welcome back</h1>
      <p className="text-xs text-muted mt-1">
        Prototype sign-in — any email and password combination works here.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-onbg outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-onbg outline-none focus:border-accent"
          />
        </label>

        <div className="text-right">
          <button type="button" className="text-xs text-accent-2">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-accent disabled:bg-surface-2 disabled:text-muted text-bg font-semibold px-6 py-3 text-sm mt-2"
        >
          Sign in
        </button>
      </form>

      <p className="text-xs text-muted mt-4 text-center">
        By continuing you agree to the (mock) <span className="text-accent-2">Terms and Conditions</span>.
      </p>

      <p className="text-sm text-muted mt-auto pt-6 text-center">
        New to SmartSplit?{' '}
        <Link to="/signup" className="text-accent-2">
          Create an account
        </Link>
      </p>
    </div>
  )
}
