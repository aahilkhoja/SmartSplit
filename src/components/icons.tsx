import type { SVGProps } from 'react'

/** Shared stroke-icon set — hand-rolled inline SVGs, no icon library dependency,
 * matching the style already used in BottomTabBar. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconWallet(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M16 12h3v3h-3a1.5 1.5 0 0 1 0-3Z" />
      <path d="M3 8h13" />
    </Icon>
  )
}

export function IconPiggyBank(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 11a6 6 0 0 1 6-6h4.5L17 3l1.5 2H19a2 2 0 0 1 2 2v1l-2 1v2a5 5 0 0 1-2 4v3h-3v-2h-2v2H9v-3a6 6 0 0 1-5-5.9V11Z" />
      <circle cx="15" cy="9" r="0.6" fill="currentColor" stroke="none" />
      <path d="M4 12H2" />
    </Icon>
  )
}

export function IconTrendingUp(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </Icon>
  )
}

export function IconPieChart(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 2v10l7 7" />
      <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
    </Icon>
  )
}

export function IconBook(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M19 19a2 2 0 0 0-2-2H4" />
    </Icon>
  )
}

/** Selection glyph: a shape-based cue for "chosen" state, used alongside (never
 * instead of) color, so selection never depends on color perception alone. */
export function IconCheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </Icon>
  )
}
