/* eslint-disable @next/next/no-img-element -- static export: no image optimizer */
import { useState } from 'react'

/** Drag (or arrow-key) a divider to compare two images of the same scene. */
export default function BeforeAfter({
  before,
  after,
  caption,
}: {
  before: { src: string; alt: string }
  after: { src: string; alt: string }
  caption?: string
}) {
  const [pos, setPos] = useState(50)

  return (
    <figure>
      <div className="relative aspect-[3/2] select-none overflow-hidden rounded-lg border border-border bg-sand">
        <img src={after.src} alt={after.alt} className="absolute inset-0 h-full w-full object-cover" />
        <img
          src={before.src}
          alt={before.alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <span className="pointer-events-none absolute top-3 left-3 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white">Before</span>
        <span className="pointer-events-none absolute top-3 right-3 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white">After</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-text-secondary">{caption}</figcaption>}
    </figure>
  )
}
