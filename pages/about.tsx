import { motion } from 'framer-motion'
import Layout from '../components/Layout'

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

const skills = {
  'Languages': ['Java', 'C#', 'Python', 'SQL', 'Bash', 'TypeScript'],
  'Cloud & DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GitLab', 'GitHub Actions'],
  'Tools & Platforms': ['Rancher', 'Helm', 'Grafana', 'Keycloak', 'Unity'],
}

export default function About() {
  return (
    <Layout title="About Me | Noah Laratta">
      <div className="max-w-3xl mx-auto">
        {/* Intro */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mb-16"
        >
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About <span className="font-serif text-primary">Me</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-text-secondary leading-relaxed">
            I&apos;m a software engineer experienced in building scalable, efficient solutions
            to complex problems. With a bachelor&apos;s degree in Computer Science and years of hands-on
            experience, I&apos;ve developed a deep understanding of software architecture, cloud
            computing, and modern DevOps practices.
          </motion.p>
        </motion.div>

        {/* Skills — Tag Layout */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Technical Expertise</h2>
            <div className="w-10 h-0.5 bg-primary mt-2" />
          </motion.div>

          <div className="space-y-5">
            {Object.entries(skills).map(([category, items]) => (
              <motion.div key={category} variants={fadeUp}>
                <h3 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm px-3 py-1.5 rounded-lg bg-primary-lighter text-primary-dark font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Work Experience — Vertical Timeline */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Experience</h2>
            <div className="w-10 h-0.5 bg-primary mt-2" />
          </motion.div>

          <motion.div variants={fadeUp} className="border-l-2 border-border pl-6 ml-2 relative">
            {/* Green dot */}
            <div className="absolute left-[-7px] top-0 w-3 h-3 rounded-full bg-primary" />

            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mb-1">
                <h3 className="text-lg font-semibold text-foreground">Software Engineer</h3>
                <span className="text-sm text-text-secondary">at Lockheed Martin</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Aug 2022 &ndash; Aug 2024 &middot; Littleton, CO
              </p>
              <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
                <li>Deployed and managed an internal Kubernetes cluster utilizing Rancher on AWS GovCloud EC2 instances, creating a scalable environment for Docker containerized applications.</li>
                <li>Monitored cluster health using Grafana and Longhorn, responding to incidents with prompt troubleshooting and resolution.</li>
                <li>Took ownership of software and SQL database deployments, becoming the go-to resource for deployment issues and developing new Helm charts.</li>
                <li>Implemented user-configurable data filtering in a C# Unity app, enabling users to customize visual outputs.</li>
                <li>Enhanced GitLab CI/CD pipelines by automating Helm chart linting and deployment, improving consistency and efficiency.</li>
                <li>Deployed and managed Keycloak for role-based access control on a Python application.</li>
                <li>Modified and deployed Dockerfiles eliminating vulnerabilities detected by SAST scans, ensuring security compliance.</li>
                <li>Deployed Docker and Kubernetes (k3s) within air-gapped Red Hat Linux environments using VirtualBox and KVM.</li>
                <li>Authored Linux scripts and documentation for software installation, dependency management, and cluster configuration in restricted networks.</li>
                <li>Thrived in a small Agile team, starting as the sole junior engineer and mentoring multiple new hires.</li>
              </ul>
            </div>
          </motion.div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Education</h2>
            <div className="w-10 h-0.5 bg-primary mt-2" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="border border-border bg-surface rounded-xl p-6 border-l-4 border-l-primary"
          >
            <h3 className="text-lg font-semibold text-foreground">
              Metropolitan State University of Denver
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Bachelor of Science in Computer Science &middot; Minor in Mathematics &middot; 2021
            </p>
          </motion.div>
        </motion.section>

        {/* Interests */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Beyond the Screen</h2>
            <div className="w-10 h-0.5 bg-primary mt-2" />
          </motion.div>

          <motion.p variants={fadeUp} className="text-text-secondary leading-relaxed">
            In my spare time, I enjoy exploring new technologies, tinkering with side projects, and finding new creative outlets.
            Beyond the screen, I love spending time with family and friends, and when summer arrives,
            I head outdoors to hike scenic trails and tend to my garden.
          </motion.p>
        </motion.section>
      </div>
    </Layout>
  )
}
