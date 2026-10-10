import { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import {
  absUrl,
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG,
  TWITTER_HANDLE,
  JsonLd,
} from '../lib/seo'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
  /** Route path for canonical + og:url, e.g. "/about" */
  path?: string
  /** Root-relative or absolute OG image (1200x630) */
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  article?: { publishedTime?: string; modifiedTime?: string; tags?: string[] }
  /** schema.org graph nodes (without @context); emitted as one ld+json @graph */
  jsonLd?: JsonLd[]
  noindex?: boolean
}

export default function Layout({
  children,
  title = 'Noah Laratta | Software Engineer',
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = DEFAULT_OG,
  ogType = 'website',
  article,
  jsonLd,
  noindex = false,
}: LayoutProps) {
  const canonical = absUrl(path)
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : absUrl(ogImage)
  const graph = jsonLd && jsonLd.length ? { '@context': 'https://schema.org', '@graph': jsonLd } : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-foreground">
        Skip to content
      </a>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FAFAF8" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0E1713" />
        <meta name="author" content={SITE_NAME} />

        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        {ogType === 'article' && article?.publishedTime && (
          <meta property="article:published_time" content={article.publishedTime} />
        )}
        {ogType === 'article' && article?.modifiedTime && (
          <meta property="article:modified_time" content={article.modifiedTime} />
        )}
        {ogType === 'article' &&
          article?.tags?.map((t) => <meta property="article:tag" content={t} key={t} />)}
        {ogType === 'article' && <meta property="article:author" content={SITE_URL} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
        {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}

        {/* Icons + feed */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/favicon-32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" type="application/rss+xml" title="Noah Laratta — Lab" href="/feed.xml" />

        {graph && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
          />
        )}
      </Head>

      <Navbar />

      <main id="main" className="flex-grow">{children}</main>

      <Footer />
    </div>
  )
}
