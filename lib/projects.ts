export interface Project {
  id: string
  title: string
  summary: string
  description: string
  technologies: string[]
  githubLink?: string
  demoLink?: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'project1',
    title: 'E-commerce Platform',
    summary: 'A modern e-commerce platform built with Next.js and AWS',
    description: `
      A full-featured e-commerce platform that demonstrates modern web development practices.
      Built with Next.js for the frontend and AWS services for the backend infrastructure.
      Features include user authentication, product catalog, shopping cart, and order management.
      
      Key achievements:
      • Implemented serverless architecture using AWS Lambda and DynamoDB
      • Integrated Stripe for secure payment processing
      • Built responsive UI with Tailwind CSS
      • Achieved 95+ Lighthouse score for performance and accessibility
    `,
    technologies: ['Next.js', 'TypeScript', 'AWS', 'DynamoDB', 'Stripe', 'Tailwind CSS'],
    githubLink: 'https://github.com/yourusername/ecommerce-platform',
    demoLink: 'https://demo-ecommerce.example.com'
  },
  {
    id: 'project2',
    title: 'AI Trading Bot',
    summary: 'Automated trading system using machine learning',
    description: `
      An automated trading system that uses machine learning algorithms to analyze market data
      and make trading decisions. Built with Python and various ML libraries.
      
      Key features:
      • Real-time market data processing
      • Multiple ML models for price prediction
      • Risk management system
      • Performance analytics dashboard
    `,
    technologies: ['Python', 'TensorFlow', 'Pandas', 'Docker', 'PostgreSQL'],
    githubLink: 'https://github.com/yourusername/ai-trading-bot'
  },
  {
    id: 'project3',
    title: 'DevOps Pipeline',
    summary: 'Automated CI/CD pipeline for microservices',
    description: `
      A comprehensive CI/CD pipeline for deploying microservices to Kubernetes.
      Includes automated testing, security scanning, and deployment strategies.
      
      Features:
      • Automated testing and code quality checks
      • Container security scanning
      • Blue-green deployment support
      • Monitoring and alerting setup
    `,
    technologies: ['Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'Prometheus'],
    githubLink: 'https://github.com/yourusername/devops-pipeline',
    demoLink: 'https://pipeline-demo.example.com'
  }
]

export const getAllProjects = () => projects

export const getProjectById = (id: string) => projects.find(project => project.id === id)

export const getProjectsByTechnology = (tech: string) => 
  projects.filter(project => project.technologies.includes(tech))

export const getAllTechnologies = () => {
  const technologies = new Set<string>()
  projects.forEach(project => {
    project.technologies.forEach(tech => technologies.add(tech))
  })
  return Array.from(technologies).sort()
} 