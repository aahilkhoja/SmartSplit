import { useEffect, useState } from 'react'

/**
 * Recreates the Figma intro-animation flow: blank hold -> logomark scales/fades
 * in large -> mark settles smaller -> full "SmartSplit" wordmark + tagline forms
 * centered -> the splash fades out to reveal the real Welcome page underneath.
 * All stages auto-advance on a timer (matching the "after delay" triggers in the
 * source prototype), no interaction required. Timings are a tuned approximation,
 * not extracted frame-exact from Figma — see the reference video/screens for the
 * original if these need adjusting.
 */
type Stage = 'blank' | 'mark' | 'markSmall' | 'wordmark' | 'exit' | 'done'

const STAGE_TIMELINE: { stage: Stage; at: number }[] = [
  { stage: 'blank', at: 0 },
  { stage: 'mark', at: 200 },
  { stage: 'markSmall', at: 850 },
  { stage: 'wordmark', at: 1150 },
  { stage: 'exit', at: 2050 },
  { stage: 'done', at: 2500 },
]

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <rect x="8" y="8" width="70" height="26" rx="13" transform="rotate(28 8 8)" fill="currentColor" />
      <rect x="22" y="66" width="70" height="26" rx="13" transform="rotate(28 22 66)" fill="currentColor" />
    </svg>
  )
}

export function SplashIntro() {
  const [stage, setStage] = useState<Stage>('blank')

  useEffect(() => {
    const timers = STAGE_TIMELINE.map(({ stage: s, at }) => setTimeout(() => setStage(s), at))
    return () => timers.forEach(clearTimeout)
  }, [])

  if (stage === 'done') return null

  const showMark = stage === 'mark' || stage === 'markSmall' || stage === 'wordmark'
  const markShrunk = stage === 'markSmall' || stage === 'wordmark'
  const showWordmark = stage === 'wordmark'

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg transition-opacity duration-500 ${
        stage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex items-center">
        <LogoMark
          className={`text-accent transition-all ease-out ${
            showMark ? 'opacity-100' : 'opacity-0 scale-50'
          } ${markShrunk ? 'w-8 h-8 duration-500' : 'w-24 h-24 duration-500'}`}
        />
        <span
          className={`font-heading text-3xl text-onbg overflow-hidden transition-all duration-400 ease-out ${
            showWordmark ? 'max-w-xs opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'
          }`}
        >
          martSplit
        </span>
      </div>
      <p
        className={`mt-3 text-sm text-muted transition-opacity duration-500 delay-150 ${
          showWordmark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Your paycheck gets a plan before you spend it.
      </p>
    </div>
  )
}
