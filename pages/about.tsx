/* eslint-disable @next/next/no-img-element -- static export: no image optimizer */
import Layout from '../components/Layout'
import Container from '../components/Container'
import Contours from '../components/Contours'
import SectionHeading from '../components/SectionHeading'
import { experiences } from '../lib/experience'
import { personNode, profilePageNode, breadcrumbNode } from '../lib/seo'

const skills: [string, string[]][] = [
  ['Languages', ['C#', 'TypeScript', 'Swift', 'Python', 'SQL', 'Java', 'Bash']],
  ['Frameworks & UI', ['Angular', '.NET', 'Next.js / React', 'SwiftUI']],
  ['Cloud & DevOps', ['Azure', 'AWS', 'Cloudflare', 'Docker', 'Kubernetes', 'Azure Pipelines', 'GitHub Actions']],
  ['Data & AI', ['PostgreSQL', 'MSSQL', 'Claude / LLMs', 'AI agents', 'MCP']],
  ['Tools & platforms', ['Helm', 'Grafana', 'Keycloak', 'Rancher']],
]

export default function About() {
  return (
    <Layout
      title="About | Noah Laratta"
      description="About Noah Laratta, software engineer and founder of Laratta Labs in Denver. Full-stack, cloud, and AI work across Laratta Labs, PSIA-AASI, and Lockheed Martin."
      path="/about"
      ogImage="/og/about.png"
      ogType="profile"
      jsonLd={[
        profilePageNode('/about'),
        personNode(),
        breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]),
      ]}
    >
      <Container className="grid gap-12 pt-16 pb-20 sm:pt-24 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">About</h1>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-text-secondary">
            <p>
              I&apos;m a software engineer in Denver. I like owning a product end to end: the app people use, the
              infrastructure it runs on, and more and more, the AI systems inside it.
            </p>
            <p>
              Today I run{' '}
              <a href="https://larattalabs.com" className="text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                Laratta Labs
              </a>
              , my AI-native software studio, alongside full-stack engineering for PSIA-AASI. Before that I spent two
              years at Lockheed Martin running Kubernetes in AWS GovCloud and air-gapped networks.
            </p>
            <p>
              Away from the keyboard I&apos;m usually out on a trail, working in my garden, or spending time with
              family and friends.
            </p>
          </div>
        </div>
        <div className="relative lg:col-span-4 lg:col-start-9">
          <Contours className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] sm:-inset-8 sm:h-[calc(100%+4rem)] sm:w-[calc(100%+4rem)]" variant={13} strength={0.8} />
          <img
            src="/noah.jpg"
            alt="Noah Laratta, smiling, in a white shirt and blue tie"
            width={776}
            height={862}
            className="relative aspect-[9/10] w-full max-w-sm rounded-lg border border-border object-cover"
          />
        </div>
      </Container>

      <section className="border-t border-border py-20" aria-labelledby="experience">
        <Container>
          <SectionHeading id="experience">Experience</SectionHeading>
          <ol className="divide-y divide-border">
            {experiences.map((x) => (
              <li key={x.org} className="grid gap-4 py-10 first:pt-0 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-4">
                  <p className="font-mono text-sm text-text-secondary">
                    {x.start} – {x.end}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight">{x.role}</h3>
                  <p className="mt-1 text-text-secondary">
                    {x.orgUrl ? (
                      <a href={x.orgUrl} className="text-foreground hover:text-primary">
                        {x.org}
                      </a>
                    ) : (
                      <span className="text-foreground">{x.org}</span>
                    )}
                    , {x.location}
                  </p>
                </div>
                <ul className="space-y-3 leading-relaxed text-text-secondary lg:col-span-8">
                  {x.bullets.map((b, i) => (
                    <li key={i} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-primary">
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-sand py-20" aria-labelledby="skills">
        <Container>
          <SectionHeading id="skills">What I work with</SectionHeading>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map(([group, items]) => (
              <div key={group}>
                <dt className="font-medium text-foreground">{group}</dt>
                <dd className="mt-2 leading-relaxed text-text-secondary">{items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20" aria-labelledby="education">
        <Container>
          <SectionHeading id="education">Education</SectionHeading>
          <div className="grid gap-2 sm:grid-cols-12">
            <p className="font-mono text-sm text-text-secondary sm:col-span-3">2021</p>
            <div className="sm:col-span-9">
              <p className="text-lg font-medium text-foreground">Metropolitan State University of Denver</p>
              <p className="mt-1 text-text-secondary">B.S. in Computer Science, minor in Mathematics</p>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  )
}
