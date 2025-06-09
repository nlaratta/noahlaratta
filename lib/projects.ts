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
    title: 'Nutrition Tracker',
    summary: 'Flask app to track users meals and nutrition intake',
    description: `
      The Nutrition Tracker is a web application designed to help users monitor their daily meals and nutritional intake.

      **Key Features:**

      - **User Authentication:** Secure user registration and login functionality.
      - **Meal Logging:** Users can record their daily meals, including portion sizes.
      - **Nutrient Tracking:** The application calculates and displays the nutritional content of logged meals, focusing on macronutrients like proteins, carbohydrates, and fats.
      - **Progress Monitoring:** Users can view their dietary history to assess their nutrition trends over time.
      - **Responsive Design:** The interface is designed to be user-friendly and accessible across various devices. 
      - **Nutrition Data:** The application uses the USDA Food Composition Database to get the nutritional information for the foods.
    `,
    technologies: ['Flask', 'SQL', 'Docker', 'Kubernetes', 'Python', 'HTML/CSS', 'Travis CI'],
    githubLink: 'https://github.com/ClusterberrySquirrels/NutritionTracker',
    // demoLink: 'https://demo-ecommerce.example.com'
  },
  {
    id: 'project2',
    title: 'Wordle Solver',
    summary: 'Java-based application to solve Wordle puzzles',
    description: `
      The Wordle Solver is a Java-based application designed to solve both random and user-defined Wordle puzzles by making random guesses and eliminating possibilities that don't match the word's letter arrangement.

      **Key Features:**

      - **Puzzle Solving:** Automatically solves random or user-defined Wordle puzzles.
      - **Guess Elimination:** Chooses random guesses and eliminates possibilities that don't match the word's letter arrangement.
      - **Command-Line Interface:** Operates through a simple command-line interface for ease of use.
    `,
    technologies: ['Java'],
    githubLink: 'https://github.com/nlaratta/wordle-solver'
  },
  {
    id: 'project3',
    title: 'Personal Website',
    summary: 'Personal website built with Next.js and Tailwind CSS',
    description: `
      The Personal Website is a Next.js and Tailwind CSS-based website built to showcase my projects and resume, integrating
      GitHub Actions for automated FTP deployments to my web host.

      **Key Features:**

      - **CI/CD:** Automated build and deployment pipeline using GitHub Actions.
      - **Projects:** A projects section to showcase my side projects.
      - **About:** An about section to showcase my skills and experience.
      - **Contact:** A contact section to showcase my contact information.
    `,
    technologies: ['Next.js', 'HTML/CSS', 'React', 'TypeScript', 'Tailwind CSS'],
    githubLink: 'https://github.com/nlaratta/noahlaratta'
  },
  {
    id: 'project4',
    title: 'Study Guide Generator',
    summary: 'AI-powered web app that creates personalized study guides',
    description: `
      An intelligent web application that generates personalized study guides for any subject using OpenAI GPT-4. 
      The application creates comprehensive learning paths tailored to your current knowledge level, available time, 
      and preferred learning style.

      **Key Features:**

      - **AI-Powered Generation:** Uses OpenAI GPT-4 to create custom study plans based on user input.
      - **Six-Step Learning Framework:** Knowledge assessment, learning path design, resource curation, practice framework, progress tracking, and schedule generation.
      - **Personalization:** Tailors content based on knowledge level, time availability, and learning style.
      - **Interactive Components:** Clickable elements with detailed explanations for each learning component.
      - **Responsive Design:** Works seamlessly across all devices with a modern UI.
      - **Real-time Progress Tracking:** Monitor your learning journey with built-in tracking features.
    `,
    technologies: ['Flask', 'Python', 'JavaScript', 'HTML/CSS', 'TailwindCSS', 'OpenAI API'],
    githubLink: 'https://github.com/nlaratta/study-guide-generator'
  },
  {
    id: 'project5',
    title: 'Crypto Trading Bot',
    summary: 'Automated trading bot using technical analysis indicators',
    description: `
      A swing trading bot that attempts to capitalize on short-term reversal events in cryptocurrency markets 
      using the MACD (Moving Average Convergence Divergence) technical indicator. Built with Python and integrated 
      with the KuCoin exchange API.

      **Key Features:**

      - **Technical Analysis:** Implements MACD indicator for buy/sell signal generation.
      - **Automated Trading:** Executes trades automatically based on predefined strategy rules.
      - **Risk Management:** Includes profit-taking and stop-loss mechanisms (0.4% profit target, 2% stop-loss).
      - **Exchange Integration:** Full integration with KuCoin API for live trading.
      - **Configurable Parameters:** Easy configuration of trading pairs, fees, and capital allocation.
      - **Cross-Platform:** Runs on both Windows and Linux environments.
    `,
    technologies: ['Python', 'KuCoin API', 'Technical Analysis', 'Trading Algorithms'],
    githubLink: 'https://github.com/nlaratta/indicator-bot'
  },
  {
    id: 'project6',
    title: 'Database Analytics Dashboard',
    summary: 'PostgreSQL database with Tableau visualizations for movie data',
    description: `
      A data analytics project focused on exploring and visualizing movie data from the Open Media Database (OMDB). 
      Combines PostgreSQL for data storage and querying with Tableau for creating interactive dashboards and 
      visualizations.

      **Key Features:**

      - **Database Design:** PostgreSQL database setup with optimized schema for movie data.
      - **Data Analysis:** Complex SQL queries for extracting insights from movie metadata.
      - **Interactive Dashboards:** Multiple Tableau visualizations including movie counts, ratings, and trends.
      - **ETL Pipeline:** Data extraction and loading from OMDB into PostgreSQL.
      - **Visual Analytics:** Professional dashboards showcasing data storytelling capabilities.
      - **Local Development:** Complete local setup for database and visualization development.
    `,
    technologies: ['PostgreSQL', 'SQL', 'Tableau', 'Data Analysis', 'PLpgSQL'],
    githubLink: 'https://github.com/nlaratta/db-tinkering'
  },
  {
    id: 'project7',
    title: 'Oasis - Kubernetes Cluster',
    summary: 'Distributed systems project with Raspberry Pi cluster and Kubernetes',
    description: `
      A collaborative distributed systems project that implements a Kubernetes cluster using Raspberry Pi devices. 
      The project demonstrates container orchestration, cluster management, and distributed application deployment 
      with a Rust-based web application backend.

      **Key Features:**

      - **Kubernetes Orchestration:** Full k3s Kubernetes setup across multiple Raspberry Pi nodes.
      - **Cluster Architecture:** Master-worker node configuration with load balancing.
      - **Container Management:** Docker containerization for application deployment.
      - **Rust Backend:** High-performance web application with PostgreSQL integration using Diesel ORM.
      - **User Authentication:** Complete user signup/login system with session management.
      - **Infrastructure as Code:** Automated cluster setup and configuration scripts.
    `,
    technologies: ['Kubernetes', 'Docker', 'Rust', 'PostgreSQL', 'Diesel ORM', 'Raspberry Pi', 'Linux'],
    githubLink: 'https://github.com/ClusterberrySquirrels/oasis'
  },
  {
    id: 'project8',
    title: 'Emoji Clicker Game',
    summary: 'Interactive JavaScript game with upgrade system',
    description: `
      A fun and addictive incremental game built with vanilla JavaScript where players click emojis to earn points 
      and purchase upgrades. Demonstrates frontend development skills and game design principles.

      **Key Features:**

      - **Interactive Gameplay:** Click mechanics with visual feedback and score tracking.
      - **Upgrade System:** Multiple upgrade tiers to increase point generation.
      - **Persistent Progress:** Local storage integration for saving game state.
      - **Responsive Design:** Works on both desktop and mobile devices.
      - **Clean Code Architecture:** Well-structured JavaScript with modular design.
      - **No Dependencies:** Built with pure JavaScript, HTML, and CSS.
    `,
    technologies: ['JavaScript', 'HTML/CSS', 'Game Development'],
    githubLink: 'https://github.com/nlaratta/emoji-clicker'
  },
  {
    id: 'project9',
    title: 'SquadUp',
    summary: 'Social fitness platform connecting gym-goers for workouts and community building',
    description: `
      SquadUp is a comprehensive social fitness platform that transforms how people find workout partners and build gym communities. 
      The platform features a native SwiftUI iOS app backed by a sophisticated GraphQL API built with Apollo Server, enabling 
      real-time connections between fitness enthusiasts at local gyms.

      **Technical Architecture:**

      - **GraphQL API:** Apollo Server 4 with 100+ queries/mutations, real-time subscriptions via WebSockets, and type-safe resolvers.
      - **Real-time Features:** Live session updates, instant messaging with typing indicators, and activity feed powered by Redis PubSub.
      - **Database Design:** PostgreSQL with Prisma ORM featuring 40+ models, optimized indexes, and complex relationships.
      - **Authentication:** Phone-based auth with SMS verification, JWT tokens, refresh tokens, and role-based access control.
      - **Payment System:** Credit-based economy with mock Stripe integration, connected accounts for host payouts, and transaction tracking.

      **Core Features:**

      - **Gym Session Marketplace:** Create/join workouts with real-time participant tracking, waitlists, and live status updates.
      - **Squad Social Network:** Connect with compatible workout partners based on fitness level, goals, and gym preferences.
      - **Elite Tier System:** 6-tier progression (Standard to Champion) with subscription benefits and achievement tracking.
      - **Smart Recommendations:** Location-based session discovery and AI-powered partner matching using compatibility scoring.
      - **Comprehensive Chat:** Session-based groups, direct messages, media sharing, and read receipts with WebSocket sync.
      - **Fitness Profiles:** Detailed profiles with certifications, workout history, reviews, and social media integration.
      - **Gamification:** Workout streaks, weekly progress tracking, badges, and leaderboards to drive engagement.
      - **Activity Feed:** Squad-based social feed with real-time updates on workouts, achievements, and connections.
    `,
    technologies: ['Swift', 'SwiftUI', 'Node.js', 'TypeScript', 'GraphQL', 'Apollo Server', 'PostgreSQL', 'Prisma ORM', 'Redis', 'WebSockets', 'JWT Auth', 'Sharp', 'Mock Services'],
    demoLink: 'https://www.supsquadup.com/'
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