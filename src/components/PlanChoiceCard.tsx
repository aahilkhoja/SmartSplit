import type { ReactNode } from 'react'
import { IconCheckCircle } from './icons'

interface PlanChoiceCardProps {
  title: string
  blurb: string
  splitLabel?: string
  recommended?: boolean
  selected: boolean
  onSelect: () => void
  children?: ReactNode
}

export function PlanChoiceCard({
  title,
  blurb,
  splitLabel,
  recommended,
  selected,
  onSelect,
  children,
}: PlanChoiceCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={`w-full text-left rounded-2xl border px-4 py-4 transition-colors cursor-pointer ${
        selected ? 'border-accent bg-accent/10' : 'border-white/10 bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          {/* Selection is shown by more than color: a checkmark glyph appears (or an
              empty placeholder circle when not selected) so the state doesn't depend
              on distinguishing the accent border/tint color. */}
          <span className={`mt-0.5 shrink-0 ${selected ? 'text-accent' : 'text-muted/40'}`} aria-hidden="true">
            <IconCheckCircle width={20} height={20} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-lg text-onbg">{title}</h3>
              {recommended && (
                <span className="text-[10px] uppercase tracking-wide font-semibold text-bg bg-accent rounded-full px-2 py-0.5">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-1">{blurb}</p>
          </div>
        </div>
        {splitLabel && (
          <span className="shrink-0 text-xs font-medium text-accent-2 tabular-nums">{splitLabel}</span>
        )}
      </div>
      {children && <div className="mt-3 pl-7">{children}</div>}
    </div>
  )
}
