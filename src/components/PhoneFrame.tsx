import type { ReactNode } from 'react'

/**
 * Centers the app in a mobile-style container at any viewport width, so the
 * prototype reads as a phone screen even when opened on desktop.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh w-full bg-black flex items-center justify-center sm:py-6">
      <div className="w-full h-svh sm:max-w-[430px] sm:h-[900px] sm:max-h-[92svh] bg-bg sm:rounded-[2.5rem] sm:border-4 sm:border-surface-2 sm:shadow-2xl overflow-hidden flex flex-col relative">
        {children}
      </div>
    </div>
  )
}
