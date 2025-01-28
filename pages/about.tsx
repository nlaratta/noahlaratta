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
                <li>Java/C#</li>
                <li>SQL</li>
                <li>Scripting (Python, Bash)</li>
                <li>JavaScript/TypeScript (React, Node.js)</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-sage mb-3">Cloud & DevOps</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Docker & Kubernetes</li>
                <li>AWS (EC2, S3, Lambda)</li>
                <li>CI/CD Pipelines (GitLab, GitHub Actions)</li>
                <li>DevSecOps</li>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-2 text-gray-600">
              <strong  className="text-xl font-semibold text-sage mb-3">Metropolitan State University of Denver</strong> - <em>2021</em><br />
              <li>Bachelor of Science in Computer Science</li>
              <li>Minor in Mathematics</li>
            </ul>
          </div>
        </motion.div>


        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Work Experience</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-2 text-gray-600">
              <li>
                <strong  className="text-xl font-semibold text-sage mb-3">Lockheed Martin</strong> - <em>Aug. 2022 - August 2024</em><br />
                <strong  className="text-xl font-semibold text-sage mb-3">Software Engineer Asc.</strong>, Littleton, CO
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    Deployed and managed a Kubernetes cluster utilizing Rancher on AWS EC2 instances, orchestrating a robust and scalable environment for Docker containerized application deployment.
                  </li>
                  <li>
                    Spearheaded the development of HELM charts, facilitating the streamlined deployment of backend containers and integration of frontends across multiple projects.
                  </li>
                  <li>
                    Set up and managed PostgreSQL databases, schemas, and connections, supporting seamless data access and integration in applications.
                  </li>
                  <li>
                    Modified, built and deployed internal and open source Dockerfiles, eliminating vulnerabilities and increasing security.
                  </li>
                  <li>
                    Enhanced GitLab CI/CD multi-step pipelines by modifying testing and deployment stages, increasing security and deployment efficiency.
                  </li>
                  <li>
                    Collaborated in an Agile environment, contributing to the C# development, debugging and testing of a Unity app, ensuring timely and efficient project progression.
                  </li>
                  <li>
                    Built and modified bash and Python scripts to automate and streamline development processes.
                  </li>
                  <li>
                    Thrived in a small team setting, starting as the sole junior member of a team and coaching multiple new hires to integrate seamlessly and accelerate their learning curve.
                  </li>
                </ul>
              </li>
            </ul>
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
              <li>Agile methodology and project management</li>
              <li>Collaborative team player with experience mentoring junior developers</li>
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
              In my spare time, I enjoy exploring new technologies and tinkering with side projects.
              Beyond the screen, I love spending time with my family and friends, and when summer arrives,
              I head outdoors to hike scenic trails and tend to my garden.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
} 