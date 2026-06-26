/**
 * Typed data backing the interactive components in the "Getting the most out of
 * Oh My Pi" lab guide (content/lab/oh-my-pi.mdx). Keeping the data here lets the
 * components stay purely presentational.
 *
 * Facts verified against omp 16.1.20 (`omp --help`, `omp config list`) and the
 * local-first DeepSeek V4 Flash / ds4 setup measured on an M5 Max (June 2026).
 */

/* ----------------------------- Feature explorer ---------------------------- */

export type FeatureFacet =
  | 'editing'
  | 'navigation'
  | 'orchestration'
  | 'context'
  | 'memory'
  | 'extend'

export interface Feature {
  id: string
  name: string
  facet: FeatureFacet
  tagline: string
  what: string
  when: string
  impact?: string
}

export const FACETS: { id: FeatureFacet; label: string }[] = [
  { id: 'editing', label: 'Editing' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'orchestration', label: 'Orchestration' },
  { id: 'context', label: 'Context' },
  { id: 'memory', label: 'Memory' },
  { id: 'extend', label: 'Extensibility' },
]

export const FEATURES: Feature[] = [
  {
    id: 'hashline',
    name: 'Hashline edits',
    facet: 'editing',
    tagline: 'Edit by content-hash anchor, not line number',
    what: 'Files are read with a short content-hash tag on each line. The model edits by anchor, so if the file changed since it was read, the patch is rejected before it can corrupt anything — no line-number drift, no whitespace mangling.',
    when: 'Whitespace-sensitive code (Python, YAML), files reformatted between read and edit, or anything edited concurrently by you and the agent.',
    impact: 'omp reports a large jump in edit-success on tricky patches and meaningful output-token savings versus reproducing whole lines.',
  },
  {
    id: 'lsp',
    name: 'LSP refactors',
    facet: 'navigation',
    tagline: 'Semantic edits through the language server',
    what: "omp drives your project's language server and issues workspace-level operations — renames that propagate through imports and barrel files, organize-imports, diagnostics — instead of blind text replacement.",
    when: 'Cross-file renames, codebase-wide API changes, and letting diagnostics (unused vars, type errors) drive the fix. Disable with --no-lsp.',
    impact: 'Changes land correctly the first time instead of leaving broken references.',
  },
  {
    id: 'dap',
    name: 'DAP debugging',
    facet: 'navigation',
    tagline: 'The agent attaches a real debugger',
    what: 'Through the Debug Adapter Protocol, omp can attach lldb / dlv / debugpy and friends as first-class tools: set breakpoints, step, inspect stack frames, and evaluate expressions on a live process.',
    when: 'Race conditions, state corruption, and "what is this variable actually holding right now?" — instead of print-and-rerun.',
    impact: 'Reveals real runtime state rather than guesses.',
  },
  {
    id: 'subagents',
    name: 'Subagents & fanout',
    facet: 'orchestration',
    tagline: 'Parallel agents that coordinate over an IRC bus',
    what: 'The task tool spawns subagents in parallel, each with its own context and (optionally) its own git worktree. They coordinate over an in-process IRC bus and can return schema-validated JSON rather than prose to parse.',
    when: 'Independent parallel work (docs for five modules at once) and divide-and-conquer refactors across isolated worktrees with no merge conflicts.',
    impact: 'Wall-clock time collapses to the slowest single branch, not the sum.',
  },
  {
    id: 'plan-goal',
    name: 'Plan & goal mode',
    facet: 'orchestration',
    tagline: 'Sandboxed planning, then execute on approval',
    what: 'Plan mode runs a planning turn against a separate planner model (set with --plan), produces a plan you approve / edit / reject, then executes. Goal mode pins a long-running objective with a token budget and auto-compacts as it works.',
    when: 'Complex multi-step work that wants human sign-off before it touches code, and long objectives ("migrate the auth module") that outlive a single context window.',
  },
  {
    id: 'snapcompact',
    name: 'Snapcompact',
    facet: 'context',
    tagline: 'Compaction by rendering history into pixel-font images',
    what: 'When a session outgrows the window, snapcompact serializes the dropped half of the transcript into dense bitmap images using bundled pixel fonts and hands them back to the model to re-read — no summarization LLM call.',
    when: 'Long, multi-hour sessions where you want a verbatim recent tail and a cheap, instant, deterministic archive of the rest.',
    impact: 'Zero extra LLM cost and instant, versus summarization strategies that spend tokens.',
  },
  {
    id: 'memory',
    name: 'Persistent memory',
    facet: 'memory',
    tagline: 'Carry conventions and decisions across sessions',
    what: 'A local backend writes a rolling summary file; the Hindsight backend retains transcripts to a server and recalls them on session start, seeding a mental-models block (your preferences, project conventions, past decisions) into every prompt.',
    when: 'Multi-session and multi-day projects where prior context — naming, architecture, tradeoffs — should persist instead of being re-explained.',
  },
  {
    id: 'advisor',
    name: 'Advisor runtime',
    facet: 'orchestration',
    tagline: 'A second model reviews every turn',
    what: 'A passive reviewer running on its own model and context reads each turn the main agent takes and injects notes inline — a quiet aside, a concern, or a hard blocker. Enable with --advisor.',
    when: 'Code review during development, compliance/security checks, or mentoring where you want a second opinion catching what the main agent rushes past.',
  },
  {
    id: 'routing',
    name: 'Multi-model routing',
    facet: 'context',
    tagline: 'Roles, fallback chains, path-scoped models',
    what: 'Each role (default / smol / slow / plan) maps to a model. Fallback chains retry the next provider on rate-limit or error; path-scoped overrides use different models in different directories; multiple accounts round-robin.',
    when: 'Balancing cost vs quality (cheap model for reads, strong model for writes) and staying up when a provider rate-limits you.',
  },
  {
    id: 'browser',
    name: 'Browser & web search',
    facet: 'extend',
    tagline: 'Drive a real browser; search many providers',
    what: 'A Puppeteer-backed browser tool navigates, clicks, types, screenshots, and reads console logs; web search fans out across many providers and returns ranked results.',
    when: 'Scraping live docs, testing web flows end to end, researching a library before integrating it, or grabbing a screenshot to debug a frontend.',
  },
  {
    id: 'extensibility',
    name: 'Skills, extensions & hooks',
    facet: 'extend',
    tagline: 'Teach it your stack; add your own tools',
    what: 'Skills are static guidance packages. Extensions are TypeScript modules that register tools, slash commands, and lifecycle hooks via the same API the built-ins use. Hooks gate or log tool calls on the event bus.',
    when: 'Encoding your conventions, wiring up internal APIs/deploy tools, or blocking destructive commands before they run.',
  },
  {
    id: 'tiny-models',
    name: 'Tiny local models',
    facet: 'memory',
    tagline: 'Free, offline session titles & memory',
    what: 'Bundled quantized models run locally for lightweight chores — session titles, memory summaries, embeddings — without spending a call on your main provider.',
    when: 'Cost and privacy: keep routine metadata on-device and generate titles even with no network. Fetch them with `omp tiny-models download`.',
  },
]

