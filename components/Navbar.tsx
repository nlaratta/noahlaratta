import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Disclosure } from '@headlessui/react'

export default function Navbar() {
  const router = useRouter()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Lab', href: '/lab' },
  ]

  const isActive = (path: string) => router.pathname === path

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
      {({ open }) => (
        <>
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200">
                  Noah Laratta
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:text-foreground hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Disclosure.Button className="text-text-secondary hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden border-t border-border/50 bg-white/95 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 pt-2 pb-3 space-y-1"
            >
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-foreground hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </motion.div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
