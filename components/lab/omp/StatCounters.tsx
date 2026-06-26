import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { STATS, Stat } from '../../../lib/omp-guide'

function CountUp({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(stat.value) // SSR/no-JS shows the final value

  useEffect(() => {
    if (!inView) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || stat.value === 0) {
      setN(stat.value)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 900
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * stat.value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    setN(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, stat.value])

  return (
    <span ref={ref} className="text-3xl font-bold text-primary tabular-nums">
      {stat.prefix}
      {n}
      {stat.suffix}
    </span>
  )
}

export default function StatCounters() {
  return (
    <div className="not-prose my-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((s, idx) => (
        <div key={idx} className="border border-border rounded-xl bg-surface p-4">
          <CountUp stat={s} />
          <span className="block text-sm font-medium text-foreground mt-1">{s.label}</span>
          {s.note && <span className="block text-xs text-text-secondary mt-0.5">{s.note}</span>}
        </div>
      ))}
    </div>
  )
}
