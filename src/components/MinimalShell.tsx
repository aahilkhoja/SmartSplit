import { Link, Outlet } from 'react-router-dom'
import { DisclaimerFooter } from './DisclaimerFooter'

/** Header-only layout used for Welcome, Sign In/Up, and the onboarding flow. */
export function MinimalShell() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="px-6 pt-6 pb-2 shrink-0">
        <Link to="/" className="font-heading text-xl text-onbg">
          Smart<span className="text-accent">Split</span>
        </Link>
      </header>
      <div className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </div>
      <div className="shrink-0">
        <DisclaimerFooter />
      </div>
    </div>
  )
}
