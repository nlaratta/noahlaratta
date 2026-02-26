import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { Project, getAllProjects, getAllTechnologies } from '../lib/projects'

function renderDescription(md: string): string {
  const bold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Split into blocks by blank lines
  return md
    .trim()
    .split(/\n\s*\n/)
    .map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length === 0) return ''

      // List block: every line starts with "- "
      if (lines.every(l => l.startsWith('- '))) {
        const items = lines.map(l => `<li>${bold(l.slice(2))}</li>`).join('')
        return `<ul>${items}</ul>`
      }

      // Paragraph block: join wrapped lines into one <p>
      return `<p>${bold(lines.join(' '))}</p>`
    })
    .join('')
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedTech, setSelectedTech] = useState<string[]>([])

  const projects = getAllProjects()
  const technologies = getAllTechnologies()

  const filteredProjects = selectedTech.length > 0
    ? projects.filter(project =>
        selectedTech.some(tech => project.technologies.includes(tech))
      )
    : projects

  const toggleTech = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    )
  }

  return (
    <Layout title="Projects | Noah Laratta">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Projects
            </h1>
            <div className="w-12 h-0.5 bg-primary mt-3" />
          </motion.div>

          {/* Technology filters */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedTech.includes(tech)
                      ? 'border border-primary bg-primary/10 text-primary'
                      : 'border border-border text-text-secondary hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-24rem)]">
          {/* Projects list */}
          <div className="relative">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="pb-6 space-y-3 max-h-[800px] overflow-y-auto scrollbar-thin pr-2"
            >
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedProject(project)}
                  className={`border bg-surface rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                    selectedProject?.id === project.id
                      ? 'border-l-2 border-l-primary border-border bg-primary/5'
                      : 'border-border hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  <h3 className="text-base font-semibold text-foreground mb-1.5">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded-md bg-primary-lighter text-primary-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Project details panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="border border-border bg-surface rounded-xl p-8"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">{selectedProject.title}</h2>
                  {/* Safe: descriptions are hardcoded in lib/projects.ts, no user input */}
                  <div
                    className="prose prose-sm max-w-none prose-p:text-text-secondary prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-text-secondary prose-li:leading-relaxed prose-ul:my-2"
                    dangerouslySetInnerHTML={{ __html: renderDescription(selectedProject.description) }}
                  />

                  <div className="flex flex-wrap gap-2 mt-6 mb-6">
                    {selectedProject.technologies.map(tech => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md bg-primary-lighter text-primary-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedProject.githubLink && (
                      <a
                        href={selectedProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {selectedProject.demoLink && (
                      <a
                        href={selectedProject.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Website
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-border bg-surface rounded-xl p-8 text-center"
                >
                  <p className="text-text-secondary text-sm">Select a project to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}
