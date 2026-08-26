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

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SplashIntro() {
  // Skip straight past the animation for anyone who's told their OS they
  // don't want motion — this splash *is* motion (scaling, crossfading), so
  // there's no reduced-motion equivalent to show; the respectful move is to
  // not force the wait at all rather than play it anyway or replay it silently.
  const [stage, setStage] = useState<Stage>(() => (prefersReducedMotion() ? 'done' : 'blank'))

  useEffect(() => {
    if (prefersReducedMotion()) return
    const timers = STAGE_TIMELINE.map(({ stage: s, at }) => setTimeout(() => setStage(s), at))
    return () => timers.forEach(clearTimeout)
  }, [])

  if (stage === 'done') return null

  const showWordmark = stage === 'wordmark'
  const markShrunk = stage === 'markSmall' || stage === 'wordmark'

  // Each element gets exactly one opacity/scale/size class computed here —
  // never combine multiple conditional Tailwind classes for the same CSS
  // property on one element. Stacking e.g. both "opacity-100" and "opacity-0"
  // in a className string doesn't "average" them or let the later one win by
  // JS logic; the browser resolves the conflict by generated-stylesheet order,
  // which silently froze this splash mid-crossfade instead of animating.
  const markOpacity = showWordmark ? 'opacity-0' : stage === 'blank' ? 'opacity-0 scale-50' : 'opacity-100'
  const markSize = markShrunk ? 'w-12 h-12' : 'w-28 h-28'
  const wordmarkOpacity = showWordmark ? 'opacity-100' : 'opacity-0'

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg transition-opacity duration-500 ${
        stage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center">
        {/* Symbol-only mark: fades/scales in large, then shrinks before the
            wordmark crossfades over it. max-w-none overrides Tailwind's
            preflight ("img{max-width:100%}") — without it, the *wordmark*
            below (absolute, so it doesn't contribute to this wrapper's
            shrink-to-fit width) gets clamped to whatever narrow width this
            in-flow mark image happens to define the wrapper as, instead of
            its own intended size. */}
        <img
          src={logoMark}
          alt=""
          className={`max-w-none transition-all duration-500 ease-out ${markOpacity} ${markSize}`}
        />
        {/* Full wordmark crossfades in over the mark's resting position. */}
        <img
          src={logoWordmark}
          alt="SmartSplit"
          className={`absolute max-w-none w-60 transition-opacity duration-500 ease-out ${wordmarkOpacity}`}
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
