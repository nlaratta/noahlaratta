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