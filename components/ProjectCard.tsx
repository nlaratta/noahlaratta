import Link from 'next/link'
import type { Project } from '../lib/projects'
import ProjectCover from './ProjectCover'

/** A project card that links to its page. `feature` is the large home-page variant. */
export default function ProjectCard({ project, feature = false }: { project: Project; feature?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary/50"
    >
      <ProjectCover project={project} size={feature ? 'feature' : 'card'} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={`font-serif font-semibold tracking-tight text-foreground group-hover:text-primary ${feature ? 'text-2xl' : 'text-xl'}`}>
            {project.title}
          </h3>
          {project.status === 'Live' && (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-gold">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-mark" />
              Live
            </span>
          )}
        </div>
        <p className="mt-2 leading-relaxed text-text-secondary">{project.summary}</p>
        <p className="mt-auto pt-5 font-mono text-xs text-text-secondary">
          <span className="text-foreground">{project.years}</span>
          <span className="mx-2 text-border">/</span>
          {project.stack.slice(0, feature ? 5 : 3).join(', ')}
        </p>
      </div>
    </Link>
  )
}
