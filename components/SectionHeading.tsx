import Link from 'next/link'
import { ReactNode } from 'react'

/**
 * Serif section title on a hairline rule, with an optional link at the far
 * end of the rule (e.g. "All projects").
 */
export default function SectionHeading({
  children,
  id,
  action,
  intro,
}: {
  children: ReactNode
  id?: string
  action?: { label: string; href: string }
  intro?: ReactNode
}) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-4">
        <h2 id={id} className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-[2.5rem]">
          {children}
        </h2>
        <span aria-hidden className="h-px flex-1 translate-y-[-0.4rem] bg-border" />
        {action && (
          <Link href={action.href} className="shrink-0 text-sm font-medium text-primary hover:text-primary-dark">
            {action.label}
          </Link>
        )}
      </div>
      {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">{intro}</p>}
    </div>
  )
}
