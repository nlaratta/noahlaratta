// Generates a topographic contour field (deterministic) as SVG path data.
// A few gaussian "peaks" plus low-frequency ridges, then marching squares.
import { contours } from 'd3-contour'
import simplify from 'simplify-js'
import fs from 'node:fs'

const PAD = 12, W = 240 + 2 * PAD, H = 120 + 2 * PAD, SCALE = 5 // visible viewBox 1200 x 600
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

// Peaks weighted to the right half so the name on the left stays clean.
const peaks = [
  { x: 0.80, y: 0.40, h: 1.0, r: 0.10 },
  { x: 0.70, y: 0.62, h: 0.7, r: 0.07 },
  { x: 0.92, y: 0.78, h: 0.75, r: 0.09 },
  { x: 0.58, y: 0.22, h: 0.45, r: 0.08 },
  { x: 0.95, y: 0.12, h: 0.6, r: 0.07 },
  { x: 0.66, y: 0.95, h: 0.4, r: 0.08 },
  { x: 0.40, y: 0.85, h: 0.25, r: 0.09 },
  { x: 0.30, y: 0.15, h: 0.18, r: 0.10 },
]
const values = new Float64Array(W * H)
for (let j = 0; j < H; j++) {
  for (let i = 0; i < W; i++) {
    const x = (i - PAD) / 240, y = ((j - PAD) / 120) * 0.5
    let v = 0
    for (const p of peaks) {
      const dx = x - p.x, dy = y - p.y * 0.5
      v += p.h * Math.exp(-(dx * dx + dy * dy) / (2 * p.r * p.r))
    }
    v += 0.04 * Math.sin(x * 9 + y * 13) + 0.03 * Math.sin(x * 23 - y * 7)
    values[j * W + i] = v
  }
}
void rand

let lo = Infinity, hi = -Infinity
for (const v of values) { if (v < lo) lo = v; if (v > hi) hi = v }
const N = 20
const levels = Array.from({ length: N }, (_, k) => lo + (hi - lo) * (0.06 + 0.9 * (k / (N - 1)) ** 1.15))
const polys = contours().size([W, H]).thresholds(levels)(values)

const paths = []
for (const mp of polys) {
  for (const poly of mp.coordinates) {
    for (const ring of poly) {
      if (ring.length < 8) continue
      const pts = simplify(ring.map(([x, y]) => ({ x: (x - PAD) * SCALE, y: (y - PAD) * SCALE })), 1.2, true)
      // Smooth with a Catmull-Rom → cubic Bézier pass.
      const P = pts.map((p) => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10])
      let d = `M${P[0][0]} ${P[0][1]}`
      for (let k = 0; k < P.length - 1; k++) {
        const p0 = P[k - 1] || P[k], p1 = P[k], p2 = P[k + 1], p3 = P[k + 2] || p2
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += `C${c1.map((n) => n.toFixed(1)).join(' ')} ${c2.map((n) => n.toFixed(1)).join(' ')} ${p2[0]} ${p2[1]}`
      }
      paths.push({ level: (mp.value - lo) / (hi - lo), d })
    }
  }
}

const out = `// Generated topographic contour field (scripts/generate-contours.mjs); do not edit by hand.
// viewBox 0 0 1200 600. \`level\` is the contour's elevation, 0–1.
export const CONTOUR_PATHS: { level: number; d: string }[] = ${JSON.stringify(paths.map((p) => ({ level: +p.level.toFixed(2), d: p.d })))}
`
fs.writeFileSync(process.argv[2] ?? new URL("../lib/contours.ts", import.meta.url), out)
console.log(paths.length, 'paths', (out.length / 1024).toFixed(1), 'KB')
