import { ReactNode } from 'react'

type CalloutType = 'note' | 'tip' | 'warning'

const styles: Record<CalloutType, { box: string; label: string; text: string }> = {
  note: { box: 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40', label: 'text-sky-800 dark:text-sky-300', text: 'Note' },
  tip: { box: 'border-primary/30 bg-primary-lighter/40', label: 'text-primary-dark', text: 'Tip' },
  warning: { box: 'border-gold-mark/40 bg-gold-mark/10', label: 'text-gold', text: 'Heads up' },
}

export default function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: ReactNode
}) {
  const s = styles[type]
  return (
    <div className={`not-prose my-5 rounded-xl border px-4 py-3.5 ${s.box}`}>
      <span className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${s.label}`}>
        {title || s.text}
      </span>
      <div className="text-sm text-foreground/80 leading-relaxed [&>p]:m-0 [&>p+p]:mt-2 [&_code]:font-mono [&_code]:text-primary-dark [&_code]:bg-surface/60 [&_code]:px-1 [&_code]:rounded-sm">
        {children}
      </div>
    </div>
  )
}
