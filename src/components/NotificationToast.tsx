import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'

/**
 * Mimics a system push notification (icon + app name + message, top of screen,
 * auto-dismissing) rather than an in-app warning banner — per the brief's
 * "delivered as a system-style notification" requirement for the spend-limit alert.
 *
 * Keyed remount (via ToastBody's `key`) rather than a manual "already shown" ref:
 * a ref-guard here interacts badly with React's dev-mode Strict Mode effect
 * double-invoke (the guard blocks the second invocation from re-arming the
 * dismiss timer after the first one gets cleaned up, so the toast never hides).
 */
export function NotificationToast() {
  const { state } = useStore()
  const latest = state.alerts[0]
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  if (!latest || latest.id === dismissedId) return null

  return <ToastBody key={latest.id} id={latest.id} message={latest.message} onDone={setDismissedId} />
}

function ToastBody({
  id,
  message,
  onDone,
}: {
  id: string
  message: string
  onDone: (id: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 4000)
    return () => clearTimeout(timer)
  }, [id, onDone])

  return (
    // role="status" + aria-live: a sighted user sees this pop up and fade on
    // its own, but without an explicit live region a screen reader user would
    // never learn it appeared at all — the DOM insertion alone isn't announced.
    <div className="absolute top-3 left-3 right-3 z-50" role="status" aria-live="polite" aria-atomic="true">
      <div className="flex items-start gap-3 rounded-2xl bg-surface-2/95 backdrop-blur border border-white/10 shadow-lg px-3.5 py-3">
        <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-danger/20 flex items-center justify-center text-danger font-heading text-sm">
          !
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-onbg">SmartSplit</p>
          <p className="text-xs text-muted leading-snug">{message}</p>
        </div>
      </div>
    </div>
  )
}
