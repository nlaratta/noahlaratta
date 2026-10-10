import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import TableOfContents from '../../components/mdx/TableOfContents'
import { mdxComponents } from '../../components/mdx/MDXComponents'
import { blogPostingNode, breadcrumbNode } from '../../lib/seo'

const CONTENT_DIR = path.join(process.cwd(), 'content/lab')

interface Frontmatter {
  title: string
  summary: string
  date: string
  tags: string[]
  category: 'research' | 'learning' | 'workflow'
  readingTime?: string
  published?: string
}

const MONTHS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
}

/** ISO date for an article: explicit `published` frontmatter, else parse "Month YYYY". */
function toIso(display?: string, explicit?: string): string {
  if (explicit && /^\d{4}-\d{2}-\d{2}/.test(explicit)) return explicit
  const m = /([A-Za-z]+)\s+(\d{4})/.exec(display ?? '')
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[2]}-${MONTHS[m[1].toLowerCase()]}-01`
  return '2026-01-01'
}


export default function LabArticle({
  source,
  frontmatter,
  slug,
  published,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const fm = frontmatter as Frontmatter
  const ogImage = `/og/lab-${slug}.png`
  return (
    <Layout
      title={`${fm.title} | Lab | Noah Laratta`}
      description={fm.summary}
      path={`/lab/${slug}`}
      ogImage={ogImage}
      ogType="article"
      article={{ publishedTime: published, modifiedTime: published, tags: fm.tags }}
      jsonLd={[
        blogPostingNode({
          title: fm.title,
          description: fm.summary,
          slug,
          published,
          image: ogImage,
          tags: fm.tags,
        }),
        breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'Lab', path: '/lab' },
          { name: fm.title, path: `/lab/${slug}` },
        ]),
      ]}
    >
      <Container className="pt-12 pb-24 sm:pt-16">
        <header className="max-w-3xl">
          <Link href="/lab" className="text-sm text-text-secondary hover:text-primary">
            <span aria-hidden>←</span> Lab
          </Link>
          <p className="mt-8 font-mono text-xs text-text-secondary">
            <span className="capitalize">{fm.category}</span>
            <span className="mx-2 text-border">/</span>
            {fm.date}
            {fm.readingTime && (
              <>
                <span className="mx-2 text-border">/</span>
                {fm.readingTime}
              </>
            )}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{fm.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-text-secondary">{fm.summary}</p>
          {fm.tags?.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {fm.tags.map((t) => (
                <li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="mt-12 border-t border-border pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
          <article className="markdown-content min-w-0">
            <MDXRemote {...source} components={mdxComponents} />
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </Container>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const files = fs.existsSync(CONTENT_DIR)
    ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
    : []
  return {
    paths: files.map((f) => ({ params: { slug: f.replace(/\.mdx$/, '') } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{
  source: MDXRemoteSerializeResult
  frontmatter: Frontmatter
  slug: string
  published: string
}> = async ({ params }) => {
  const slug = params?.slug as string
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8')
  const { content, data } = matter(raw)
  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeHighlight],
    },
  })
  // Ensure props are JSON-serializable (e.g. no Date objects from YAML).
  const frontmatter = JSON.parse(JSON.stringify(data)) as Frontmatter
  const published = toIso(frontmatter.date, frontmatter.published)
  return { props: { source, frontmatter, slug, published } }
}
