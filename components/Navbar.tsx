import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ThemeToggle from './ThemeToggle'

const navigation = [
  { name: 'Projects', href: '/projects' },
  { name: 'Lab', href: '/lab' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Close the mobile menu after navigating.
  useEffect(() => {
    const close = () => setOpen(false)
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  }, [router.events])

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-foreground hover:text-primary">
          Noah Laratta
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`relative rounded-md px-3 py-2 text-[15px] transition-colors ${
                    isActive(item.href)
                      ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[2px] after:bg-primary'
                      : 'text-text-secondary hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-lighter hover:text-primary-dark sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              {open ? <path d="M6 18 18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-border px-5 py-2 sm:hidden">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`block py-3 text-lg ${isActive(item.href) ? 'font-medium text-primary' : 'text-foreground'}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
