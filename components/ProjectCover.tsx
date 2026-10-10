/* eslint-disable @next/next/no-img-element -- static export: no image optimizer */
import { getAllProjects, type Project } from '../lib/projects'
import Contours from './Contours'

/** The visual header of a project: phones on a panel, a screenshot, or contours. */
export default function ProjectCover({
  project,
  size = 'card',
}: {
  project: Project
  size?: 'card' | 'feature' | 'hero'
}) {
  const { cover } = project
  const height = size === 'hero' ? 'h-[300px] sm:h-[420px]' : size === 'feature' ? 'h-[260px] sm:h-[340px]' : 'h-[200px]'

  if (cover.kind === 'phones') {
    const phoneW = size === 'card' ? 'w-[110px]' : size === 'hero' ? 'w-[150px] sm:w-[230px]' : 'w-[140px] sm:w-[170px]'
    return (
      <div className={`relative flex ${height} items-start justify-center gap-4 overflow-hidden px-6 pt-8`} style={{ background: cover.background }}>
        {cover.images.slice(0, size === 'card' ? 2 : 3).map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading={size === 'hero' ? 'eager' : 'lazy'}
            className={`${phoneW} rounded-t-[18px] shadow-2xl ${i === 1 ? 'mt-6' : ''} ${i === 2 ? 'hidden sm:block' : ''}`}
          />
        ))}
      </div>
    )
  }

  if (cover.kind === 'image') {
    return (
      <div className={`relative ${height} overflow-hidden`} style={{ background: cover.background ?? 'var(--sand)' }}>
        <img
          src={cover.src}
          alt={cover.alt}
          loading={size === 'hero' ? 'eager' : 'lazy'}
          className="h-full w-full object-cover"
          style={{ objectPosition: cover.position ?? 'center' }}
        />
      </div>
    )
  }

  // No screenshot: this project's own crop of the site's topography.
  const contourProjects = getAllProjects().filter((p) => p.cover.kind === 'contour')
  const variant = [1, 6, 11, 16, 3, 9, 14, 19][contourProjects.findIndex((p) => p.slug === project.slug) % 8]
  return (
    <div className={`relative ${height} overflow-hidden bg-sand`}>
      <Contours
        className="absolute inset-0 h-full w-full"
        variant={variant}
        summit
      />
    </div>
  )
}
