import { motion } from 'framer-motion'
import Link from 'next/link'
import Layout from '../components/Layout'
import VerdigrisDepthsGame from '../components/VerdigrisDepthsGame'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function VerdigrisDepthsPage() {
  return (
    <Layout
      title="Verdigris Depths | Noah Laratta"
      description="A handcrafted browser roguelite RPG built to run as a static-exported subpath on Noah Laratta's personal site."
      mainClassName="flex-grow w-full px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeUp}
          className="relative overflow-hidden rounded-[36px] border border-emerald-200/40 bg-[linear-gradient(135deg,rgba(216,243,220,0.95),rgba(250,250,248,0.9)_40%,rgba(255,237,213,0.9))] px-6 py-8 shadow-[0_30px_100px_rgba(27,67,50,0.12)] sm:px-8 sm:py-10"
        >
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-primary-dark">
              New Lab Build
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Verdigris Depths
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              A stylish browser roguelite built directly into the static site. Clear each chamber,
              stack relics, survive five floors, and keep pushing the run.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Static-export friendly
              </span>
              <span className="rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700">
                Keyboard + mobile controls
              </span>
              <Link
                href="/lab"
                className="rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary/30 hover:bg-white"
              >
                Back to Lab
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section initial="initial" animate="animate" variants={fadeUp} className="mt-8">
          <VerdigrisDepthsGame />
        </motion.section>
      </div>
    </Layout>
  )
}
