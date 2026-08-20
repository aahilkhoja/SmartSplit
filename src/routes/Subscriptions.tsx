import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { detectSubscriptions } from '../lib/subscriptions'
import { SubscriptionPanel } from '../components/SubscriptionPanel'

export function Subscriptions() {
  const { state } = useStore()
  const [scanning, setScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState<Date | null>(null)

  const subscriptions = useMemo(() => detectSubscriptions(state.transactions), [state.transactions])

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setLastScanned(new Date())
    }, 900)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-onbg">Subscription scanner</h1>
        <p className="text-xs text-muted mt-1">
          Quietly scans your Spend activity for repeat charges you might have forgotten about.
        </p>
      </div>

      <button
        type="button"
        onClick={handleScan}
        disabled={scanning}
        className="w-full rounded-full bg-accent disabled:opacity-70 text-bg font-semibold px-6 py-3 text-sm"
      >
        {scanning ? 'Scanning your activity…' : 'Scan now'}
      </button>
      {lastScanned && (
        <p className="text-[11px] text-muted -mt-4">Last scanned {lastScanned.toLocaleTimeString()}</p>
      )}

      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <SubscriptionPanel subscriptions={subscriptions} />
      </div>
    </div>
  )
}
