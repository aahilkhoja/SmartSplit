import { NavLink } from 'react-router-dom'

const TABS = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: (
      <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    ),
  },
  {
    to: '/transactions',
    label: 'Activity',
    icon: <path d="M4 6h16M4 12h16M4 18h10" />,
  },
  {
    to: '/subscriptions',
    label: 'Scanner',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.2-3.2" />
      </>
    ),
  },
  {
    to: '/statistics',
    label: 'Stats',
    icon: <path d="M4 20V10m6 10V4m6 16v-7" />,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
]

export function BottomTabBar() {
  return (
    <nav className="border-t border-white/10 bg-surface flex items-stretch shrink-0">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] ${
              isActive ? 'text-accent font-semibold' : 'text-muted font-normal'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={isActive ? 2.4 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {tab.icon}
              </svg>
              {tab.label}
              {/* Active state is shown by weight + stroke thickness + this dot, not
                  color alone, so it's still legible for color-blind users. */}
              <span
                className={`h-1 w-1 rounded-full transition-opacity ${isActive ? 'bg-accent opacity-100' : 'opacity-0'}`}
                aria-hidden="true"
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
