export const GRID_SIZE = 11
export const FINAL_FLOOR = 5
const START_POSITION = { x: Math.floor(GRID_SIZE / 2), y: GRID_SIZE - 2 }
const EXIT_POSITION = { x: Math.floor(GRID_SIZE / 2), y: 1 }

export type TileType = 'floor' | 'wall' | 'exit' | 'shrine'
export type RunStatus = 'playing' | 'won' | 'lost'
export type EnemyKind = 'mossling' | 'wisp' | 'sentinel' | 'knight'
export type RelicId =
  | 'verdant-heart'
  | 'thorn-oath'
  | 'ironbark-ring'
  | 'moonwell-flask'
  | 'waking-ember'
  | 'grave-salt'
  | 'awn-shield'
  | 'dawnspore'

export interface Position {
  x: number
  y: number
}

export interface Enemy {
  id: string
  kind: EnemyKind
  name: string
  glyph: string
  hp: number
  maxHp: number
  attack: number
  xp: number
  essence: number
  position: Position
}

export interface PlayerState {
  position: Position
  hp: number
  maxHp: number
  attack: number
  armor: number
  level: number
  xp: number
  nextLevelXp: number
  flasks: number
  maxFlasks: number
  potionPower: number
  critChance: number
  lifesteal: number
  wardPerFloor: number
  ward: number
  openingStrikeBonus: number
  essence: number
  relics: RelicId[]
}

export interface CombatLogEntry {
  id: string
  text: string
  tone: 'good' | 'bad' | 'neutral'
}

export interface RelicDefinition {
  id: RelicId
  name: string
  summary: string
  accent: string
}

export interface GameState {
  floor: number
  finalFloor: number
  roomName: string
  roomMood: string
  seedName: string
  map: TileType[][]
  player: PlayerState
  enemies: Enemy[]
  gateUnlocked: boolean
  openingStrikeReady: boolean
  pendingRelics: RelicDefinition[] | null
  log: CombatLogEntry[]
  status: RunStatus
  turn: number
}

const roomNames = [
  'The Glassroot Vestibule',
  'Bramble Engine',
  'Cinder Atrium',
  'Pale Orchard',
  'Thornwake Chapel',
  'Mossbound Reliquary',
]

const roomMoods = [
  'Wet stone, dormant roots, and a gate humming below the floorboards.',
  'A chamber cut for duels, lit by spores and old machine-light.',
  'The air tastes metallic, like rain trapped inside a bell.',
  'Every step wakes green sparks in the dust.',
  'Broken sigils crawl along the walls and point deeper down.',
]

const runNamesFirst = ['Velvet', 'Verdant', 'Hollow', 'Gilded', 'Silent']
const runNamesLast = ['Echo', 'Pilgrim', 'Warden', 'Bloom', 'Lantern']

export const relicCatalog: RelicDefinition[] = [
  {
    id: 'verdant-heart',
    name: 'Verdant Heart',
    summary: '+8 max HP and heal 8.',
    accent: 'from-emerald-400 to-lime-300',
  },
  {
    id: 'thorn-oath',
    name: 'Thorn Oath',
    summary: '+2 attack on every strike.',
    accent: 'from-rose-400 to-orange-300',
  },
  {
    id: 'ironbark-ring',
    name: 'Ironbark Ring',
    summary: '+1 armor against every hit.',
    accent: 'from-stone-300 to-stone-100',
  },
  {
    id: 'moonwell-flask',
    name: 'Moonwell Flask',
    summary: '+1 flask and stronger healing.',
    accent: 'from-sky-400 to-cyan-200',
  },
  {
    id: 'waking-ember',
    name: 'Waking Ember',
    summary: 'Critical strike chance rises by 12%.',
    accent: 'from-amber-400 to-yellow-200',
  },
  {
    id: 'grave-salt',
    name: 'Grave Salt',
    summary: 'Heal 1 HP whenever you land a hit.',
    accent: 'from-indigo-400 to-fuchsia-300',
  },
  {
    id: 'awn-shield',
    name: 'Awn Shield',
    summary: 'Gain an extra ward at the start of each floor.',
    accent: 'from-teal-400 to-emerald-200',
  },
  {
    id: 'dawnspore',
    name: 'Dawnspore',
    summary: 'Your first strike each floor deals +4 damage.',
    accent: 'from-orange-400 to-rose-300',
  },
]

const enemyBlueprints: Record<
  EnemyKind,
  { name: string; glyph: string; hp: number; attack: number; xp: number; essence: number }
