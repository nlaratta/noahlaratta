export type LabCategory = 'research' | 'learning' | 'workflow'

export interface LabEntry {
  id: string
  title: string
  summary: string
  description: string
  tags: string[]
  category: LabCategory
  highlights?: { label: string; value: string }[]
  demoLink?: string
  githubLink?: string
  ctaLabel?: string
  date: string
  hidden?: boolean
}

export const labEntries: LabEntry[] = [
  {
    id: 'verdigris-depths',
    title: 'Verdigris Depths',
    summary:
      'A handcrafted browser roguelite RPG with five-floor runs, relic drafting, turn-based combat, and a cinematic UI built to ship from a static export.',
    description: `
      Verdigris Depths is a lightweight roguelite RPG designed specifically for static hosting. The game uses a deterministic turn loop, procedural chambers, mobile-friendly controls, and a relic system that pushes each run in a different direction without needing any backend infrastructure.

      The goal was to make something that feels richer than a portfolio gimmick: a real playable subpath experience with progression, atmosphere, and repeatable runs.
    `,
    tags: ['Next.js', 'TypeScript', 'Roguelite', 'Game Design'],
    category: 'learning',
    highlights: [
      { label: 'Floors', value: '5' },
      { label: 'Relics', value: '8' },
      { label: 'Enemy Types', value: '4' },
      { label: 'Input Modes', value: '2' },
    ],
    demoLink: '/verdigris-depths',
    ctaLabel: 'Enter the Depths',
    date: 'March 2026',
  },
  {
    id: 'trend-research',
    title: 'App Opportunity Intelligence',
    summary:
      'Data-driven market analysis using Google Trends to identify high-potential app and product opportunities across 23 demographic categories.',
    description: `
      A three-stage research pipeline that uses the PyTrends API to analyze keyword search interest, score trends, and rank opportunities. The system processes 116 keywords across categories like elder care, pet tech, and wedding planning — scoring each on growth, momentum, and stability to surface actionable signals.

      The pipeline identified 26 "green light" opportunities with strong growth trajectories, then deep-dived into the top 3 categories with 15 keywords each. Results are visualized in an interactive Chart.js dashboard.
    `,
    tags: ['Google Trends', 'Python', 'Chart.js', 'Market Analysis'],
    category: 'research',
    highlights: [
      { label: 'Keywords Analyzed', value: '116' },
      { label: 'Categories', value: '23' },
      { label: 'Green Light Signals', value: '26' },
      { label: 'Deep-Dive Categories', value: '3' },
    ],
    demoLink: '/trend_dashboard.html',
    ctaLabel: 'View Dashboard',
    date: 'February 2026',
  },
  {
    id: 'claude-agent-sdk',
    title: 'Claude Agent SDK Exploration',
    summary:
      'Hands-on exploration of building tool-using agents with structured outputs, guardrails, and multi-step reasoning using the Claude Agent SDK.',
    description: `
      A learning-focused project exploring the Claude Agent SDK's capabilities for building autonomous tool-using agents. Covers structured output parsing, guardrail configuration, and orchestrating multi-step reasoning chains.
    `,
    tags: ['Claude SDK', 'AI Agents', 'TypeScript', 'Tool Use'],
    category: 'learning',
    date: 'February 2026',
    hidden: true,
  },
  {
    id: 'squadup-seed-data',
    title: 'SquadUp AI Seed Data Generation',
    summary:
      'AI-powered workflow for generating realistic seed data across 40+ models with full referential integrity for the SquadUp platform.',
    description: `
      A development workflow that uses AI to generate realistic, interconnected seed data for the SquadUp platform. Handles 40+ data models with proper foreign key relationships, realistic temporal patterns, and domain-appropriate content.
    `,
    tags: ['AI Workflow', 'Seed Data', 'SquadUp', 'Data Generation'],
    category: 'workflow',
    date: 'February 2026',
    hidden: true,
  },
]

export const getAllLabEntries = () => labEntries.filter((e) => !e.hidden)

export const getLabEntryById = (id: string) =>
  labEntries.find((entry) => entry.id === id)
