import { Link, Outlet } from 'react-router-dom'
import { BottomTabBar } from './BottomTabBar'
import { NotificationToast } from './NotificationToast'
import { useStore } from '../lib/store'

/** Layout for every post-onboarding screen: top bar (with alerts bell) + scrollable content +
 * bottom tab bar. Mounted once via a React Router layout route (not per-page) so NotificationToast
 * only fires for genuinely new alerts, not on every navigation. */
export function AppShell() {
  const { state } = useStore()
  const alertCount = state.alerts.length

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <NotificationToast />
      <header className="flex items-center justify-between px-5 pt-5 pb-1 shrink-0">
        <Link to="/dashboard" className="font-heading text-lg text-onbg">
          Smart<span className="text-accent">Split</span>
        </Link>
        <Link to="/alerts" aria-label="Notifications" className="relative h-8 w-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {alertCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-danger" />
          )}
        </Link>
      </header>
      <main className="flex-1 overflow-y-auto px-5 py-4">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
