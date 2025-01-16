import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-sage">Software Engineer</span>
            <br />
            Building Scalable Solutions with Precision
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Hi, I&apos;m Noah Laratta. I&apos;m a software engineer passionate about creating efficient, 
            scalable solutions and sharing knowledge through technical writing. 
            I specialize in full-stack development, cloud architecture, and building 
            high-performance applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/projects"
                className="inline-block bg-sage text-white px-8 py-3 rounded-lg font-medium hover:bg-sage-dark transition-colors duration-300"
              >
                View My Projects
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-sage border-2 border-sage px-8 py-3 rounded-lg font-medium hover:bg-sage hover:text-white transition-colors duration-300"
              >
                Download Resume
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-sage-light/10 to-transparent -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-sage-light/10 to-transparent -z-10" />
      </div>
    </Layout>
  )
} 