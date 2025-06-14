import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import { getAllProjects, Project } from '../lib/projects'
// import Image from 'next/image'

export default function Home() {
  const allProjects = getAllProjects()
  const featuredProjects = [
    allProjects.find(p => p.id === 'project9'), // SquadUp
    allProjects.find(p => p.id === 'project6'), // Database Analytics Dashboard
    allProjects.find(p => p.id === 'project1'), // Nutrition Tracker
  ].filter((project): project is Project => project !== undefined)

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-sage hover:text-sage-dark transition-colors duration-300">Software Engineer</span>
                <br />
                Building Scalable Solutions with Precision
              </h1>

              <p className="text-lg md:text-xl text-gray-600 hover:text-gray-800 mb-8 leading-relaxed transition-colors duration-300">
                Hi, I&apos;m Noah Laratta. I&apos;m a software engineer experienced in creating efficient, 
                scalable solutions. I specialize in full-stack development, cloud architecture, and implementing DevOps 
                principles to streamline development and deployment processes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/projects"
                    className="inline-block bg-sage text-white px-10 py-4 text-lg rounded-lg font-semibold hover:bg-sage-dark hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    View My Projects
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/about"
                    className="inline-block bg-white text-sage border-2 border-sage px-10 py-4 text-lg rounded-lg font-semibold hover:bg-sage hover:text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    About Me
                  </Link>
                </motion.div>
              </div>
            </div>
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="relative w-[280px] h-[280px] md:w-[520px] md:h-[520px] rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/logo.png"
                  alt="Noah Laratta"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  className="hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Featured Projects Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Featured <span className="text-sage">Projects</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-sage mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {project.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-sm px-2 py-1 rounded bg-sage/10 text-sage"
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
                          className="text-sage hover:text-sage-dark font-medium"
                        >
                          View Code →
                        </a>
                      )}
                      {project.demoLink && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sage hover:text-sage-dark font-medium"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/projects"
                className="inline-block bg-sage text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-dark transition-colors duration-300"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
} 