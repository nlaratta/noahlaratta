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
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => router.pathname === path

  return (
    <Disclosure as="nav" className="bg-white shadow-lg">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-sage hover:text-sage-dark transform hover:scale-105 transition-all duration-300">
                  Noah Laratta
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'text-sage border-b-2 border-sage'
                        : 'text-gray-600 hover:text-sage hover:border-b-2 hover:border-sage'
                    } transition-all duration-300 py-1`}
                  >
                    {item.name}
                  </Link>
                ))}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-sage hover:bg-sage-dark px-4 py-2 rounded shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Resume
                </motion.a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Disclosure.Button className="text-gray-600 hover:text-sage transform hover:scale-110 transition-all duration-300">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-2 pt-2 pb-3 space-y-1"
            >
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'text-sage bg-sage-light/10'
                      : 'text-gray-600 hover:text-sage hover:bg-sage-light/10'
                  } block px-3 py-2 rounded-md text-base transform hover:translate-x-2 transition-all duration-300`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base text-white bg-sage hover:bg-sage-dark shadow-md hover:shadow-lg transition-all duration-300"
              >
                Resume
              </motion.a>
            </motion.div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
} 