> = {
  mossling: { name: 'Mossling', glyph: 'M', hp: 8, attack: 3, xp: 5, essence: 4 },
  wisp: { name: 'Ash Wisp', glyph: 'W', hp: 6, attack: 4, xp: 6, essence: 5 },
  sentinel: { name: 'Root Sentinel', glyph: 'S', hp: 12, attack: 5, xp: 8, essence: 7 },
  knight: { name: 'Briar Knight', glyph: 'K', hp: 18, attack: 7, xp: 12, essence: 10 },
}

const tileKey = ({ x, y }: Position) => `${x},${y}`

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const sample = <T,>(items: T[]) => items[randomInt(0, items.length - 1)]

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const isAdjacent = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1

const appendLog = (
  entries: CombatLogEntry[],
  text: string,
  tone: CombatLogEntry['tone'] = 'neutral'
) => [{ id: `${Date.now()}-${Math.random()}`, text, tone }, ...entries].slice(0, 8)

const findEnemyIndex = (enemies: Enemy[], position: Position) =>
  enemies.findIndex(
    (enemy) => enemy.position.x === position.x && enemy.position.y === position.y
  )

const createBaseMap = () =>
  Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) =>
      x === 0 || y === 0 || x === GRID_SIZE - 1 || y === GRID_SIZE - 1 ? 'wall' : 'floor'
    )
  ) as TileType[][]

const tryPlaceObstacle = (
  map: TileType[][],
  position: Position,
  reserved: Set<string>,
  horizontal: boolean
) => {
  const cells = [position]

  if (Math.random() > 0.4) {
    const offset = horizontal ? { x: position.x + 1, y: position.y } : { x: position.x, y: position.y + 1 }
    cells.push(offset)
  }

  if (
    cells.some(
      (cell) =>
        cell.x <= 1 ||
        cell.y <= 1 ||
        cell.x >= GRID_SIZE - 1 ||
        cell.y >= GRID_SIZE - 1 ||
        reserved.has(tileKey(cell))
    )
  ) {
    return
  }

  cells.forEach((cell) => {
    map[cell.y][cell.x] = 'wall'
  })
}

const createFloorLayout = (floor: number) => {
  const map = createBaseMap()
  const reserved = new Set([
    tileKey(START_POSITION),
    tileKey(EXIT_POSITION),
    tileKey({ x: START_POSITION.x, y: START_POSITION.y - 1 }),
    tileKey({ x: EXIT_POSITION.x, y: EXIT_POSITION.y + 1 }),
  ])

  map[EXIT_POSITION.y][EXIT_POSITION.x] = 'exit'

  const obstacleCount = clamp(3 + floor, 4, 7)

  for (let i = 0; i < obstacleCount; i += 1) {
    tryPlaceObstacle(
      map,
      { x: randomInt(2, GRID_SIZE - 3), y: randomInt(2, GRID_SIZE - 3) },
      reserved,
      Math.random() > 0.5
    )
  }

  if (floor % 2 === 1) {
    const shrinePosition = { x: randomInt(2, GRID_SIZE - 3), y: randomInt(3, GRID_SIZE - 4) }

    if (!reserved.has(tileKey(shrinePosition)) && map[shrinePosition.y][shrinePosition.x] === 'floor') {
      map[shrinePosition.y][shrinePosition.x] = 'shrine'
      reserved.add(tileKey(shrinePosition))
    }
  }

  return map
}

