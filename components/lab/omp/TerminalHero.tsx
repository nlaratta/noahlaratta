import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TERMINAL_SCENES, TerminalScene } from '../../../lib/omp-guide'

const lineColor: Record<string, string> = {
  in: 'text-gray-100',
  sys: 'text-text-secondary',
  out: 'text-primary-light',
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/**
 * Animated faux-terminal: types the first command, then streams the remaining
 * lines. Replayable. Degrades to fully-revealed if JS is off or reduced-motion.
 */
export default function TerminalHero({ scene = 'intro' }: { scene?: keyof typeof TERMINAL_SCENES | string }) {
  const data: TerminalScene = TERMINAL_SCENES[scene] ?? TERMINAL_SCENES.intro
  const cmd = data.lines[0]?.text ?? ''
  const rest = data.lines.slice(1)

  // Start fully-revealed so SSR/no-JS shows the whole scene; animate on mount.
  const [typed, setTyped] = useState(cmd.length)
  const [revealed, setRevealed] = useState(rest.length)
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const play = useCallback(() => {
    clearTimers()
    if (prefersReducedMotion()) {
      setTyped(cmd.length)
      setRevealed(rest.length)
      return
    }
    setRunning(true)
    setTyped(0)
    setRevealed(0)
    const speed = 34 // ms per char
    for (let i = 1; i <= cmd.length; i++) {
      timers.current.push(setTimeout(() => setTyped(i), i * speed))
    }
    const afterCmd = cmd.length * speed + 280
    rest.forEach((_, idx) => {
      timers.current.push(setTimeout(() => setRevealed(idx + 1), afterCmd + idx * 360))
    })
    timers.current.push(
      setTimeout(() => setRunning(false), afterCmd + rest.length * 360 + 200),
    )
  }, [cmd, rest])

  useEffect(() => {
    play()
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  return (
    <div className="not-prose rounded-xl overflow-hidden border border-border shadow-sm bg-[#10231b]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0b1813] border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-text-secondary font-mono">{data.title}</span>
        <button
          onClick={play}
          className="ml-auto text-xs text-text-secondary hover:text-primary-light transition-colors font-mono"
          aria-label="Replay terminal animation"
        >
          {running ? '▸ playing' : '↻ replay'}
        </button>
      </div>

      <div className="p-4 sm:p-5 font-mono text-[13px] leading-relaxed min-h-[180px]">
        <div className={lineColor.in}>
          <span className="text-primary-light select-none">$ </span>
          {cmd.slice(0, typed)}
          {running && typed < cmd.length && (
            <span className="inline-block w-2 h-4 -mb-0.5 bg-primary-light animate-pulse" />
          )}
        </div>
        {rest.map((line, idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{ opacity: idx < revealed ? 1 : 0, y: idx < revealed ? 0 : 4 }}
            transition={{ duration: 0.25 }}
            className={`${lineColor[line.kind]} ${line.kind === 'sys' ? 'italic' : ''} mt-1`}
          >
            {line.kind === 'sys' ? '· ' : ''}
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
