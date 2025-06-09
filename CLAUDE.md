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
3. **Modifying Styles**: Use Tailwind utility classes or update theme in `tailwind.config.ts`
4. **Testing Changes**: No automated tests configured - manual testing required

## Deployment Notes

- Configured for static export - run `npm run build` to generate static files
- Output directory: `.next/` contains build artifacts
- No environment variables required for basic functionality
- Email functionality (nodemailer) would require server-side implementation