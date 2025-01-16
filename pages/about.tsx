import { motion } from 'framer-motion'
import Layout from '../components/Layout'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function About() {
  return (
    <Layout title="About Me | Noah Laratta">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About <span className="text-sage">Me</span>
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-8">
              I&apos;m a software engineer with a passion for building scalable, efficient solutions 
              to complex problems. With a background in Computer Science and years of hands-on 
              experience, I&apos;ve developed a deep understanding of software architecture, cloud 
              computing, and modern development practices.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-sage mb-3">Languages & Frameworks</h3>
              <ul className="space-y-2 text-gray-600">
                <li>JavaScript/TypeScript (React, Node.js)</li>
                <li>Python (Django, Flask)</li>
                <li>Java/Kotlin</li>
                <li>SQL & NoSQL Databases</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-sage mb-3">Cloud & DevOps</h3>
              <ul className="space-y-2 text-gray-600">
                <li>AWS (EC2, S3, Lambda)</li>
                <li>Docker & Kubernetes</li>
                <li>CI/CD Pipelines</li>
                <li>Infrastructure as Code</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Soft Skills</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-2 text-gray-600">
              <li>Strong problem-solving and analytical abilities</li>
              <li>Excellent written and verbal communication</li>
              <li>Experience mentoring junior developers</li>
              <li>Agile methodology and project management</li>
              <li>Collaborative team player with leadership experience</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interests & Hobbies</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 leading-relaxed">
              Beyond coding, I&apos;m passionate about continuous learning and staying up-to-date with 
              the latest technology trends. I enjoy contributing to open-source projects, writing 
              technical blog posts, and participating in developer communities. In my free time, 
              I love exploring new technologies, reading tech blogs, and working on side projects 
              that challenge my skills and creativity.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
} 