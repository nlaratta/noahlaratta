import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { Project, getAllProjects, getAllTechnologies } from '../lib/projects'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
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
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          My <span className="text-sage">Projects</span>
        </h1>

        {/* Technology filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter by Technology:</h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map(tech => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  selectedTech.includes(tech)
                    ? 'bg-sage text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-sage/10'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-24rem)]">
          {/* Projects list */}
          <div className="relative">
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 mr-2 scrollbar-thin scrollbar-thumb-sage scrollbar-track-transparent">
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  layoutId={`project-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  className={`p-6 rounded-lg shadow-md cursor-pointer transition-colors duration-300 ${
                    selectedProject?.id === project.id
                      ? 'bg-sage text-white'
                      : 'bg-white hover:bg-sage/5'
                  }`}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${
                    selectedProject?.id === project.id ? 'text-white' : 'text-sage'
                  }`}>
                    {project.title}
                  </h3>
                  <p className={`mb-4 ${
                    selectedProject?.id === project.id ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className={`text-sm px-2 py-1 rounded ${
                          selectedProject?.id === project.id
                            ? 'bg-white/20 text-white'
                            : 'bg-sage/10 text-sage'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Project details */}
          <div className="lg:sticky lg:top-4 h-fit">
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 rounded-lg shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-sage mb-4">{selectedProject.title}</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 whitespace-pre-line">{selectedProject.description}</p>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    {selectedProject.githubLink && (
                      <a
                        href={selectedProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                        </svg>
                        View on GitHub
                      </a>
                    )}
                    {selectedProject.demoLink && (
                      <a
                        href={selectedProject.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-sage text-white rounded hover:bg-sage-dark transition-colors duration-300"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-8 rounded-lg shadow-lg text-center"
                >
                  <p className="text-gray-600">Select a project to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
} 