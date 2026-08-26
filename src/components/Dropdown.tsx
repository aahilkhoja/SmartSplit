import { useEffect, useRef, useState } from 'react'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  id: string
  ariaLabel: string
  placeholder: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}

/**
 * A fully custom-styled dropdown, not a native <select> — native option
 * lists render as an unstyleable browser/OS popup (white background, system
 * font) on most platforms regardless of page CSS, which is exactly what
 * looked out of place against this app's dark theme. This one is plain divs
 * we control end to end, kept accessible via listbox/option roles.
 */
export function Dropdown({ id, ariaLabel, placeholder, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'center' })
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-1 rounded-xl border bg-surface px-3 py-2.5 text-sm ${
          open ? 'border-accent' : 'border-white/10'
        }`}
      >
        <span className={`truncate ${selected ? 'text-onbg' : 'text-muted'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-surface-2 py-1 shadow-lg"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`cursor-pointer px-3 py-2 text-sm ${
                opt.value === value ? 'bg-accent/15 text-accent' : 'text-onbg hover:bg-white/5'
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
