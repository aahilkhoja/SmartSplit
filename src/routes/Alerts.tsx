import { useStore } from '../lib/store'

export function Alerts() {
  const { state } = useStore()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl text-onbg">Notifications</h1>
        <p className="text-xs text-muted mt-1">
          Delivered discreetly, system-style, the moment you cross your spend guideline — not as a
          naggy in-app banner.
        </p>
      </div>

      {state.alerts.length === 0 ? (
        <p className="text-sm text-muted">No notifications yet. Simulate some spending to trigger one.</p>
      ) : (
        <ul className="space-y-2">
          {state.alerts.map((alert) => (
            <li key={alert.id} className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-danger/20 flex items-center justify-center text-danger font-heading text-xs">
                  !
                </span>
                <p className="text-xs font-semibold text-onbg">SmartSplit</p>
              </div>
              <p className="text-sm text-onbg mt-1.5">{alert.message}</p>
              <p className="text-[11px] text-muted mt-1">{new Date(alert.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
