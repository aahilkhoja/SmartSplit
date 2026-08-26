import type { BucketId } from '../types'
import { IconPiggyBank, IconTrendingUp, IconWallet } from './icons'
import { formatCurrency } from '../lib/format'

const BUCKET_META: Record<
  BucketId,
  { label: string; blurb: string; iconBg: string; iconColor: string; Icon: typeof IconWallet }
> = {
  spend: {
    label: 'Spend',
    blurb: 'Everyday money, ready to use',
    iconBg: 'bg-accent-2/15',
    iconColor: 'text-accent-2',
    Icon: IconWallet,
  },
  save: {
    label: 'Save',
    blurb: 'Your safety net, growing quietly',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent',
    Icon: IconPiggyBank,
  },
  invest: {
    label: 'Invest',
    blurb: 'Simulated long-term growth',
    iconBg: 'bg-danger/15',
    iconColor: 'text-danger',
    Icon: IconTrendingUp,
  },
}

export function BucketCard({ bucket, balance }: { bucket: BucketId; balance: number }) {
  const meta = BUCKET_META[bucket]
  const { Icon } = meta
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4 flex items-center gap-3">
      <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${meta.iconBg} ${meta.iconColor}`}>
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{meta.label}</p>
        <p className="text-2xl font-heading tabular-nums text-onbg leading-tight">{formatCurrency(balance)}</p>
        <p className="text-[11px] text-muted">{meta.blurb}</p>
      </div>
    </div>
  )
}
