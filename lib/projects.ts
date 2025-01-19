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
    technologies: ['Flask', 'SQL', 'Docker', 'Kubernetes', 'Python', 'HTML/CSS/JS'],
    githubLink: 'https://github.com/ClusterberrySquirrels/NutritionTracker',
    // demoLink: 'https://demo-ecommerce.example.com'
  },
  {
    id: 'project2',
    title: 'Wordle Solver',
    summary: 'Automated trading system using machine learning',
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
    title: 'Placeholder',
    summary: 'Placeholder',
    description: `
      Placeholder

    `,
    technologies: [''],
    githubLink: 'https://github.com/nlaratta'
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