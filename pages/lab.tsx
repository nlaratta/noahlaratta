import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { getAllLabEntries, LabEntry, LabCategory } from '../lib/lab'

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const categoryBadge: Record<LabCategory, { bg: string; label: string }> = {
  research: { bg: 'bg-primary-lighter text-primary-dark', label: 'Research' },
  learning: { bg: 'bg-blue-100 text-blue-800', label: 'Learning' },
  workflow: { bg: 'bg-amber-100 text-amber-800', label: 'Workflow' },
}

function LabCard({ entry }: { entry: LabEntry }) {
  const badge = categoryBadge[entry.category]

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.01 }}
      className="border border-border bg-surface rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.bg}`}>
          {badge.label}
        </span>
        <span className="text-xs text-text-secondary uppercase tracking-wider">
          {entry.date}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">
        {entry.title}
      </h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        {entry.summary}
      </p>

      {entry.highlights && (
        <div className="grid grid-cols-2 gap-3 mb-4 bg-primary-lighter/30 rounded-lg p-4">
          {entry.highlights.map((h) => (
            <div key={h.label}>
              <span className="text-xl font-bold text-primary">{h.value}</span>
              <span className="block text-xs text-text-secondary uppercase">
                {h.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary-lighter text-primary-dark text-xs px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {entry.demoLink && (
        <a
          href={entry.demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200"
        >
          View Dashboard &rarr;
        </a>
      )}
    </motion.div>
  )
}

export default function Lab() {
  const entries = getAllLabEntries()

  return (
    <Layout title="Lab | Noah Laratta">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Lab
            </h1>
            <div className="w-12 h-0.5 bg-primary mt-3" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-text-secondary mb-10 max-w-2xl leading-relaxed"
          >
            Research, learning explorations, and development workflows &mdash;
            experiments and tools that don&apos;t fit neatly into a project box.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {entries.map((entry) => (
            <LabCard key={entry.id} entry={entry} />
          ))}
        </motion.div>
      </div>
    </Layout>
  )
}