/* ------------------------------- Model roles ------------------------------- */

export interface ModelRole {
  id: 'default' | 'smol' | 'slow' | 'plan'
  label: string
  job: string
  example: string
}

export const MODEL_ROLES: ModelRole[] = [
  { id: 'default', label: 'default', job: 'The main agent — writes, edits, and refactors.', example: 'a strong frontier model' },
  { id: 'smol', label: 'smol', job: 'Fast & cheap — reads, searches, session titles.', example: 'a small fast model' },
  { id: 'slow', label: 'slow', job: 'Thorough reasoning — debugging, review, architecture.', example: 'a deep reasoning model' },
  { id: 'plan', label: 'plan', job: 'The planner — drafts a plan for you to approve.', example: 'a cheap planner model' },
]

/* --------------------- Context window vs. memory (ds4) --------------------- */

export interface CtxRow {
  ctx: number
  label: string
  kvGb: number
  wiredGb: number
  freeGb: number
  thinkMax: boolean
}

/** Measured for DeepSeek V4 Flash q2-imatrix (~81GB model, wired regardless of ctx) on a 128GB M5 Max. */
export const CTX_TABLE: CtxRow[] = [
  { ctx: 100_000, label: '100k', kvGb: 1.9, wiredGb: 83, freeGb: 45, thinkMax: false },
  { ctx: 393_216, label: '393k', kvGb: 6.4, wiredGb: 87, freeGb: 41, thinkMax: true },
  { ctx: 1_000_000, label: '1M', kvGb: 15.6, wiredGb: 97, freeGb: 31, thinkMax: true },
]

