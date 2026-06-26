import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { motion } from 'framer-motion'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Layout from '../../components/Layout'
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

const categoryBadge: Record<string, string> = {
  research: 'bg-primary-lighter text-primary-dark',
  learning: 'bg-blue-100 text-blue-800',
  workflow: 'bg-amber-100 text-amber-800',
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
      <article className="min-w-0">
        <motion.header initial="initial" animate="animate" variants={fadeUp} className="mb-2">
          <Link
            href="/lab"
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            &larr; Lab
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-5 mb-3">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                categoryBadge[fm.category] ?? categoryBadge.workflow
              }`}
            >
              {fm.category}
            </span>
            <span className="text-xs text-text-secondary uppercase tracking-wider">{fm.date}</span>
            {fm.readingTime && (
              <span className="text-xs text-text-secondary">· {fm.readingTime}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {fm.title}
          </h1>
          <div className="w-12 h-0.5 bg-primary mt-4" />
          <p className="text-text-secondary mt-5 max-w-2xl leading-relaxed">{fm.summary}</p>
          {fm.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {fm.tags.map((t) => (
                <span
                  key={t}
                  className="bg-primary-lighter text-primary-dark text-xs px-2 py-1 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </motion.header>
      </article>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-10 mt-10">
        <article className="markdown-content min-w-0">
          <MDXRemote {...source} components={mdxComponents} />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <TableOfContents />
          </div>
        </aside>
      </div>
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
