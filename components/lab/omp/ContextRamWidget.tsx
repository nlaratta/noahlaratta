import { useState } from 'react'
import { motion } from 'framer-motion'
import { CTX_TABLE, TOTAL_RAM_GB } from '../../../lib/omp-guide'

const pct = (gb: number) => (gb / TOTAL_RAM_GB) * 100

export default function ContextRamWidget() {
  const [i, setI] = useState(CTX_TABLE.length - 1) // default to 1M
  const row = CTX_TABLE[i]
  const modelGb = +(row.wiredGb - row.kvGb).toFixed(1)

  const segments = [
    { key: 'model', label: 'Model (wired)', gb: modelGb, className: 'bg-primary-dark' },
    { key: 'kv', label: 'KV cache', gb: row.kvGb, className: 'bg-primary-light' },
    { key: 'free', label: 'Free for everything else', gb: row.freeGb, className: 'bg-primary-lighter' },
  ]

  return (
    <div className="not-prose my-8 border border-border rounded-xl bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-text-secondary">Context window</span>
          <p className="text-sm text-foreground/80">
            DeepSeek V4 Flash on a {TOTAL_RAM_GB}GB Mac — drag the size, watch the RAM.
          </p>
        </div>
        <div className="flex gap-1 bg-background rounded-lg p-1 border border-border">
          {CTX_TABLE.map((r, idx) => (
            <button
              key={r.ctx}
              onClick={() => setI(idx)}
              className={`text-xs font-mono font-medium px-3 py-1.5 rounded-md transition-colors ${
                i === idx ? 'bg-primary text-white' : 'text-text-secondary hover:text-foreground'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stacked memory bar */}
      <div className="flex w-full h-9 rounded-lg overflow-hidden border border-border bg-background">
        {segments.map((s) => (
          <motion.div
            key={s.key}
            className={`${s.className} h-full`}
            initial={false}
            animate={{ width: `${pct(s.gb)}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {segments.map((s) => (
          <div key={s.key}>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${s.className}`} />
              <motion.span
                key={`${s.key}-${s.gb}`}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-foreground tabular-nums"
              >
                {s.gb} GB
              </motion.span>
            </div>
            <span className="block text-[11px] text-text-secondary mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs">
        <span
          className={`px-2 py-0.5 rounded-full font-medium ${
            row.thinkMax
              ? 'bg-primary-lighter text-primary-dark'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.thinkMax ? 'Think Max available' : 'Think Max off'}
        </span>
        <span className="text-text-secondary">
          {row.thinkMax
            ? `ctx ≥ 393,216 unlocks max-effort reasoning.`
            : `Think Max needs ctx ≥ 393,216 — not at ${row.label}.`}
        </span>
      </div>
    </div>
  )
}
