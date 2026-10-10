import { useState } from 'react'

type Mark = 'G' | 'Y' | '-'

/** Wordle feedback with correct duplicate handling (same rule as the Java solver). */
export function feedback(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(5).fill('-')
  const left: Record<string, number> = {}
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) marks[i] = 'G'
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1
  }
  for (let i = 0; i < 5; i++) {
    if (marks[i] === 'G') continue
    if ((left[guess[i]] ?? 0) > 0) {
      marks[i] = 'Y'
      left[guess[i]]--
    }
  }
  return marks
}

const EXAMPLES = [
  { answer: 'abide', guess: 'speed', note: 'Only one E is yellow: the answer has a single E left to match.' },
  { answer: 'there', guess: 'eerie', note: 'The last E is green, so just one of the two earlier Es can be yellow.' },
  { answer: 'hello', guess: 'llama', note: 'The answer has two Ls, so both Ls in the guess light up.' },
]

const tile: Record<Mark, string> = {
  G: 'bg-primary text-on-primary border-primary',
  Y: 'bg-gold-mark text-[#1a1a1a] border-gold-mark',
  '-': 'bg-surface text-text-secondary border-border',
}
const name: Record<Mark, string> = { G: 'green', Y: 'yellow', '-': 'gray' }

const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5)

export default function WordleFeedback() {
  const [answer, setAnswer] = useState(EXAMPLES[0].answer)
  const [guess, setGuess] = useState(EXAMPLES[0].guess)
  const ready = answer.length === 5 && guess.length === 5
  const marks = ready ? feedback(guess, answer) : null
  const example = EXAMPLES.find((e) => e.answer === answer && e.guess === guess)

  return (
    <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { id: 'wf-answer', label: 'Answer', value: answer, set: setAnswer },
          { id: 'wf-guess', label: 'Guess', value: guess, set: setGuess },
        ].map((f) => (
          <label key={f.id} htmlFor={f.id} className="block">
            <span className="text-sm text-text-secondary">{f.label}</span>
            <input
              id={f.id}
              value={f.value}
              onChange={(e) => f.set(clean(e.target.value))}
              maxLength={5}
              autoComplete="off"
              spellCheck={false}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-lg tracking-[0.3em] text-foreground uppercase focus:border-primary focus:outline-none"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex gap-2" aria-live="polite">
        {Array.from({ length: 5 }, (_, i) => {
          const m = marks?.[i] ?? '-'
          return (
            <span
              key={i}
              className={`flex h-14 w-14 items-center justify-center rounded-md border-2 font-mono text-2xl font-medium uppercase ${marks ? tile[m] : tile['-']}`}
              aria-label={marks ? `${guess[i]} ${name[m]}` : undefined}
            >
              {guess[i] ?? ''}
            </span>
          )
        })}
      </div>
      <p className="mt-4 min-h-[1.5rem] text-sm text-text-secondary">
        {!ready ? 'Enter five letters in both boxes.' : example ? example.note : `Pattern: ${marks!.join('')}`}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e.answer}
            type="button"
            onClick={() => {
              setAnswer(e.answer)
              setGuess(e.guess)
            }}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-text-secondary hover:border-primary hover:text-foreground"
          >
            {e.guess} vs {e.answer}
          </button>
        ))}
      </div>
    </div>
  )
}
