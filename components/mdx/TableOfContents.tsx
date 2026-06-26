import { useEffect, useState } from 'react'

interface Item {
  id: string
  text: string
  level: number
}

/**
 * Client-side TOC with scroll-spy. Reads headings straight from the rendered
 * article (ids come from rehype-slug), so anchors always match. Active section
 * is computed from scroll position (robust to fast scrolls). Renders nothing
 * server-side / with JS off — it's a navigation aid, not content.
 */
export default function TableOfContents() {
  const [items, setItems] = useState<Item[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        '.markdown-content h2[id], .markdown-content h3[id]',
      ),
    )
    setItems(
      nodes.map((n) => ({
        id: n.id,
        // headings render as <span>text</span><a>#</a> — read the span, not the anchor
        text: (n.firstElementChild?.textContent ?? n.textContent ?? '').replace(/#$/, '').trim(),
        level: n.tagName === 'H3' ? 3 : 2,
      })),
    )
    if (nodes.length === 0) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const offset = 120
        let current = nodes[0].id
        for (const n of nodes) {
          if (n.getBoundingClientRect().top <= offset) current = n.id
          else break
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <span className="block text-xs uppercase tracking-wider text-text-secondary mb-3">
        On this page
      </span>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? 'pl-6' : 'pl-3'}>
            <a
              href={`#${it.id}`}
              className={`block -ml-px border-l-2 pl-3 py-0.5 leading-snug transition-colors ${
                active === it.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-text-secondary hover:text-foreground'
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
