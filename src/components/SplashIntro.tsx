import { useEffect, useState } from 'react'
import logoMark from '../assets/logo-mark.png'
import logoWordmark from '../assets/logo-wordmark.png'

/**
 * Recreates the Figma intro-animation flow using the real logo assets: blank
 * hold -> logomark scales/fades in large -> mark settles smaller -> crossfades
 * into the full "SmartSplit" wordmark with tagline -> the splash fades out to
 * reveal the real Welcome page underneath. All stages auto-advance on a timer
 * (matching the "after delay" triggers in the source prototype), no interaction
 * required. Timings are a tuned approximation, not extracted frame-exact from
 * Figma — see the reference video/screens for the original if these need
 * adjusting.
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
      <div className="relative flex items-center justify-center">
        {/* Symbol-only mark: fades/scales in large, then shrinks before the
            wordmark crossfades over it. */}
        <img
          src={logoMark}
          alt=""
          className={`transition-all ease-out ${showMark ? 'opacity-100' : 'opacity-0 scale-50'} ${
            showWordmark ? 'opacity-0' : ''
          } ${markShrunk ? 'w-14 h-14 duration-500' : 'w-32 h-32 duration-500'}`}
        />
        {/* Full wordmark crossfades in over the mark's resting position. */}
        <img
          src={logoWordmark}
          alt="SmartSplit"
          className={`absolute w-56 transition-opacity duration-500 ease-out ${
            showWordmark ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <p
        className={`mt-4 text-sm text-muted transition-opacity duration-500 delay-150 ${
          showWordmark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Your paycheck gets a plan before you spend it.
      </p>
    </div>
  )
}
