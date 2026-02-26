import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import { getAllProjects, Project } from '../lib/projects'
import { getAllLabEntries } from '../lib/lab'

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

export default function Home() {
  const allProjects = getAllProjects()
  const featuredLab = getAllLabEntries()[0]
  const featuredProjects = [
    allProjects.find(p => p.id === 'project9'), // SquadUp
    allProjects.find(p => p.id === 'project6'), // Database Analytics Dashboard
    allProjects.find(p => p.id === 'project1'), // Nutrition Tracker
  ].filter((project): project is Project => project !== undefined)

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
          className="py-24 md:py-32 flex flex-col items-center text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-3xl"
          >
            Hi, I&apos;m{' '}
            <span className="font-serif text-primary">Noah</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed"
          >
            Software engineer building scalable solutions with full-stack development, cloud architecture, and DevOps.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/projects"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="inline-block border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              About Me
            </Link>
          </motion.div>
        </motion.section>

        {/* Featured Projects — Bento Grid */}
        <section className="py-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Featured Projects
              </h2>
              <div className="w-12 h-0.5 bg-primary mt-3" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  className={`border border-border bg-surface rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-200 ${
                    i === 0 ? 'md:col-span-2 md:row-span-2 bg-primary-lighter/20' : ''
                  }`}
                >
                  <div className={i === 0 ? 'flex flex-col h-full justify-between' : ''}>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {project.title}
                      </h3>
                      <p className="text-text-secondary mb-4 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, i === 0 ? 5 : 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 rounded-md bg-primary-lighter text-primary-dark"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200"
                          >
                            View Code &rarr;
                          </a>
                        )}
                        {project.demoLink && (
                          <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200"
                          >
                            Website &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Link
                href="/projects"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
              >
                View All Projects
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Latest from the Lab — Green Border Callout */}
        <section className="py-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Latest from the Lab
              </h2>
              <div className="w-12 h-0.5 bg-primary mt-3" />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-text-secondary mb-8 max-w-2xl"
            >
              Research, learning explorations, and development workflows
              worth sharing.
            </motion.p>

            {featuredLab && (
              <motion.div
                variants={fadeUp}
                className="border border-border bg-surface rounded-xl p-6 max-w-lg border-l-4 border-l-primary hover:shadow-sm transition-all duration-200"
              >
                <span className="text-xs text-text-secondary uppercase tracking-wider">
                  {featuredLab.date}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2">
                  {featuredLab.title}
                </h3>
                <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                  {featuredLab.summary}
                </p>

                {featuredLab.highlights && (
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-primary-lighter/30 rounded-lg p-4">
                    {featuredLab.highlights.map((h) => (
                      <div key={h.label}>
                        <span className="text-xl font-bold text-primary">
                          {h.value}
                        </span>
                        <span className="block text-xs text-text-secondary uppercase">
                          {h.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredLab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-lighter text-primary-dark text-xs px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {featuredLab.demoLink && (
                  <a
                    href={featuredLab.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200"
                  >
                    View Dashboard &rarr;
                  </a>
                )}
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/lab"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
              >
                View the Lab
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </Layout>
  )
}
