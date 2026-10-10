import { ReactNode } from 'react'

/** Page-width wrapper shared by every section. */
export default function Container({
  children,
  className = '',
  narrow = false,
}: {
  children: ReactNode
  className?: string
  /** Reading width for prose-heavy pages. */
  narrow?: boolean
}) {
  return (
    <div className={`mx-auto w-full ${narrow ? 'max-w-3xl' : 'max-w-6xl'} px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  )
}
