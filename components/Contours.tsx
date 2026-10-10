import { CONTOUR_PATHS } from '../lib/contours'

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
  /** 0–3: mirror the field so repeated uses don't look identical. */
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
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 600"
      preserveAspectRatio={preserveAspectRatio}
      className={`pointer-events-none text-primary ${className}`}
      fill="none"
    >
      <g transform={flip || undefined}>
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
            <circle cx={960} cy={240} r={30} stroke="var(--gold-mark)" strokeOpacity={0.5} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <circle cx={960} cy={240} r={12} fill="var(--gold-mark)" />
          </g>
        )}
      </g>
    </svg>
  )
}
