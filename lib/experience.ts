export interface Experience {
  role: string
  org: string
  orgUrl?: string
  start: string
  end: string
  location: string
  /** One line for the home page. */
  summary: string
  bullets: string[]
}

export const experiences: Experience[] = [
  {
    role: 'Founder & Engineer',
    org: 'Laratta Labs',
    orgUrl: 'https://larattalabs.com',
    start: '2026',
    end: 'Present',
    location: 'Denver, CO',
    summary: 'My AI-native software studio. SquadUp and YardPaint are built and shipped here.',
    bullets: [
      'Run a solo, AI-native software practice: full-stack web and mobile apps, the cloud infrastructure and data pipelines behind them, and AI systems and agents, scoped and shipped to production end to end.',
      'Designed, built, and shipped SquadUp (a social fitness platform, live on the App Store) and YardPaint (a consumer AI app).',
    ],
  },
  {
    role: 'Full Stack Engineer',
    org: 'PSIA-AASI',
    start: 'Aug 2025',
    end: 'Present',
    location: 'Lakewood, CO',
    summary: 'Angular and .NET for the national ski and snowboard instructors association, including an offline-first assessment app.',
    bullets: [
      'Built an offline-first Progressive Web App (Angular) for on-the-mountain assessment of members pursuing skiing and snowboarding instructor certifications — fully usable without connectivity at altitude, syncing to the backend when back online.',
      'Designed and shipped a member event self-cancellation and refund service end to end (Angular + .NET), with tiered refunds based on days until the event, integrated with the in-house association management system (AMS).',
      'Raised the member-portal and admin frontends to >90% test coverage, then gated deployments on those suites in Azure Pipelines with automated test-result comments on pull requests.',
      'Stood up Claude Code–powered automated PR-review pipelines for the .NET backend and Angular frontends.',
      'Refactored and reworked the monolithic backend billing service for maintainability and correctness.',
      'Shipped a steady stream of security hardening, performance improvements, and bug fixes across the member and admin experiences — improving accounting accuracy and business automation.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'Lockheed Martin',
    start: 'Aug 2022',
    end: 'Aug 2024',
    location: 'Littleton, CO',
    summary: 'Kubernetes on AWS GovCloud, Helm and CI/CD, and air-gapped deployments.',
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
