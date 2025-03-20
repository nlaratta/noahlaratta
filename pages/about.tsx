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
              I&apos;m a software engineer experienced in building scalable, efficient solutions
              to complex problems. With a bachelor&apos;s degree in Computer Science and years of hands-on
              experience, I&apos;ve developed a deep understanding of software architecture, cloud
              computing, and modern DevOps practices.
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
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-sage mb-3">Cloud & DevOps</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Docker & Kubernetes</li>
                <li>AWS</li>
                <li>CI/CD Pipelines (GitLab, GitHub Actions)</li>
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
                <strong  className="text-xl font-semibold text-sage mb-3">Software Engineer</strong>, Littleton, CO
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    Deployed and managed an internal Kubernetes cluster utilizing Rancher on AWS GovCloud EC2 instances, creating a robust, scalable environment for Docker containerized applications used by our team.
                  </li>
                  <li>
                    Monitored cluster health and performance using Grafana and Longhorn, responding to incidents with prompt troubleshooting and resolution.
                  </li>
                  <li>
                    Took ownership of software and SQL database deployments to the cluster, becoming the go-to resource for resolving deployment issues, implementing updates, and developing new HELM charts.
                  </li>
                  <li>
                    Implemented user-configurable data filtering in a C# Unity app, enabling users to customize visual outputs based on selected preferences.
                  </li>
                  <li>
                    Enhanced multi-step GitLab CI/CD pipelines by automating Helm chart linting and deployment, improving deployment consistency and efficiency.
                  </li>
                  <li>
                    Deployed, configured, and managed a Keycloak instance and realm to enforce role-based access control for a Python application.
                  </li>
                  <li>
                    Modified, built and deployed internal and open source Dockerfiles, eliminating vulnerabilities detected by SAST scans, thus ensuring security compliance.
                  </li>
                  <li>
                    Deployed Docker and Kubernetes (k3s) within air-gapped Red Hat Linux environments, leveraging VirtualBox and KVM virtualization platforms to support development and testing.
                  </li>
                  <li>
                    Authored Linux scripts and Confluence documentation covering software installation, dependency management, and cluster configuration, ensuring seamless containerized application deployments in restricted network conditions.
                  </li>
                  <li>
                    Thrived in a small Agile team setting, starting as the sole junior engineer on our IRAD team and mentoring multiple new hires to integrate seamlessly and accelerate their learning curve.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </motion.div>


        {/* <motion.div
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
        </motion.div> */}

        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interests & Hobbies</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 leading-relaxed">
              In my spare time, I enjoy exploring new technologies, tinkering with side projects, and finding new creative outlets to explore.
              Beyond the screen, I love spending time with my family and friends, and when summer arrives,
              I head outdoors to hike scenic trails and tend to my garden.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
} 