import Link from 'next/link'
import Layout from '../components/Layout'
import Container from '../components/Container'
import Contours from '../components/Contours'
import { getAllLabEntries, LabEntry, LabCategory } from '../lib/lab'
import { breadcrumbNode, itemListNode, absUrl } from '../lib/seo'

const categoryLabel: Record<LabCategory, string> = {
  research: 'Research',
  learning: 'Learning',
  workflow: 'Workflow',
}

const entryHref = (e: LabEntry) => (e.article ? `/lab/${e.id}` : e.demoLink ?? '/lab')

function Entry({ entry, lead = false }: { entry: LabEntry; lead?: boolean }) {
  const href = entryHref(entry)
  const external = !entry.article
  const action = entry.article ? 'Read the guide' : entry.demoLink ? 'Open the dashboard' : null
  const LinkTag = external ? 'a' : Link

  return (
    <article className="grid gap-8 py-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <LinkTag href={href} className="group block">
          <p className="font-mono text-xs text-text-secondary">
            {categoryLabel[entry.category]}
            <span className="mx-2 text-border">/</span>
            {entry.date}
          </p>
          <h2
            className={`mt-3 font-serif font-semibold leading-tight tracking-tight text-foreground group-hover:text-primary ${
              lead ? 'text-4xl sm:text-5xl' : 'text-3xl'
            }`}
          >
            {entry.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">{entry.summary}</p>
          {action && (
            <span className="mt-5 inline-block font-medium text-primary underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">
              {action}
            </span>
          )}
        </LinkTag>
        <ul className="mt-6 flex flex-wrap gap-2">
          {entry.tags.map((t) => (
            <li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
              {t}
            </li>
          ))}
        </ul>
      </div>
      {entry.highlights && (
        <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-border bg-border lg:col-span-5">
          {entry.highlights.map((h) => (
            <div key={h.label} className="bg-surface p-5">
              <dt className="text-sm text-text-secondary">{h.label}</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold text-primary">{h.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}

export default function Lab() {
  const entries = getAllLabEntries()

  const labJsonLd = [
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Lab', path: '/lab' },
    ]),
    {
      '@type': 'Blog',
      '@id': `${absUrl('/lab')}#blog`,
      url: absUrl('/lab'),
      name: 'Lab — Noah Laratta',
      description: 'Research, learning explorations, and development workflows by Noah Laratta.',
    },
    itemListNode(
      'Lab entries',
      entries.map((e) => ({
        name: e.title,
        url: e.article ? absUrl(`/lab/${e.id}`) : e.demoLink ? absUrl(e.demoLink) : absUrl('/lab'),
      })),
    ),
  ]

  return (
    <Layout
      title="Lab | Noah Laratta"
      description="The Lab: research, learning explorations, and development workflows by Noah Laratta, including a deep, interactive guide to the Oh My Pi coding agent."
      path="/lab"
      ogImage="/og/lab.png"
      jsonLd={labJsonLd}
    >
      <section className="dark relative overflow-hidden bg-surface text-foreground">
        <Contours className="absolute inset-0 h-full w-full" variant={7} strength={0.7} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-surface from-30% via-surface/70 to-surface/20" />
        <Container className="relative py-20 sm:py-28">
          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Lab</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Write-ups on research, learning and development workflow: experiments and tools that don&apos;t fit
            neatly into a project.
          </p>
        </Container>
      </section>

      <Container className="pb-16">
        <div className="divide-y divide-border">
          {entries.map((e, i) => (
            <Entry key={e.id} entry={e} lead={i === 0} />
          ))}
        </div>
      </Container>
    </Layout>
  )
}
