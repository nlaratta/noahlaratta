import { CONTOUR_PATHS, SUMMIT } from '../lib/contours'

/**
 * The topographic contour field. Decorative: hidden from assistive tech.
 * `animate` draws the lines in once (CSS only; skipped for reduced motion).
 */
export default function Contours({
  className = '',
  animate = false,
  strength = 1,
  variant = 0,
  summit = false,
  preserveAspectRatio = 'xMidYMid slice',
}: {
  className?: string
  animate?: boolean
  /** Opacity multiplier, for quieter uses such as card covers. */
  strength?: number
  /** Picks a mirrored, zoomed crop so repeated uses don't look identical. */
  variant?: number
  /** Mark the highest peak with a small gold triangle. */
  summit?: boolean
  preserveAspectRatio?: string
}) {
  const flip = [
    '',
    'translate(1200 0) scale(-1 1)',
    'translate(0 600) scale(1 -1)',
    'translate(1200 600) scale(-1 -1)',
  ][variant % 4]
  // Zoomed windows that stay inside the field (x ≥ 1200·(1−s), y ≥ 600·(1−s)).
  const zoom = ['', 'translate(-300 -100) scale(1.5)', 'translate(-560 -220) scale(1.6)', 'translate(-150 -260) scale(1.5)', 'translate(-700 -40) scale(1.7)'][
    Math.floor(variant / 4) % 5
  ]
  const transform = [flip, zoom].filter(Boolean).join(' ')
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 600"
      preserveAspectRatio={preserveAspectRatio}
      className={`pointer-events-none text-primary ${className}`}
      fill="none"
    >
      <g transform={transform || undefined}>
        {CONTOUR_PATHS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={p.level > 0.8 ? 1.4 : 1}
            strokeOpacity={(0.22 + p.level * 0.5) * strength}
            vectorEffect="non-scaling-stroke"
            className={animate ? 'contour-line' : undefined}
            style={animate ? { animationDelay: `${(1 - p.level) * 0.9}s` } : undefined}
          />
        ))}
        {summit && (
          <g>
            <circle cx={SUMMIT.x} cy={SUMMIT.y} r={30} stroke="var(--gold-mark)" strokeOpacity={0.5} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <circle cx={SUMMIT.x} cy={SUMMIT.y} r={12} fill="var(--gold-mark)" />
          </g>
        )}
      </g>
    </svg>
  )
}
