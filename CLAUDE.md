# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production (creates static export)
npm run start    # Start production server
npm run lint     # Run ESLint for code quality checks
```

## Key Architecture Decisions

### Static Site Generation
This is a statically exported Next.js site (`output: 'export'` in next.config.ts). This means:
- No server-side rendering or API routes
- All pages are pre-rendered at build time
- Suitable for static hosting (GitHub Pages, Netlify, etc.)

### Project Structure
- **Pages Router**: Uses Next.js pages directory (not app router)
- **Component Organization**: Reusable components in `/components`, page components in `/pages`
- **Data Management**: Project data stored in `/lib/projects.ts` as TypeScript objects

### Styling Architecture
- **Tailwind CSS**: Primary styling solution with custom sage color palette
- **Custom Theme**: Extended in `tailwind.config.ts` with:
  - Sage color scale (50-900) for brand consistency
  - Custom gradient utilities
  - Typography and Forms plugins

### TypeScript Configuration
- Strict mode enabled for type safety
- Path alias `@/*` configured for clean imports
- All components use proper TypeScript interfaces

## Important Implementation Details

### Layout Component
The `Layout.tsx` component wraps all pages and includes:
- SEO metadata configuration
- Consistent navigation and footer
- Social media links (GitHub, LinkedIn, Email)

### Project Data Structure
Projects in `lib/projects.ts` follow this interface:
```typescript
interface Project {
  title: string
  description: string
  technologies: string[]
  github?: string
  live?: string
  image?: string
}
```

### Animation Patterns
Uses Framer Motion for page transitions and hover effects. Standard animation pattern:
- Fade in with slight upward motion on page load
- Smooth transitions between pages
- Hover effects on interactive elements

## Development Workflow

1. **Adding New Pages**: Create file in `/pages` directory (automatically creates route)
2. **Adding Projects**: Update the projects array in `/lib/projects.ts`
3. **Adding Lab Articles (MDX)**: Write `content/lab/<slug>.mdx` with frontmatter (`title, summary, date, tags, category, readingTime`), then add a matching `LabEntry` with `article: true` to `/lib/lab.ts`. The `/lab` card then links to `/lab/<slug>`, rendered by `pages/lab/[slug].tsx` via `next-mdx-remote` (`remark-gfm`, `rehype-slug`, `rehype-highlight`). Prose uses the `.markdown-content` class; reusable + interactive components live in `components/mdx/` and `components/lab/<topic>/` and are exposed to MDX through `components/mdx/MDXComponents.tsx` (so you can drop `<Callout>`, custom widgets, etc. straight into the `.mdx`). Keep interactive components' browser APIs behind `useEffect` so static export stays clean.
4. **Modifying Styles**: Use Tailwind utility classes or update theme in `tailwind.config.ts`
5. **Testing Changes**: No automated tests configured - manual testing required

## SEO & Metadata

Centralized in `lib/seo.ts` (canonical host = apex `https://noahlaratta.com`, identity, JSON-LD builders). `components/Layout.tsx` takes SEO props (`path`, `description`, `ogImage`, `ogType`, `article`, `jsonLd`, `noindex`) and emits canonical + Open Graph + Twitter + robots + theme-color + one `ld+json` `@graph`; each page passes its own data and structured data. `<html lang>` is set in `pages/_document.tsx`.

Generated at build time (wired into `npm run build`):
- **OG images** — `scripts/generate-og.mjs` (satori → PNG) renders a sage-branded 1200×630 card per route into `public/og/` (gitignored). `npm run og` to preview locally.
- **sitemap.xml + feed.xml (RSS)** — `scripts/seo-postbuild.mjs` writes both into `out/` from the static routes + `content/lab/*.mdx`.
- **robots.txt + llms.txt** ship static from `public/`.

Adding a page to SEO: pass `path`/`description`/`ogImage`/`jsonLd` to `Layout`, add an OG route key in `generate-og.mjs`, and a route in `seo-postbuild.mjs`. Lab articles are automatic (derived from MDX frontmatter incl. `published: YYYY-MM-DD`).

Note: the host serves apex, `www`, and `http` with no redirect — canonical tags point at the apex; a `www→apex` + `http→https` 301 should be configured at the 1&1 hosting level.

## Deployment Notes

- Configured for static export - run `npm run build` to generate static files
- Output directory: `.next/` contains build artifacts
- No environment variables required for basic functionality
- Email functionality (nodemailer) would require server-side implementation