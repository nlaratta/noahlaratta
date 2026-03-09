import Link from 'next/link'
import { startTransition, type ReactNode, useEffect, useState } from 'react'
import {
  chooseRelic,
  createInitialGameState,
  drinkFlask,
  FINAL_FLOOR,
  GameState,
  GRID_SIZE,
  movePlayer,
  relicCatalog,
  RelicDefinition,
  waitTurn,
} from '../lib/verdigrisDepths'

const panelClassName =
  'rounded-[28px] border border-white/12 bg-slate-950/70 shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl'

const statTone: Record<string, string> = {
  hp: 'text-emerald-200',
  attack: 'text-amber-200',
  armor: 'text-sky-200',
  essence: 'text-fuchsia-200',
}

const toneClassName = {
  good: 'text-emerald-200',
  bad: 'text-rose-200',
  neutral: 'text-slate-300',
}

const tileClassName: Record<string, string> = {
  floor: 'border-white/5 bg-slate-900/60 text-slate-500',
  wall: 'border-emerald-900/80 bg-slate-950 text-slate-700',
  exit: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  shrine: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200',
}

const enemyClassName: Record<string, string> = {
  mossling: 'border-emerald-400/35 bg-emerald-500/15 text-emerald-200',
  wisp: 'border-violet-400/35 bg-violet-500/15 text-violet-200',
  sentinel: 'border-sky-400/35 bg-sky-500/15 text-sky-200',
  knight: 'border-rose-400/35 bg-rose-500/15 text-rose-200',
}

const controlButtons = [
  { label: 'Up', keycap: 'W', delta: [0, -1] as const },
  { label: 'Left', keycap: 'A', delta: [-1, 0] as const },
  { label: 'Wait', keycap: 'Space', delta: null },
  { label: 'Right', keycap: 'D', delta: [1, 0] as const },
  { label: 'Down', keycap: 'S', delta: [0, 1] as const },
]

const getTileGlyph = (
  game: GameState,
  x: number,
  y: number
): { glyph: string; className: string; label: string } => {
  if (game.player.position.x === x && game.player.position.y === y) {
    return {
      glyph: '@',
      className: 'border-emerald-300/50 bg-emerald-400/20 text-emerald-100 shadow-[0_0_24px_rgba(74,222,128,0.2)]',
      label: 'You',
    }
  }

  const enemy = game.enemies.find((entry) => entry.position.x === x && entry.position.y === y)

  if (enemy) {
    return {
      glyph: enemy.glyph,
      className: enemyClassName[enemy.kind],
      label: enemy.name,
    }
  }

  const tile = game.map[y][x]

  if (tile === 'wall') {
    return { glyph: '#', className: tileClassName.wall, label: 'Wall' }
  }

  if (tile === 'exit') {
    return { glyph: '>', className: tileClassName.exit, label: game.gateUnlocked ? 'Open gate' : 'Sealed gate' }
  }

  if (tile === 'shrine') {
    return { glyph: '+', className: tileClassName.shrine, label: 'Shrine' }
  }

  return { glyph: '.', className: tileClassName.floor, label: 'Floor' }
}

const getOwnedRelics = (game: GameState): RelicDefinition[] =>
  relicCatalog.filter((relic) => game.player.relics.includes(relic.id))

function StatCard({
  label,
  value,
  tone,
  helper,
}: {
  label: string
  value: string
  tone: 'hp' | 'attack' | 'armor' | 'essence'
  helper: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${statTone[tone]}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{helper}</div>
    </div>
  )
}