export const TOTAL_RAM_GB = 128

/* ------------------------------- Stat counters ----------------------------- */

export interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label: string
  note?: string
}

export const STATS: Stat[] = [
  { value: 1, suffix: 'M', label: 'token context', note: 'on the local DeepSeek V4 Flash setup' },
  { value: 40, suffix: '+', label: 'model providers', note: 'any OpenAI/Anthropic-compatible endpoint' },
  { value: 28, label: 'DAP debug operations', note: 'breakpoints, stepping, inspection' },
  { value: 0, label: 'cloud calls for compaction', note: 'snapcompact renders history to images' },
]

/* ------------------------------- Comparison -------------------------------- */

export interface CompareRow {
  dimension: string
  omp: string
  others: string
}

/**
 * A positioning snapshot, not a scorecard — tools move fast; this reflects
 * mid-2026. The point is where omp sits, not declaring a winner.
 */
export const COMPARISON: CompareRow[] = [
  { dimension: 'Surface', omp: 'Terminal-first; also an SDK / ACP server', others: 'Often IDE- or editor-embedded' },
  { dimension: 'Providers', omp: 'Any provider you have creds for (40+)', others: 'Single-vendor or a smaller set' },
  { dimension: 'Editing', omp: 'Hashline anchors (drift-proof)', others: 'Line numbers or whole-line rewrites' },
  { dimension: 'Code intelligence', omp: 'In-process LSP + DAP debugger', others: 'Varies; debugger access is rare' },
  { dimension: 'Parallelism', omp: 'Subagent fanout over an IRC bus', others: 'Usually single-threaded' },
  { dimension: 'Local models', omp: 'First-class (this guide runs one)', others: 'Limited or cloud-only' },
]

/* ----------------------------- Terminal scenes ----------------------------- */

export interface TerminalLine {
  /** 'in' = typed command, 'sys' = dim system note, 'out' = model output. */
  kind: 'in' | 'sys' | 'out'
  text: string
}

export interface TerminalScene {
  id: string
  title: string
  lines: TerminalLine[]
}

export const TERMINAL_SCENES: Record<string, TerminalScene> = {
  intro: {
    id: 'intro',
    title: 'omp',
    lines: [
      { kind: 'in', text: 'omp "what does this service do, and where are the tests?"' },
      { kind: 'sys', text: 'reading 38 files · lsp: typescript · model: default' },
      { kind: 'out', text: "It's a Fastify order service. Routes live in src/routes," },
      { kind: 'out', text: 'domain logic in src/core, and tests in test/ (vitest).' },
      { kind: 'out', text: 'Want me to add coverage for the refund path?' },
    ],
  },
  local: {
    id: 'local',
    title: 'omp — fully local',
    lines: [
      { kind: 'in', text: 'omp "summarize the change I just staged"' },
      { kind: 'sys', text: 'ds4: starting DeepSeek V4 Flash (first run loads ~80GB, ~30s)…' },
      { kind: 'sys', text: 'ds4: ready on :8000 ✓' },
      { kind: 'out', text: 'You tightened the retry policy in payments.ts: max 3' },
      { kind: 'out', text: 'attempts, exponential backoff, and you now log the' },
      { kind: 'out', text: 'final failure. No network left your machine.' },
    ],
  },
}

/* ------------------------------- Source links ------------------------------ */

export interface Source {
  label: string
  url: string
}

export const SOURCES: Source[] = [
  { label: 'Oh My Pi — github.com/can1357/oh-my-pi', url: 'https://github.com/can1357/oh-my-pi' },
  { label: 'omp.sh', url: 'https://omp.sh' },
  { label: 'Snapcompact (Can Bölük)', url: 'https://blog.can.ac/2026/06/10/snapcompact/' },
  { label: 'Hindsight memory integration', url: 'https://hindsight.vectorize.io/blog/2026/06/08/oh-my-pi-hindsight-memory' },
  { label: 'BetterStack: Oh My Pi guide', url: 'https://betterstack.com/community/guides/ai/oh-my-pi-ai-coding-agent/' },
  { label: 'antirez/ds4 — DeepSeek V4 Flash engine', url: 'https://github.com/antirez/ds4' },
]
