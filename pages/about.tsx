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

const experiences = [
  {
    role: 'Founder & Engineer',
    org: 'Laratta Labs',
    period: '2026 – Present',
    location: 'Denver, CO',
    bullets: [
      'Run a solo, AI-native software practice — full-stack web and mobile apps, the cloud infrastructure and data pipelines behind them, and AI systems and agents, scoped and shipped to production end to end.',
      'Designed, built, and shipped SquadUp (a social fitness platform, live on the App Store) and YardPaint (a consumer AI app).',
    ],
  },
  {
    role: 'Full Stack Engineer',
    org: 'PSIA-AASI',
    period: 'Aug 2025 – Present',
    location: 'Remote',
    bullets: [
      'Building a Progressive Web App with offline-first capability for on-the-mountain assessment of members pursuing skiing and snowboarding instructor certifications — fully usable without connectivity and syncing when back online.',
      'Full-stack ownership across the offline data model, local storage and sync, and the field-facing interface examiners use on-slope.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'Lockheed Martin',
    period: 'Aug 2022 – Aug 2024',
    location: 'Littleton, CO',
    bullets: [
      'Deployed and managed an internal Kubernetes cluster utilizing Rancher on AWS GovCloud EC2 instances, creating a scalable environment for Docker containerized applications.',
      'Monitored cluster health using Grafana and Longhorn, responding to incidents with prompt troubleshooting and resolution.',
      'Took ownership of software and SQL database deployments, becoming the go-to resource for deployment issues and developing new Helm charts.',
      'Implemented user-configurable data filtering in a C# Unity app, enabling users to customize visual outputs.',
      'Enhanced GitLab CI/CD pipelines by automating Helm chart linting and deployment, improving consistency and efficiency.',
      'Deployed and managed Keycloak for role-based access control on a Python application.',
      'Modified and deployed Dockerfiles eliminating vulnerabilities detected by SAST scans, ensuring security compliance.',
      'Deployed Docker and Kubernetes (k3s) within air-gapped Red Hat Linux environments using VirtualBox and KVM.',
      'Authored Linux scripts and documentation for software installation, dependency management, and cluster configuration in restricted networks.',
      'Thrived in a small Agile team, starting as the sole junior engineer and mentoring multiple new hires.',
    ],
  },
]

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

          <motion.p variants={fadeUp} className="text-text-secondary leading-relaxed mt-4">
            Today I run{' '}
            <a
              href="https://larattalabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-primary-dark transition-colors duration-200"
            >
              Laratta Labs
            </a>
            , an AI-native software practice in Denver — designing, building, and
            shipping full-stack products end to end — alongside full-stack
            engineering for PSIA-AASI.
          </motion.p>
        </motion.div>

        {/* Skills — Tag Layout */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
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
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Experience</h2>
            <div className="w-10 h-0.5 bg-primary mt-2" />
          </motion.div>

          <div className="space-y-8">
            {experiences.map((exp) => (
              <motion.div
                key={`${exp.org}-${exp.role}`}
                variants={fadeUp}
                className="border-l-2 border-border pl-6 ml-2 relative"
              >
                <div className="absolute left-[-7px] top-0 w-3 h-3 rounded-full bg-primary" />
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                    <span className="text-sm text-text-secondary">at {exp.org}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    {exp.period} &middot; {exp.location}
                  </p>
                  <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
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
          whileInView="animate"
          viewport={{ once: true }}
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
