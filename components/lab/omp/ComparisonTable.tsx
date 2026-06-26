import { COMPARISON } from '../../../lib/omp-guide'

export default function ComparisonTable() {
  return (
    <div className="not-prose my-8">
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-sm border-collapse min-w-[34rem]">
          <thead>
            <tr className="bg-background">
              <th className="text-left font-medium text-text-secondary px-4 py-3 w-1/4">Dimension</th>
              <th className="text-left font-semibold text-primary-dark px-4 py-3 bg-primary-lighter/40">
                Oh My Pi
              </th>
              <th className="text-left font-medium text-text-secondary px-4 py-3">Often elsewhere</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.dimension} className="border-t border-border hover:bg-background/60 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground align-top">{row.dimension}</td>
                <td className="px-4 py-3 text-foreground/80 align-top bg-primary-lighter/20">{row.omp}</td>
                <td className="px-4 py-3 text-text-secondary align-top">{row.others}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-text-secondary mt-2">
        A positioning snapshot as of mid-2026, not a scorecard — these tools move fast.
      </p>
    </div>
  )
}
