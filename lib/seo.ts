/**
 * Central SEO config + JSON-LD builders. Single source of truth for the site's
 * canonical URLs, identity, and structured data. Canonical host is the apex
 * (no trailing slash). Schema builders return graph nodes WITHOUT `@context`;
 * `Layout` wraps an array of them in one `{ "@context", "@graph" }` script.
 */

export const SITE_URL = 'https://noahlaratta.com'
export const SITE_NAME = 'Noah Laratta'
export const AUTHOR = 'Noah Laratta'
export const JOB_TITLE = 'Software Engineer'
export const EMAIL = 'noahlaratta@gmail.com'
export const TWITTER_HANDLE = '' // none set; twitter:site is omitted when empty

export const DEFAULT_DESCRIPTION =
  'Noah Laratta — software engineer and founder of Laratta Labs in Denver, building full-stack apps, cloud infrastructure, and AI systems.'

export const SAME_AS = [
  'https://github.com/nlaratta',
  'https://www.linkedin.com/in/noah-laratta',
  'https://larattalabs.com',
]

export const DEFAULT_OG = '/og/home.png'
export const LABS_URL = 'https://larattalabs.com'

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

/** Absolute apex URL for a path. Root → bare domain (no trailing slash). */
export const absUrl = (path = '/'): string => {
  if (!path || path === '/') return SITE_URL
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`)
}

export type JsonLd = Record<string, unknown>

export const personNode = (): JsonLd => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: AUTHOR,
  url: SITE_URL,
  image: absUrl('/me.jpg'),
  jobTitle: JOB_TITLE,
  description:
    'Software engineer and founder of Laratta Labs, an AI-native software studio in Denver. Builds full-stack web and mobile apps, cloud infrastructure, and AI systems end to end.',
  email: `mailto:${EMAIL}`,
  sameAs: SAME_AS,
  worksFor: { '@type': 'Organization', name: 'Laratta Labs', url: LABS_URL },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Metropolitan State University of Denver',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Denver',
    addressRegion: 'CO',
    addressCountry: 'US',
  },
  knowsAbout: [
    'Full-stack web development',
    'Cloud infrastructure',
    'AI systems and agents',
    'TypeScript',
    'C#/.NET',
    'Kubernetes',
    'PostgreSQL',
  ],
})

export const websiteNode = (): JsonLd => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
})

export const organizationNode = (): JsonLd => ({
  '@type': 'Organization',
  '@id': `${LABS_URL}/#org`,
  name: 'Laratta Labs',
  url: LABS_URL,
  description: 'AI-native software studio in Denver.',
  founder: { '@id': PERSON_ID },
})

export const profilePageNode = (path: string): JsonLd => ({
  '@type': 'ProfilePage',
  url: absUrl(path),
  mainEntity: { '@id': PERSON_ID },
})

export const breadcrumbNode = (items: { name: string; path: string }[]): JsonLd => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absUrl(it.path),
  })),
})

export const itemListNode = (
  name: string,
  items: { name: string; path?: string; url?: string }[],
): JsonLd => ({
  '@type': 'ItemList',
  name,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    ...(it.url ? { url: it.url } : it.path ? { url: absUrl(it.path) } : {}),
  })),
})

export interface ArticleMeta {
  title: string
  description: string
  slug: string
  published: string // ISO date
  modified?: string
  image: string // absolute or root-relative
  tags?: string[]
}

export const blogPostingNode = (a: ArticleMeta): JsonLd => {
  const url = absUrl(`/lab/${a.slug}`)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: a.title,
    description: a.description,
    image: a.image.startsWith('http') ? a.image : absUrl(a.image),
    datePublished: a.published,
    dateModified: a.modified || a.published,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: url,
    url,
    ...(a.tags && a.tags.length ? { keywords: a.tags.join(', ') } : {}),
  }
}
