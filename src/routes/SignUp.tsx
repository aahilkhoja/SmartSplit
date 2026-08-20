import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'

export function SignUp() {
  const { state, signUp } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (state.auth.signedIn && state.onboardingComplete) {
    return <Navigate to="/dashboard" replace />
  }

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length > 0

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    signUp(name.trim())
    navigate('/onboarding/status')
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-4">
      <h1 className="font-heading text-2xl text-onbg">Create your account</h1>
      <p className="text-xs text-muted mt-1">
        Prototype sign-up — nothing here creates a real account or is sent anywhere.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Name" value={name} onChange={setName} placeholder="Jurica" />
        <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
        <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-accent disabled:bg-surface-2 disabled:text-muted text-bg font-semibold px-6 py-3 text-sm mt-2"
        >
          Create account
        </button>
      </form>

      <p className="text-xs text-muted mt-4 text-center">
        By continuing you agree to the (mock) <span className="text-accent-2">Terms and Conditions</span>.
      </p>

      <p className="text-sm text-muted mt-auto pt-6 text-center">
        Already have an account?{' '}
        <Link to="/signin" className="text-accent-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-onbg outline-none focus:border-accent"
      />
    </label>
  )
}
