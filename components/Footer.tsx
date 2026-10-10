import Link from 'next/link'
import Container from './Container'

const links = [
  { name: 'GitHub', href: 'https://github.com/nlaratta' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/noah-laratta' },
  { name: 'Laratta Labs', href: 'https://larattalabs.com' },
  { name: 'RSS', href: '/feed.xml' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="font-serif text-lg font-semibold text-foreground hover:text-primary">
            Noah Laratta
          </Link>
          <p className="mt-1 text-sm text-text-secondary">
            Software engineer in Denver, Colorado.{' '}
            <a href="mailto:noahlaratta@gmail.com" className="underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary">
              noahlaratta@gmail.com
            </a>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((l) => (
            <li key={l.name}>
              <a
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-text-secondary hover:text-primary"
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  )
}
