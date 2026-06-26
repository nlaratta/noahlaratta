// Post-build: write out/sitemap.xml and out/feed.xml (RSS 2.0).
// Runs after `next build`. Routes = curated static pages + content/lab/*.mdx
// articles. Apex URLs, no trailing slashes. No extra deps (gray-matter is present).
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const SITE_URL = 'https://noahlaratta.com'
const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')
const LAB_DIR = path.join(ROOT, 'content/lab')

const MONTHS = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
}
const toIso = (display, explicit) => {
  if (explicit && /^\d{4}-\d{2}-\d{2}/.test(explicit)) return explicit
  const m = /([A-Za-z]+)\s+(\d{4})/.exec(display ?? '')
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[2]}-${MONTHS[m[1].toLowerCase()]}-01`
  return new Date().toISOString().slice(0, 10)
}
const xmlEscape = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

if (!fs.existsSync(OUT)) {
  console.error('seo-postbuild: out/ not found — run after `next build`.')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)

// Articles from MDX frontmatter
const articles = (fs.existsSync(LAB_DIR) ? fs.readdirSync(LAB_DIR) : [])
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const slug = f.replace(/\.mdx$/, '')
    const { data } = matter(fs.readFileSync(path.join(LAB_DIR, f), 'utf8'))
    return {
      slug,
      title: data.title ?? slug,
      summary: data.summary ?? '',
      published: toIso(data.date, data.published),
    }
  })
  .sort((a, b) => (a.published < b.published ? 1 : -1))

// ---- sitemap.xml ----
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'yearly' },
  { path: '/projects', priority: '0.9', changefreq: 'monthly' },
  { path: '/lab', priority: '0.9', changefreq: 'weekly' },
]
const urls = [
  ...staticPages.map((p) => ({ loc: SITE_URL + (p.path === '/' ? '' : p.path), lastmod: today, priority: p.priority, changefreq: p.changefreq })),
  ...articles.map((a) => ({ loc: `${SITE_URL}/lab/${a.slug}`, lastmod: a.published, priority: '0.8', changefreq: 'monthly' })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>\n`
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap)

// ---- feed.xml (RSS 2.0) ----
const items = articles
  .map(
    (a) => `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${SITE_URL}/lab/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/lab/${a.slug}</guid>
      <pubDate>${new Date(`${a.published}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${xmlEscape(a.summary)}</description>
    </item>`,
  )
  .join('\n')
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Noah Laratta — Lab</title>
    <link>${SITE_URL}/lab</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Research, learning explorations, and development-workflow write-ups by Noah Laratta.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>\n`
fs.writeFileSync(path.join(OUT, 'feed.xml'), feed)

console.log(`seo-postbuild: sitemap (${urls.length} urls) + feed (${articles.length} items) written to out/`)
