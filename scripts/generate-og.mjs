// Build-time Open Graph image generator.
// Renders a sage-branded 1200x630 card per route into public/og/<key>.png using
// satori (layout -> SVG, text vectorized) + @resvg/resvg-js (SVG -> PNG).
// Runs as part of `npm run build` (before `next build` so the PNGs get exported).
import fs from 'node:fs'
import path from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import matter from 'gray-matter'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'public/og')
const FONT_DIR = path.join(ROOT, 'node_modules/@fontsource/inter/files')

// Brand palette (matches tailwind.config.ts)
const SAGE = '#2D6A4F'
const SAGE_LIGHT = '#52B788'
const BG = '#FAFAF8'
const INK = '#1A1A1A'
const MUTED = '#6B7280'

const font = (file, weight) => ({
  name: 'Inter',
  data: fs.readFileSync(path.join(FONT_DIR, file)),
  weight,
  style: 'normal',
})
const fonts = [
  font('inter-latin-400-normal.woff', 400),
  font('inter-latin-600-normal.woff', 600),
  font('inter-latin-700-normal.woff', 700),
]

// Avatar (optional)
let avatar = null
try {
  const buf = fs.readFileSync(path.join(ROOT, 'public/me.jpg'))
  avatar = `data:image/jpeg;base64,${buf.toString('base64')}`
} catch {
  /* no avatar — card still renders */
}

// Minimal hyperscript producing the {type, props} shape satori consumes.
const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
})

function card({ eyebrow, title, subtitle }) {
  const titleSize = title.length > 26 ? 60 : 78
  return h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        backgroundColor: BG,
        color: INK,
        fontFamily: 'Inter',
        position: 'relative',
      },
    },
    // left brand bar
    h('div', {
      style: {
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '14px',
        backgroundColor: SAGE,
        display: 'flex',
      },
    }),
    // eyebrow
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: '26px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: SAGE,
        },
      },
      eyebrow,
    ),
    // title + subtitle
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        { style: { display: 'flex', fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.08, color: INK } },
        title,
      ),
      subtitle
        ? h(
            'div',
            { style: { display: 'flex', fontSize: '30px', color: MUTED, marginTop: '24px', lineHeight: 1.3 } },
            subtitle,
          )
        : null,
    ),
    // footer: avatar + name
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
      avatar
        ? h('img', { src: avatar, width: 76, height: 76, style: { borderRadius: '38px', border: `3px solid ${SAGE_LIGHT}` } })
        : null,
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column' } },
        h('div', { style: { display: 'flex', fontSize: '30px', fontWeight: 600, color: INK } }, 'Noah Laratta'),
        h('div', { style: { display: 'flex', fontSize: '22px', color: MUTED } }, 'Software engineer · Laratta Labs'),
      ),
    ),
  )
}

async function render(key, spec) {
  const svg = await satori(card(spec), { width: 1200, height: 630, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  fs.writeFileSync(path.join(OUT_DIR, `${key}.png`), png)
  console.log(`  og: ${key}.png`)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const routes = {
    home: { eyebrow: 'noahlaratta.com', title: 'Noah Laratta', subtitle: 'Software engineer & founder of Laratta Labs — full-stack, cloud & AI.' },
    about: { eyebrow: 'About', title: 'Noah Laratta', subtitle: 'Software engineer in Denver. Laratta Labs · PSIA-AASI · Lockheed Martin.' },
    projects: { eyebrow: 'Projects', title: 'Things I’ve built', subtitle: 'Full-stack apps, cloud infrastructure, and AI systems.' },
    lab: { eyebrow: 'Lab', title: 'The Lab', subtitle: 'Research, experiments & development-workflow write-ups.' },
  }

  // Per-article cards from content/lab/*.mdx
  const labDir = path.join(ROOT, 'content/lab')
  if (fs.existsSync(labDir)) {
    for (const file of fs.readdirSync(labDir).filter((f) => f.endsWith('.mdx'))) {
      const slug = file.replace(/\.mdx$/, '')
      const { data } = matter(fs.readFileSync(path.join(labDir, file), 'utf8'))
      routes[`lab-${slug}`] = {
        eyebrow: `Lab · ${data.date ?? ''}`.trim(),
        title: data.title ?? slug,
        subtitle: data.summary ?? '',
      }
    }
  }

  console.log(`Generating ${Object.keys(routes).length} OG images…`)
  for (const [key, spec] of Object.entries(routes)) {
    await render(key, spec)
  }
  console.log('OG images done.')
}

main().catch((err) => {
  console.error('OG generation failed:', err)
  process.exit(1)
})
