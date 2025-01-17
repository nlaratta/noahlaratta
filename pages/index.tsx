import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <Layout>
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
              Hi, I&apos;m Noah Laratta. I&apos;m a software engineer passionate about creating efficient, 
              scalable solutions and sharing knowledge through technical writing. 
              I specialize in full-stack development, cloud architecture, and building 
              high-performance applications.
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
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-sage border-2 border-sage px-10 py-4 text-lg rounded-lg font-semibold hover:bg-sage hover:text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Download Resume
                </a>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative w-[280px] h-[280px] md:w-[520px] md:h-[520px] rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/me.jpg"
                alt="Noah Laratta"
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
} 