const createEnemy = (kind: EnemyKind, floor: number, position: Position, index: number): Enemy => {
  const blueprint = enemyBlueprints[kind]
  const hpBoost = floor > 2 ? floor - 2 : 0
  const attackBoost = floor > 3 ? 1 : 0

  return {
    id: `${kind}-${floor}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    name: blueprint.name,
    glyph: blueprint.glyph,
    hp: blueprint.hp + hpBoost * 2,
    maxHp: blueprint.hp + hpBoost * 2,
    attack: blueprint.attack + attackBoost,
    xp: blueprint.xp + hpBoost,
    essence: blueprint.essence + hpBoost,
    position,
  }
}

const enemyPoolForFloor = (floor: number): EnemyKind[] => {
  if (floor >= FINAL_FLOOR) {
    return ['sentinel', 'knight', 'knight', 'wisp']
  }

  if (floor === 4) {
    return ['mossling', 'wisp', 'sentinel', 'sentinel', 'knight']
  }

  if (floor === 3) {
    return ['mossling', 'wisp', 'wisp', 'sentinel']
  }

  if (floor === 2) {
    return ['mossling', 'mossling', 'wisp', 'sentinel']
  }

  return ['mossling', 'mossling', 'wisp']
}

const createEnemies = (map: TileType[][], floor: number) => {
  const reserved = new Set([tileKey(START_POSITION), tileKey(EXIT_POSITION)])
  const placements: Enemy[] = []
  const count = clamp(floor + 2, 3, 6)
  const pool = enemyPoolForFloor(floor)

  for (let i = 0; i < count; i += 1) {
    let tries = 0

    while (tries < 40) {
      const position = { x: randomInt(1, GRID_SIZE - 2), y: randomInt(2, GRID_SIZE - 3) }
      const key = tileKey(position)

      if (map[position.y][position.x] === 'floor' && !reserved.has(key)) {
        placements.push(createEnemy(sample(pool), floor, position, i))
        reserved.add(key)
        break
      }

      tries += 1
    }
  }

  return placements
}

const drawRelics = (owned: RelicId[]) => {
  const uniqueChoices = relicCatalog.filter((relic) => !owned.includes(relic.id))
  const source = uniqueChoices.length >= 3 ? uniqueChoices : relicCatalog

  return shuffle(source).slice(0, 3)
}

const applyRelic = (player: PlayerState, relicId: RelicId): PlayerState => {
  const next = {
    ...player,
    relics: player.relics.includes(relicId) ? player.relics : [...player.relics, relicId],
  }

  switch (relicId) {
    case 'verdant-heart':
      next.maxHp += 8
      next.hp = Math.min(next.maxHp, next.hp + 8)
      return next
    case 'thorn-oath':
      next.attack += 2
      return next
    case 'ironbark-ring':
      next.armor += 1
      return next
    case 'moonwell-flask':
      next.maxFlasks += 1
      next.flasks += 1
      next.potionPower += 4
      return next
    case 'waking-ember':
      next.critChance = clamp(next.critChance + 0.12, 0, 0.6)
      return next
    case 'grave-salt':
      next.lifesteal += 1
      return next
    case 'awn-shield':
      next.wardPerFloor += 1
      next.ward += 1
      return next
    case 'dawnspore':
      next.openingStrikeBonus += 4
      return next
  }
}

const resolveLevelUps = (
  player: PlayerState,
  log: CombatLogEntry[]
): { player: PlayerState; log: CombatLogEntry[] } => {
  let nextPlayer = { ...player }
  let nextLog = log

  while (nextPlayer.xp >= nextPlayer.nextLevelXp) {
    nextPlayer = {
      ...nextPlayer,
      xp: nextPlayer.xp - nextPlayer.nextLevelXp,
      level: nextPlayer.level + 1,
      nextLevelXp: Math.ceil(nextPlayer.nextLevelXp * 1.45),
      maxHp: nextPlayer.maxHp + 4,
      hp: Math.min(nextPlayer.maxHp + 4, nextPlayer.hp + 6),
      attack: nextPlayer.attack + 1,
    }

    nextLog = appendLog(
      nextLog,
      `Level ${nextPlayer.level}. Your blade hums louder in the dark.`,
      'good'
    )
  }

  return { player: nextPlayer, log: nextLog }
}

const getSpawnPlayer = (player: PlayerState): PlayerState => ({
  ...player,
  position: { ...START_POSITION },
  ward: player.wardPerFloor,
})

const generateFloorState = (
  floor: number,
  player: PlayerState,
  seedName: string,
  log: CombatLogEntry[]
): GameState => {
  const map = createFloorLayout(floor)
  const enemies = createEnemies(map, floor)

  return {
    floor,
    finalFloor: FINAL_FLOOR,
    roomName: sample(roomNames),
    roomMood: sample(roomMoods),
    seedName,
    map,
    player: getSpawnPlayer(player),
    enemies,
    gateUnlocked: false,
    openingStrikeReady: true,
    pendingRelics: null,
    log: appendLog(log, `Floor ${floor}. ${sample(roomNames)} opens ahead.`, 'neutral'),
    status: 'playing',
    turn: 1,
  }
}

export const createInitialGameState = (): GameState => {
  const seedName = `${sample(runNamesFirst)} ${sample(runNamesLast)}`
  const player: PlayerState = {
    position: { ...START_POSITION },
    hp: 24,
    maxHp: 24,
    attack: 5,
    armor: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 12,
    flasks: 2,
    maxFlasks: 2,
    potionPower: 10,
    critChance: 0.08,
    lifesteal: 0,
    wardPerFloor: 1,
    ward: 1,
    openingStrikeBonus: 0,
    essence: 0,
    relics: [],
  }

  return generateFloorState(
    1,
    player,
    seedName,
    appendLog([], 'A fresh descent begins beneath the garden.', 'neutral')
  )
}

const canMoveTo = (
  map: TileType[][],
  position: Position,
  enemies: Enemy[],
  playerPosition: Position
) => {
  if (position.x < 0 || position.x >= GRID_SIZE || position.y < 0 || position.y >= GRID_SIZE) {
    return false
  }

  if (map[position.y][position.x] === 'wall') {
    return false
  }

  if (playerPosition.x === position.x && playerPosition.y === position.y) {
    return false
  }

  return findEnemyIndex(enemies, position) === -1
}

const stepEnemyTowardPlayer = (
  enemy: Enemy,
  playerPosition: Position,
  map: TileType[][],
  enemies: Enemy[]
) => {
  const dx = playerPosition.x - enemy.position.x
  const dy = playerPosition.y - enemy.position.y
  const options =
    Math.abs(dx) >= Math.abs(dy)
      ? [
          { x: enemy.position.x + Math.sign(dx), y: enemy.position.y },
          { x: enemy.position.x, y: enemy.position.y + Math.sign(dy) },
        ]
      : [
          { x: enemy.position.x, y: enemy.position.y + Math.sign(dy) },
          { x: enemy.position.x + Math.sign(dx), y: enemy.position.y },
        ]

  for (const option of options) {
    if (
      canMoveTo(
        map,
        option,
        enemies.filter((candidate) => candidate.id !== enemy.id),
        playerPosition
      )
    ) {
      return option
    }
  }

  return enemy.position
}

const runEnemyTurn = (state: GameState): GameState => {
  let nextPlayer = { ...state.player }
  const nextEnemies = state.enemies.map((enemy) => ({ ...enemy, position: { ...enemy.position } }))
  let nextLog = state.log

  for (let i = 0; i < nextEnemies.length; i += 1) {
    const enemy = nextEnemies[i]

    if (isAdjacent(enemy.position, nextPlayer.position)) {
      if (nextPlayer.ward > 0) {
        nextPlayer = { ...nextPlayer, ward: nextPlayer.ward - 1 }
        nextLog = appendLog(nextLog, `${enemy.name} strikes, but your ward holds.`, 'good')
        continue
      }

      const damage = Math.max(1, enemy.attack + randomInt(0, 1) - nextPlayer.armor)
      nextPlayer = { ...nextPlayer, hp: nextPlayer.hp - damage }
      nextLog = appendLog(nextLog, `${enemy.name} hits for ${damage}.`, 'bad')

      if (nextPlayer.hp <= 0) {
        return {
          ...state,
          player: { ...nextPlayer, hp: 0 },
          enemies: nextEnemies,
          log: appendLog(nextLog, 'The Depths close over your run.', 'bad'),
          status: 'lost',
        }
      }

      continue
    }

    const moved = stepEnemyTowardPlayer(enemy, nextPlayer.position, state.map, nextEnemies)
    nextEnemies[i] = { ...enemy, position: moved }
  }

  return {
    ...state,
    player: nextPlayer,
    enemies: nextEnemies,
    log: nextLog,
    turn: state.turn + 1,
  }
}

const completeKill = (
  state: GameState,
  defeatedEnemy: Enemy,
  remainingEnemies: Enemy[],
  log: CombatLogEntry[],
  player: PlayerState
) => {
  const nextPlayer = {
    ...player,
    xp: player.xp + defeatedEnemy.xp,
    essence: player.essence + defeatedEnemy.essence,
  }
  const levelResult = resolveLevelUps(nextPlayer, log)
  const gateUnlocked = remainingEnemies.length === 0
  let nextLog = appendLog(
    levelResult.log,
    `${defeatedEnemy.name} falls. +${defeatedEnemy.xp} XP, +${defeatedEnemy.essence} essence.`,
    'good'
  )

  if (gateUnlocked) {
    nextLog = appendLog(nextLog, 'The descent gate unlocks. Step onto it to claim a relic.', 'good')
  }

  return {
    ...state,
    player: levelResult.player,
    enemies: remainingEnemies,
    gateUnlocked,
    log: nextLog,
  }
}

const performAttack = (state: GameState, enemyIndex: number) => {
  const target = state.enemies[enemyIndex]
  const crit = Math.random() < state.player.critChance
  const damageVariance = randomInt(0, 2)
  const openingBonus = state.openingStrikeReady ? state.player.openingStrikeBonus : 0
  const damage = state.player.attack + damageVariance + openingBonus + (crit ? 3 : 0)
  const healed = Math.min(state.player.maxHp - state.player.hp, state.player.lifesteal)
  const nextEnemy = { ...target, hp: target.hp - damage }
  const nextPlayer = {
    ...state.player,
    hp: state.player.hp + healed,
  }
  let nextLog = appendLog(
    state.log,
    `${crit ? 'Critical strike. ' : ''}You hit ${target.name} for ${damage}.`,
    'good'
  )

  if (healed > 0) {
    nextLog = appendLog(nextLog, `Grave Salt restores ${healed} HP.`, 'good')
  }

  const nextState = {
    ...state,
    player: nextPlayer,
    openingStrikeReady: false,
    log: nextLog,
  }

  if (nextEnemy.hp <= 0) {
    const remainingEnemies = state.enemies.filter((_, index) => index !== enemyIndex)
    return completeKill(nextState, target, remainingEnemies, nextLog, nextPlayer)
  }

  const updatedEnemies = state.enemies.map((enemy, index) =>
    index === enemyIndex ? nextEnemy : enemy
  )

  return {
    ...nextState,
    enemies: updatedEnemies,
  }
}

const maybeUseShrine = (state: GameState) => {
  const tile = state.map[state.player.position.y][state.player.position.x]

  if (tile !== 'shrine') {
    return state
  }

  const healing = Math.min(6, state.player.maxHp - state.player.hp)
  const nextMap = state.map.map((row) => [...row])
  nextMap[state.player.position.y][state.player.position.x] = 'floor'

  return {
    ...state,
    map: nextMap,
    player: {
      ...state.player,
      hp: state.player.hp + healing,
    },
    log: appendLog(
      state.log,
      healing > 0 ? `The shrine mends ${healing} HP.` : 'The shrine flares, but you are already whole.',
      'good'
    ),
  }
}

export const movePlayer = (state: GameState, dx: number, dy: number): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  const target = {
    x: state.player.position.x + dx,
    y: state.player.position.y + dy,
  }

  if (target.x < 0 || target.x >= GRID_SIZE || target.y < 0 || target.y >= GRID_SIZE) {
    return state
  }

  const targetTile = state.map[target.y][target.x]

  if (targetTile === 'wall') {
    return {
      ...state,
      log: appendLog(state.log, 'Stone answers with silence.', 'neutral'),
    }
  }

  if (targetTile === 'exit') {
    if (!state.gateUnlocked) {
      return {
        ...state,
        log: appendLog(state.log, 'The gate is sealed until the chamber is cleared.', 'neutral'),
      }
    }

    if (state.floor >= state.finalFloor) {
      return {
        ...state,
        status: 'won',
        log: appendLog(state.log, 'You surface with the Depths behind you.', 'good'),
      }
    }

    return {
      ...state,
      pendingRelics: drawRelics(state.player.relics),
      log: appendLog(state.log, 'Choose one relic before descending.', 'good'),
    }
  }

  const enemyIndex = findEnemyIndex(state.enemies, target)

  if (enemyIndex >= 0) {
    return runEnemyTurn(performAttack(state, enemyIndex))
  }

  const movedState = maybeUseShrine({
    ...state,
    player: {
      ...state.player,
      position: target,
    },
    openingStrikeReady: state.openingStrikeReady,
  })

  return runEnemyTurn(movedState)
}

export const waitTurn = (state: GameState): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  return runEnemyTurn({
    ...state,
    log: appendLog(state.log, 'You steady your footing and wait.', 'neutral'),
  })
}

export const drinkFlask = (state: GameState): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  if (state.player.flasks <= 0) {
    return {
      ...state,
      log: appendLog(state.log, 'Your flasks are dry.', 'neutral'),
    }
  }

  if (state.player.hp >= state.player.maxHp) {
    return {
      ...state,
      log: appendLog(state.log, 'You are already at full strength.', 'neutral'),
    }
  }

  const healing = Math.min(state.player.potionPower, state.player.maxHp - state.player.hp)

  return runEnemyTurn({
    ...state,
    player: {
      ...state.player,
      hp: state.player.hp + healing,
      flasks: state.player.flasks - 1,
    },
    log: appendLog(state.log, `You drink from a flask and recover ${healing} HP.`, 'good'),
  })
}

export const chooseRelic = (state: GameState, relicId: RelicId): GameState => {
  if (!state.pendingRelics) {
    return state
  }

  const relic = relicCatalog.find((entry) => entry.id === relicId)

  if (!relic) {
    return state
  }

  const empoweredPlayer = applyRelic(state.player, relicId)

  return generateFloorState(
    state.floor + 1,
    empoweredPlayer,
    state.seedName,
    appendLog(state.log, `${relic.name} joins your run.`, 'good')
  )
}
