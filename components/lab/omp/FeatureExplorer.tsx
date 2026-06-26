import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FEATURES, FACETS, FeatureFacet } from '../../../lib/omp-guide'

type Filter = FeatureFacet | 'all'

export default function FeatureExplorer() {
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const shown = FEATURES.filter((f) => filter === 'all' || f.facet === filter)
  const pills: { id: Filter; label: string }[] = [{ id: 'all', label: 'All' }, ...FACETS]

  return (
    <div className="not-prose my-8">
      <div className="flex flex-wrap gap-2 mb-5">
        {pills.map((p) => {
          const active = filter === p.id
          return (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-secondary border-border hover:border-primary/40'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {shown.map((f) => {
            const open = openId === f.id
            return (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`border rounded-xl bg-surface overflow-hidden transition-colors ${
                  open ? 'border-primary/40 shadow-sm' : 'border-border hover:border-primary/30'
                }`}
              >
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  aria-expanded={open}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-foreground">{f.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-primary-dark bg-primary-lighter px-1.5 py-0.5 rounded shrink-0">
                      {f.facet}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{f.tagline}</p>
                  <span className="text-[11px] text-primary mt-2 inline-block font-medium">
                    {open ? 'Hide −' : 'Details +'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 overflow-hidden"
                    >
                      <div className="pb-4 pt-1 space-y-2.5 border-t border-border">
                        <Detail label="What it is" body={f.what} />
                        <Detail label="When to reach for it" body={f.when} />
                        {f.impact && <Detail label="Why it matters" body={f.impact} />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function Detail({ label, body }: { label: string; body: string }) {
  return (
    <div className="pt-2.5">
      <span className="block text-[10px] uppercase tracking-wider text-text-secondary mb-0.5">
        {label}
      </span>
      <p className="text-[13px] text-foreground/80 leading-relaxed">{body}</p>
    </div>
  )
}
