import { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title = 'Noah Laratta | Software Engineer', description = 'Software Engineer Portfolio showcasing projects and technical blog posts' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-sage text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>© {new Date().getFullYear()} Noah Laratta</div>
          <div className="flex gap-4">
            <a href="https://github.com/nlaratta" target="_blank" rel="noopener noreferrer" className="hover:text-sage-light transition-colors duration-300">
              GitHub
            </a>
            <a href="https://linkedin.com/in/noah-laratta" target="_blank" rel="noopener noreferrer" className="hover:text-sage-light transition-colors duration-300">
              LinkedIn
            </a>
            <a href="mailto:noahlaratta@gmail.com" className="hover:text-sage-light transition-colors duration-300">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
} 