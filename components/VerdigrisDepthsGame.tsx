import Link from 'next/link'
import dynamic from 'next/dynamic'
import { startTransition, type ReactNode, useEffect, useState } from 'react'
import {
  attackEnemy,
  chooseRelic,
  createInitialGameState,
  drinkFlask,
  FINAL_FLOOR,
  GameState,
  Position,
  receiveEnemyAttack,
  relicCatalog,
  RelicDefinition,
  touchTile,
} from '../lib/verdigrisDepths'

const panelClassName =
  'rounded-[28px] border border-white/12 bg-slate-950/70 shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl'

const VerdigrisDepthsScene = dynamic(() => import('./VerdigrisDepthsScene'), {
  ssr: false,
  loading: () => (
    <div className="h-[620px] rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),rgba(2,6,23,0.96)_48%)] p-6">
      <div className="flex h-full items-center justify-center rounded-[24px] border border-white/8 bg-white/[0.03] text-sm uppercase tracking-[0.3em] text-slate-400">
        Loading 3D chamber
      </div>
    </div>
  ),
})

const statTone: Record<'hp' | 'attack' | 'armor' | 'essence', string> = {
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

const enemyClassName: Record<string, string> = {
  mossling: 'border-emerald-400/35 bg-emerald-500/15 text-emerald-200',
  wisp: 'border-violet-400/35 bg-violet-500/15 text-violet-200',
  sentinel: 'border-sky-400/35 bg-sky-500/15 text-sky-200',
  knight: 'border-rose-400/35 bg-rose-500/15 text-rose-200',
}

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

const getOwnedRelics = (game: GameState): RelicDefinition[] =>
  relicCatalog.filter((relic) => game.player.relics.includes(relic.id))

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

  const handleAttackEnemy = (enemyId: string) => {
    commit((current) => attackEnemy(current, enemyId))
  }

  const handleEnemyAttack = (enemyId: string) => {
    commit((current) => receiveEnemyAttack(current, enemyId))
  }

  const handleTouchTile = (position: Position) => {
    commit((current) => touchTile(current, position))
  }

  const handleDrinkFlask = () => {
    commit(drinkFlask)
  }

  if (!game) {
    return (
      <div className={`${panelClassName} overflow-hidden p-8`}>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="h-24 rounded-2xl bg-white/5" />
            <div className="h-40 rounded-2xl bg-white/5" />
          </div>
          <div className="h-[620px] rounded-[32px] bg-white/5" />
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
                  {game.gateUnlocked ? 'Gate unlocked' : 'Gate sealed'}
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
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Vitality</div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300"
                    style={{ width: `${healthPercent}%` }}
                  />
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
                <div>`WASD`</div>
                <div>Move in real time</div>
                <div>Mouse drag</div>
                <div>Orbit camera</div>
                <div>`Space`</div>
                <div>Attack nearest enemy</div>
                <div>`H`</div>
                <div>Drink flask</div>
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
                Run the corridors, survive the room, and claim a relic before the next descent.
              </div>
            </div>

            <div className="mt-6">
              <VerdigrisDepthsScene
                game={game}
                onAttackEnemy={handleAttackEnemy}
                onEnemyAttack={handleEnemyAttack}
                onTouchTile={handleTouchTile}
                onDrinkFlask={handleDrinkFlask}
                onRestartRun={restartRun}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
              <span>Third-person real-time movement</span>
              <span>Camera-relative controls</span>
              <span>Space to attack in melee range</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDrinkFlask}
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
                body="You clawed through every corridor and surfaced with the garden's last light."
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
                body="The dungeon held this descent. Re-enter immediately or tune your relic route and try again."
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
                    Chamber cleared. Find the gate and descend.
                  </div>
                ) : (
                  game.enemies.map((enemy) => (
                    <div key={enemy.id} className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
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
                              HP {enemy.hp}/{enemy.maxHp}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          ATK {enemy.attack}
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
                    Clear the room and enter the unlocked gate to claim your first relic.
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
