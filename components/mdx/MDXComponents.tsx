import { AnchorHTMLAttributes, HTMLAttributes } from 'react'
import type { MDXRemoteProps } from 'next-mdx-remote'
import CodeBlock from './CodeBlock'
import Callout from './Callout'
import TerminalHero from '../lab/omp/TerminalHero'
import FeatureExplorer from '../lab/omp/FeatureExplorer'
import ContextRamWidget from '../lab/omp/ContextRamWidget'
import ModelRolesDiagram from '../lab/omp/ModelRolesDiagram'
import StatCounters from '../lab/omp/StatCounters'
import ComparisonTable from '../lab/omp/ComparisonTable'

function heading(Tag: 'h2' | 'h3') {
  const Heading = ({ id, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <Tag id={id} {...props} className="group scroll-mt-28 flex items-center gap-2">
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-primary/40 hover:text-primary no-underline text-[0.7em] font-normal transition-opacity"
        >
          #
        </a>
      )}
    </Tag>
  )
  Heading.displayName = `MDX${Tag}`
  return Heading
}

function Anchor({ href = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:\/\//.test(href)
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
      {children}
    </a>
  )
}

const Table = (props: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto">
    <table {...props} />
  </div>
)

export const mdxComponents: MDXRemoteProps['components'] = {
  h2: heading('h2'),
  h3: heading('h3'),
  a: Anchor,
  pre: CodeBlock,
  table: Table,
  // custom + interactive components usable directly in the .mdx
  Callout,
  TerminalHero,
  FeatureExplorer,
  ContextRamWidget,
  ModelRolesDiagram,
  StatCounters,
  ComparisonTable,
}