function OverlayCard({
  title,
  body,
  children,
}: {
  title: string
  body: string
  children: ReactNode
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[32px] bg-slate-950/85 p-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-black/30">
        <div className="text-xs uppercase tracking-[0.35em] text-emerald-300">Verdigris Depths</div>
        <h3 className="mt-3 text-3xl font-semibold text-white">{title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{body}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

export default function VerdigrisDepthsGame() {
  const [game, setGame] = useState<GameState | null>(null)

  useEffect(() => {
    startTransition(() => {
      setGame(createInitialGameState())
    })
  }, [])

  const commit = (updater: (current: GameState) => GameState) => {
    startTransition(() => {
      setGame((current) => (current ? updater(current) : current))
    })
  }

  const restartRun = () => {
    startTransition(() => {
      setGame(createInitialGameState())
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!game || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const key = event.key.toLowerCase()

      if (
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' ', 'h', 'r'].includes(
          key
        )
      ) {
        event.preventDefault()
      }

      if (key === 'arrowup' || key === 'w') {
        startTransition(() => {
          setGame((current) => (current ? movePlayer(current, 0, -1) : current))
        })
        return
      }

      if (key === 'arrowdown' || key === 's') {
        startTransition(() => {
          setGame((current) => (current ? movePlayer(current, 0, 1) : current))
        })
        return
      }

      if (key === 'arrowleft' || key === 'a') {
        startTransition(() => {
          setGame((current) => (current ? movePlayer(current, -1, 0) : current))
        })
        return
      }

      if (key === 'arrowright' || key === 'd') {
        startTransition(() => {
          setGame((current) => (current ? movePlayer(current, 1, 0) : current))
        })
        return
      }

      if (key === ' ') {
        startTransition(() => {
          setGame((current) => (current ? waitTurn(current) : current))
        })
        return
      }

      if (key === 'h') {
        startTransition(() => {
          setGame((current) => (current ? drinkFlask(current) : current))
        })
        return
      }

      if (key === 'r') {
        startTransition(() => {
          setGame(createInitialGameState())
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [game])

  if (!game) {
    return (
      <div className={`${panelClassName} overflow-hidden p-8`}>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="h-24 rounded-2xl bg-white/5" />
            <div className="h-40 rounded-2xl bg-white/5" />
          </div>
          <div className="h-[540px] rounded-[32px] bg-white/5" />
          <div className="space-y-4">
            <div className="h-48 rounded-2xl bg-white/5" />
            <div className="h-48 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    )
  }

  const ownedRelics = getOwnedRelics(game)
  const healthPercent = Math.max(0, (game.player.hp / game.player.maxHp) * 100)
  const xpPercent = Math.max(0, (game.player.xp / game.player.nextLevelXp) * 100)

  return (
    <div className={`${panelClassName} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.1),rgba(2,6,23,0.55))]" />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <div className="text-[11px] uppercase tracking-[0.3em] text-emerald-300">Current Run</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{game.seedName}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{game.roomMood}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">
                  Floor {game.floor}/{FINAL_FLOOR}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                  Turn {game.turn}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Health"
                value={`${game.player.hp}/${game.player.maxHp}`}
                tone="hp"
                helper={`${game.player.flasks} flask${game.player.flasks === 1 ? '' : 's'} left`}
              />
              <StatCard
                label="Attack"
                value={String(game.player.attack)}
                tone="attack"
                helper={`${Math.round(game.player.critChance * 100)}% crit`}
              />
              <StatCard
                label="Armor"
                value={String(game.player.armor)}
                tone="armor"
                helper={`${game.player.ward} ward ready`}
              />
              <StatCard
                label="Essence"
                value={String(game.player.essence)}
                tone="essence"
                helper={`Level ${game.player.level}`}
              />
            </div>

            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Vitality</div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300"
                      style={{ width: `${healthPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Experience</div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {game.player.xp}/{game.player.nextLevelXp} to next level
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Controls</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div>`WASD` / arrows</div>
                <div>Move and attack</div>
                <div>`H`</div>
                <div>Drink flask</div>
                <div>`Space`</div>
                <div>Wait a turn</div>
                <div>`R`</div>
                <div>Restart run</div>
              </div>
            </div>
          </aside>

          <section className="relative rounded-[32px] border border-white/8 bg-slate-950/55 p-4 sm:p-6">
            <div className="flex flex-col gap-2 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-300">{game.roomName}</div>
                <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Verdigris Depths</h3>
              </div>
              <div className="text-sm leading-6 text-slate-300">
                Clear the chamber, claim one relic, and descend.
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div
                className="grid gap-1 rounded-[30px] border border-white/8 bg-slate-950/80 p-3 shadow-[0_24px_80px_rgba(2,6,23,0.55)] sm:p-4"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                  const x = index % GRID_SIZE
                  const y = Math.floor(index / GRID_SIZE)
                  const tile = getTileGlyph(game, x, y)

                  return (
                    <div
                      key={`${x}-${y}`}
                      title={tile.label}
                      className={`flex aspect-square min-h-[24px] min-w-[24px] items-center justify-center rounded-xl border text-sm font-semibold sm:min-h-[34px] sm:min-w-[34px] sm:text-base ${tile.className}`}
                    >
                      {tile.glyph}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {controlButtons.map((control) => (
                <button
                  key={control.label}
                  type="button"
                  onClick={() =>
                    control.delta
                      ? commit((current) => movePlayer(current, control.delta[0], control.delta[1]))
                      : commit(waitTurn)
                  }
                  className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-left transition hover:border-emerald-300/30 hover:bg-emerald-400/10"
                >
                  <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{control.keycap}</div>
                  <div className="mt-2 text-sm font-medium text-white">{control.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => commit(drinkFlask)}
                className="flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
              >
                Drink Flask
              </button>
              <button
                type="button"
                onClick={restartRun}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
              >
                Restart Run
              </button>
            </div>

            {game.pendingRelics && (
              <OverlayCard
                title="Relic Chamber"
                body="The gate answers your run. Choose one relic to shape the next floor."
              >
                <div className="grid gap-4 lg:grid-cols-3">
                  {game.pendingRelics.map((relic) => (
                    <button
                      key={relic.id}
                      type="button"
                      onClick={() => commit((current) => chooseRelic(current, relic.id))}
                      className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-emerald-300/30 hover:bg-white/[0.06]"
                    >
                      <div className={`h-2 rounded-full bg-gradient-to-r ${relic.accent}`} />
                      <div className="mt-4 text-xl font-semibold text-white">{relic.name}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-300">{relic.summary}</div>
                    </button>
                  ))}
                </div>
              </OverlayCard>
            )}

            {game.status === 'won' && (
              <OverlayCard
                title="Run Complete"
                body="You reached the surface carrying the garden's last light. The Depths will be waiting for a harder second descent."
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={restartRun}
                    className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/15"
                  >
                    Start Another Run
                  </button>
                  <Link
                    href="/lab"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
                  >
                    Back to the Lab
                  </Link>
                </div>
              </OverlayCard>
            )}

            {game.status === 'lost' && (
              <OverlayCard
                title="Run Lost"
                body="The chamber took this run. Restart immediately or tune your route and try again."
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={restartRun}
                    className="rounded-2xl border border-rose-300/25 bg-rose-400/10 px-5 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-400/15"
                  >
                    Re-enter the Depths
                  </button>
                  <Link
                    href="/lab"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
                  >
                    Back to the Lab
                  </Link>
                </div>
              </OverlayCard>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Enemies</div>
                <div className="text-xs text-slate-500">{game.enemies.length} remaining</div>
              </div>
              <div className="mt-4 space-y-3">
                {game.enemies.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                    Chamber cleared. Head for the gate.
                  </div>
                ) : (
                  game.enemies.map((enemy) => (
                    <div
                      key={enemy.id}
                      className="rounded-2xl border border-white/8 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold ${enemyClassName[enemy.kind]}`}
                          >
                            {enemy.glyph}
                          </div>
                          <div>
                            <div className="font-medium text-white">{enemy.name}</div>
                            <div className="text-xs text-slate-500">
                              {enemy.position.x},{enemy.position.y}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-200">{enemy.hp}/{enemy.maxHp}</div>
                          <div className="text-xs text-slate-500">ATK {enemy.attack}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Relics</div>
                <div className="text-xs text-slate-500">{ownedRelics.length} claimed</div>
              </div>
              <div className="mt-4 space-y-3">
                {ownedRelics.length === 0 ? (
                  <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-4 text-sm text-slate-400">
                    Clear the floor and step through the gate to claim your first relic.
                  </div>
                ) : (
                  ownedRelics.map((relic) => (
                    <div key={relic.id} className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${relic.accent}`} />
                      <div className="mt-3 text-sm font-medium text-white">{relic.name}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-400">{relic.summary}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Run Feed</div>
              <div className="mt-4 space-y-3">
                {game.log.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                    <div className={`text-sm leading-6 ${toneClassName[entry.tone]}`}>{entry.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
