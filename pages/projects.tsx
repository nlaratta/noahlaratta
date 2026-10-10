import { useState } from 'react'
import Layout from '../components/Layout'
import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import { CATEGORIES, Category, getAllProjects } from '../lib/projects'
import { breadcrumbNode, itemListNode, absUrl } from '../lib/seo'

export default function Projects() {
  const projects = getAllProjects()
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const shown = filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))

  const count = (c: Category) => projects.filter((p) => p.categories.includes(c)).length

  const jsonLd = [
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
    ]),
    {
      '@type': 'CollectionPage',
      url: absUrl('/projects'),
      name: 'Projects — Noah Laratta',
      description: 'Software projects by Noah Laratta.',
    },
    itemListNode(
      'Projects by Noah Laratta',
      projects.map((p) => ({ name: p.title, path: `/projects/${p.slug}` })),
    ),
  ]

  return (
    <Layout
      title="Projects | Noah Laratta"
      description="Projects by Noah Laratta: apps shipped through Laratta Labs like SquadUp and YardPaint, open-source AI tools, infrastructure, data work and games."
      path="/projects"
      ogImage="/og/projects.png"
      jsonLd={jsonLd}
    >
      <Container className="pt-16 pb-24 sm:pt-24">
        <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Projects</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
          Products shipped through Laratta Labs, open-source tools, and the side projects I learned on, newest
          first.
        </p>

        <div role="group" aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2">
          {(['All', ...CATEGORIES] as const).map((c) => {
            const active = filter === c
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-border text-text-secondary hover:border-primary hover:text-foreground'
                }`}
              >
                {c}
                <span className={`ml-2 font-mono text-xs ${active ? 'opacity-80' : 'text-text-secondary'}`}>
                  {c === 'All' ? projects.length : count(c)}
                </span>
              </button>
            )
          })}
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {shown.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      </Container>
    </Layout>
  )
}
