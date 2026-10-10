import Link from 'next/link'
import Layout from '../components/Layout'
import Container from '../components/Container'
import Contours from '../components/Contours'
import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'
import { getAllProjects, getFeaturedProjects } from '../lib/projects'
import { getAllLabEntries } from '../lib/lab'
import { experiences } from '../lib/experience'
import { websiteNode, personNode, organizationNode, profilePageNode } from '../lib/seo'

const MORE_WORK = ['architect', 'local-lab', 'claude-helpers']

export default function Home() {
  const featured = getFeaturedProjects()
  const more = MORE_WORK.map((slug) => getAllProjects().find((p) => p.slug === slug)!).filter(Boolean)
  const [latest, ...olderLab] = getAllLabEntries()

  return (
    <Layout path="/" ogImage="/og/home.png" jsonLd={[websiteNode(), personNode(), organizationNode(), profilePageNode('/')]}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <Contours animate className="absolute inset-y-0 right-0 h-full w-full sm:w-[72%]" />
        <div aria-hidden className="absolute inset-0 bg-background/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-background sm:from-30% sm:via-background/40 sm:via-55% sm:to-transparent" />
        <Container className="relative py-24 sm:py-32 lg:py-40">
          <h1 className="font-serif text-[3.25rem] font-semibold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[6.5rem]">
            Noah Laratta
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-text-secondary sm:text-[1.375rem]">
            I&apos;m a software engineer in Denver. I build full-stack apps, the cloud infrastructure behind
            them, and AI systems, and I run{' '}
            <a href="https://larattalabs.com" className="text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
              Laratta Labs
            </a>
            , my one-person software studio.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-md bg-primary px-6 py-3 font-medium text-on-primary transition-colors hover:bg-primary-dark dark:hover:bg-primary-light">
              See my projects
            </Link>
            <Link href="/lab" className="rounded-md border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:border-primary">
              Read the Lab
            </Link>
          </div>
          <p className="mt-12 flex items-start gap-3 text-[15px] text-text-secondary">
            <span aria-hidden className="relative mt-[7px] flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-[ping_1.2s_cubic-bezier(0,0,0.2,1)_3_forwards] rounded-full bg-gold-mark opacity-50 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-mark" />
            </span>
            <span>
              <span className="font-medium text-gold">Now</span> shipping YardPaint and SquadUp at Laratta Labs, and
              engineering for PSIA-AASI.
            </span>
          </p>
        </Container>
      </section>

      {/* Selected work */}
      <section className="py-20 sm:py-28" aria-labelledby="work">
        <Container>
          <SectionHeading id="work" action={{ label: 'All projects', href: '/projects' }}>
            Selected work
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} feature />
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* From the Lab: a dark band in both themes */}
      {latest && (
        <section className="dark bg-surface py-20 text-foreground sm:py-28" aria-labelledby="lab">
          <Container>
            <SectionHeading id="lab" action={{ label: 'Visit the Lab', href: '/lab' }}>
              From the Lab
            </SectionHeading>
            <div className="grid gap-12 lg:grid-cols-12">
              <Link href={latest.article ? `/lab/${latest.id}` : '/lab'} className="group lg:col-span-7">
                <p className="font-mono text-xs text-text-secondary">{latest.date}</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight group-hover:text-primary sm:text-4xl">
                  {latest.title}
                </h3>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">{latest.summary}</p>
                <span className="mt-6 inline-block font-medium text-primary underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">
                  Read the guide
                </span>
              </Link>
              {latest.highlights && (
                <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-border bg-border lg:col-span-5">
                  {latest.highlights.map((h) => (
                    <div key={h.label} className="bg-surface p-6">
                      <dt className="text-sm text-text-secondary">{h.label}</dt>
                      <dd className="mt-1 font-serif text-4xl font-semibold text-primary">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {olderLab.length > 0 && (
              <ul className="mt-14 divide-y divide-border border-t border-border">
                {olderLab.map((e) => (
                  <li key={e.id}>
                    <a
                      href={e.article ? `/lab/${e.id}` : e.demoLink ?? '/lab'}
                      className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8"
                    >
                      <span className="w-32 shrink-0 font-mono text-xs text-text-secondary">{e.date}</span>
                      <span className="font-medium group-hover:text-primary">{e.title}</span>
                      <span className="text-sm text-text-secondary sm:ml-auto sm:max-w-md sm:text-right">{e.summary}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>
      )}

      {/* Experience */}
      <section className="bg-sand py-20 sm:py-28" aria-labelledby="experience">
        <Container>
          <SectionHeading id="experience" action={{ label: 'More about me', href: '/about' }}>
            Where I&apos;ve worked
          </SectionHeading>
          <ol className="divide-y divide-border border-y border-border">
            {experiences.map((x) => (
              <li key={x.org} className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                <p className="font-mono text-sm text-text-secondary sm:col-span-3">
                  {x.start} – {x.end}
                </p>
                <div className="sm:col-span-9">
                  <p className="text-lg text-foreground">
                    <span className="font-medium">{x.role}</span>
                    <span className="text-text-secondary">, {x.org}</span>
                  </p>
                  <p className="mt-1 text-text-secondary">{x.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Contact */}
      <section className="py-20 sm:py-28" aria-labelledby="contact">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="contact" className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Hiring, or have something that needs building?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
              Email me and I&apos;ll get back to you. For client projects, Laratta Labs is the way to start: I scope
              every engagement myself, and the first call is free.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <a href="mailto:noahlaratta@gmail.com" className="rounded-md bg-primary px-6 py-3 font-medium text-on-primary transition-colors hover:bg-primary-dark dark:hover:bg-primary-light">
              Email me
            </a>
            <a href="https://larattalabs.com/contact" className="rounded-md border border-border px-6 py-3 font-medium text-foreground transition-colors hover:border-primary">
              Start a project
            </a>
          </div>
        </Container>
      </section>
    </Layout>
  )
}
