import { useState } from 'react'
import { motion } from 'framer-motion'
import { MODEL_ROLES } from '../../../lib/omp-guide'

export default function ModelRolesDiagram() {
  const [active, setActive] = useState(MODEL_ROLES[0].id)
  const current = MODEL_ROLES.find((r) => r.id === active) ?? MODEL_ROLES[0]

  return (
    <div className="not-prose my-8 border border-border rounded-xl bg-surface p-5">
      <span className="text-xs uppercase tracking-wider text-text-secondary">Model roles</span>
      <p className="text-sm text-foreground/80 mt-0.5 mb-4">
        omp routes work to four roles — hover or tap one. Each can point at a different model.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MODEL_ROLES.map((r) => {
          const on = active === r.id
          return (
            <button
              key={r.id}
              onMouseEnter={() => setActive(r.id)}
              onFocus={() => setActive(r.id)}
              onClick={() => setActive(r.id)}
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                on ? 'border-primary bg-primary-lighter/40' : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="font-mono text-sm font-semibold text-foreground">{r.label}</span>
              <span className="block text-[11px] text-text-secondary mt-0.5 truncate">
                {r.example}
              </span>
            </button>
          )
        })}
      </div>

      {/* flow to providers */}
      <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary">
        <span className="font-mono">roles</span>
        <span className="flex-1 border-t border-dashed border-border" />
        <span className="px-2 py-0.5 rounded bg-background border border-border">
          any OpenAI/Anthropic-compatible provider
        </span>
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4 pt-3 border-t border-border"
      >
        <span className="font-mono text-sm font-semibold text-primary-dark">{current.label}</span>
        <span className="text-foreground/80 text-sm"> — {current.job}</span>
      </motion.div>

      <p className="text-[11px] text-text-secondary mt-3 leading-relaxed">
        Roles also support <strong className="text-foreground/80">fallback chains</strong> (retry the
        next provider on a rate-limit) and <strong className="text-foreground/80">path-scoped
        overrides</strong> (a cheaper model in <code className="font-mono">tests/</code>, a stronger
        one in <code className="font-mono">src/core/</code>).
      </p>
    </div>
  )
}
