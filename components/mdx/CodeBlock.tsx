import { useRef, useState, ReactNode, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLPreElement> {
  children?: ReactNode
}

/**
 * `pre` replacement for MDX code blocks. rehype-highlight produces
 * <pre><code class="hljs language-x">…</code></pre>; we wrap it with a header
 * (language label + copy button) and read the rendered text for copy via a ref.
 */
export default function CodeBlock({ children, ...rest }: Props) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  // language from the child <code> className (e.g. "hljs language-bash")
  const childClass =
    (children as { props?: { className?: string } } | undefined)?.props?.className ?? ''
  const lang = /language-([\w-]+)/.exec(childClass)?.[1]

  const copy = async () => {
    const text = ref.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="not-prose group relative my-5 rounded-xl overflow-hidden border border-border bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[11px] font-mono text-gray-400 lowercase">{lang || 'code'}</span>
        <button
          onClick={copy}
          className="text-[11px] font-mono text-gray-400 hover:text-primary-light transition-colors"
          aria-label="Copy code"
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <pre
        ref={ref}
        {...rest}
        className="overflow-x-auto p-4 text-[13px] leading-relaxed text-gray-100"
      >
        {children}
      </pre>
    </div>
  )
}
