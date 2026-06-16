export const GRID_SIZE = 19
export const FINAL_FLOOR = 5

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
  speed: number
  attackCooldownMs: number
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
  moveSpeed: number
  attackRange: number
  attackCooldownMs: number
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
  startTile: Position
  exitTile: Position
}

interface Room {
  x: number
  y: number
  w: number
  h: number
}

const roomNames = [
  'The Verdigris Causeway',
  'Mosswake Concourse',
  'The Rootglass Vault',
  'Cinderbloom Galleries',
  'The Iron Orchard',
  'The Reliquary Run',
]

const roomMoods = [
  'Stone corridors braid between drowned rooms and old green fire.',
  'Lantern light skates across pillars cut into the bedrock.',
  'Every corner feels built for an ambush and a ceremony.',
  'Moist air carries the scent of rust, moss, and warm dust.',
  'The floor hums underfoot as if the dungeon is waking with you.',
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
  {
    name: string
    glyph: string
    hp: number
    attack: number
    xp: number
    essence: number
    speed: number
    attackCooldownMs: number
  }
> = {
  mossling: {
    name: 'Mossling',
    glyph: 'M',
    hp: 10,
    attack: 3,
    xp: 5,
    essence: 4,
    speed: 1.8,
    attackCooldownMs: 1150,
  },
  wisp: {
    name: 'Ash Wisp',
    glyph: 'W',
    hp: 8,
    attack: 4,
    xp: 6,
    essence: 5,
    speed: 2.2,
    attackCooldownMs: 950,
  },
  sentinel: {
    name: 'Root Sentinel',
    glyph: 'S',
    hp: 16,
    attack: 6,
    xp: 9,
    essence: 8,
    speed: 1.7,
    attackCooldownMs: 1350,
  },
  knight: {
    name: 'Briar Knight',
    glyph: 'K',
    hp: 22,
    attack: 8,
    xp: 13,
    essence: 11,
    speed: 1.95,
    attackCooldownMs: 1200,
  },
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const sample = <T,>(items: T[]) => items[randomInt(0, items.length - 1)]

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index)
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  return copy
}

const samePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y

const appendLog = (
  entries: CombatLogEntry[],
  text: string,
  tone: CombatLogEntry['tone'] = 'neutral'
) => [{ id: `${Date.now()}-${Math.random()}`, text, tone }, ...entries].slice(0, 8)

const createFilledMap = () =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 'wall')
  ) as TileType[][]

const carveRoom = (map: TileType[][], room: Room) => {
  for (let y = room.y; y < room.y + room.h; y += 1) {
    for (let x = room.x; x < room.x + room.w; x += 1) {
      if (x > 0 && y > 0 && x < GRID_SIZE - 1 && y < GRID_SIZE - 1) {
        map[y][x] = 'floor'
      }
    }
  }
}

const roomCenter = (room: Room): Position => ({
  x: Math.floor(room.x + room.w / 2),
  y: Math.floor(room.y + room.h / 2),
})

const carveCorridor = (
  map: TileType[][],
  from: Position,
  to: Position,
  horizontalFirst: boolean
) => {
  let currentX = from.x
  let currentY = from.y

  const carveStep = (x: number, y: number) => {
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        const tileX = x + offsetX
        const tileY = y + offsetY

        if (tileX > 0 && tileY > 0 && tileX < GRID_SIZE - 1 && tileY < GRID_SIZE - 1) {
          if (Math.abs(offsetX) + Math.abs(offsetY) <= 1) {
            map[tileY][tileX] = 'floor'
          }
        }
      }
    }
  }

  carveStep(currentX, currentY)

  const walkAxis = (axis: 'x' | 'y') => {
    while ((axis === 'x' ? currentX : currentY) !== (axis === 'x' ? to.x : to.y)) {
      if (axis === 'x') {
        currentX += Math.sign(to.x - currentX)
      } else {
        currentY += Math.sign(to.y - currentY)
      }
      carveStep(currentX, currentY)
    }
  }

  if (horizontalFirst) {
    walkAxis('x')
    walkAxis('y')
  } else {
    walkAxis('y')
    walkAxis('x')
  }
}

const generateRooms = (): Room[] => {
  const startRoom: Room = {
    x: Math.floor(GRID_SIZE / 2) - 3,
    y: GRID_SIZE - 7,
    w: 7,
    h: 5,
  }

  const exitRoom: Room = {
    x: Math.floor(GRID_SIZE / 2) - 3,
    y: 2,
    w: 7,
    h: 5,
  }

  const midRooms = [
    {
      x: randomInt(2, 4),
      y: randomInt(8, 10),
      w: randomInt(4, 6),
      h: randomInt(4, 5),
    },
    {
      x: randomInt(11, 13),
      y: randomInt(10, 12),
      w: randomInt(4, 6),
      h: randomInt(4, 5),
    },
    {
      x: randomInt(6, 10),
      y: randomInt(6, 8),
      w: randomInt(4, 5),
      h: randomInt(4, 5),
    },
  ]

  return [startRoom, ...midRooms, exitRoom]
}

const getFloorTiles = (map: TileType[][]) => {
  const floorTiles: Position[] = []

  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile !== 'wall') {
        floorTiles.push({ x, y })
      }
    })
  })

  return floorTiles
}

const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

const createFloorLayout = (floor: number) => {
  const map = createFilledMap()
  const rooms = generateRooms()

  rooms.forEach((room) => carveRoom(map, room))

  for (let index = 0; index < rooms.length - 1; index += 1) {
    carveCorridor(
      map,
      roomCenter(rooms[index]),
      roomCenter(rooms[index + 1]),
      Math.random() > 0.5
    )
  }

  if (floor >= 3) {
    const sideRoom: Room = {
      x: randomInt(2, 13),
      y: randomInt(6, 11),
      w: randomInt(3, 4),
      h: randomInt(3, 4),
    }

    carveRoom(map, sideRoom)
    carveCorridor(
      map,
      roomCenter(sideRoom),
      roomCenter(sample(rooms.slice(1, -1))),
      Math.random() > 0.5
    )
  }

  const startTile = roomCenter(rooms[0])
  const exitTile = roomCenter(rooms[rooms.length - 1])
  map[exitTile.y][exitTile.x] = 'exit'

  if (floor % 2 === 1) {
    const shrineCandidates = getFloorTiles(map).filter(
      (tile) =>
        map[tile.y][tile.x] === 'floor' &&
        manhattanDistance(tile, startTile) > 4 &&
        manhattanDistance(tile, exitTile) > 3
    )

    const shrineTile = sample(shrineCandidates)
    map[shrineTile.y][shrineTile.x] = 'shrine'
  }

  return { map, startTile, exitTile }
}

const enemyPoolForFloor = (floor: number): EnemyKind[] => {
  if (floor >= FINAL_FLOOR) {
    return ['wisp', 'sentinel', 'knight', 'knight']
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

const createEnemy = (kind: EnemyKind, floor: number, position: Position, index: number): Enemy => {
  const blueprint = enemyBlueprints[kind]
  const hpBoost = floor > 2 ? (floor - 2) * 2 : 0
  const attackBoost = floor > 3 ? floor - 3 : 0

  return {
    id: `${kind}-${floor}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    name: blueprint.name,
    glyph: blueprint.glyph,
    hp: blueprint.hp + hpBoost,
    maxHp: blueprint.hp + hpBoost,
    attack: blueprint.attack + attackBoost,
    xp: blueprint.xp + floor - 1,
    essence: blueprint.essence + floor - 1,
    speed: blueprint.speed + floor * 0.05,
    attackCooldownMs: Math.max(700, blueprint.attackCooldownMs - floor * 25),
    position,
  }
}

const createEnemies = (
  map: TileType[][],
  floor: number,
  startTile: Position,
  exitTile: Position
) => {
  const candidates = shuffle(
    getFloorTiles(map).filter(
      (tile) =>
        map[tile.y][tile.x] === 'floor' &&
        manhattanDistance(tile, startTile) > 4 &&
        manhattanDistance(tile, exitTile) > 2
    )
  )
  const count = clamp(floor + 3, 4, 8)
  const pool = enemyPoolForFloor(floor)

  return Array.from({ length: count }, (_, index) =>
    createEnemy(sample(pool), floor, candidates[index], index)
  )
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
      moveSpeed: nextPlayer.moveSpeed + 0.08,
    }

    nextLog = appendLog(
      nextLog,
      `Level ${nextPlayer.level}. Your footwork sharpens and the blade grows lighter.`,
      'good'
    )
  }

  return { player: nextPlayer, log: nextLog }
}

const generateFloorState = (
  floor: number,
  player: PlayerState,
  seedName: string,
  log: CombatLogEntry[]
): GameState => {
  const { map, startTile, exitTile } = createFloorLayout(floor)
  const enemies = createEnemies(map, floor, startTile, exitTile)

  return {
    floor,
    finalFloor: FINAL_FLOOR,
    roomName: sample(roomNames),
    roomMood: sample(roomMoods),
    seedName,
    map,
    player: {
      ...player,
      position: startTile,
      ward: player.wardPerFloor,
    },
    enemies,
    gateUnlocked: false,
    openingStrikeReady: true,
    pendingRelics: null,
    log: appendLog(log, `Floor ${floor}. ${sample(roomNames)} yawns open below.`, 'neutral'),
    status: 'playing',
    startTile,
    exitTile,
  }
}

export const createInitialGameState = (): GameState => {
  const seedName = `${sample(runNamesFirst)} ${sample(runNamesLast)}`
  const player: PlayerState = {
    position: { x: 0, y: 0 },
    hp: 28,
    maxHp: 28,
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
    moveSpeed: 3.4,
    attackRange: 1.15,
    attackCooldownMs: 520,
  }

  return generateFloorState(
    1,
    player,
    seedName,
    appendLog([], 'You descend into the first corridor as spores wake in the dark.', 'neutral')
  )
}

export const isWalkableTile = (map: TileType[][], position: Position) => {
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= map[0].length ||
    position.y >= map.length
  ) {
    return false
  }

  return map[position.y][position.x] !== 'wall'
}

export const getTile = (map: TileType[][], position: Position) => {
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= map[0].length ||
    position.y >= map.length
  ) {
    return 'wall' as TileType
  }

  return map[position.y][position.x]
}

export const touchTile = (state: GameState, tilePosition: Position): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  const tile = getTile(state.map, tilePosition)
  const nextPlayer = {
    ...state.player,
    position: tilePosition,
  }

  if (tile === 'shrine') {
    const healing = Math.min(7, state.player.maxHp - state.player.hp)
    const nextMap = state.map.map((row) => [...row])
    nextMap[tilePosition.y][tilePosition.x] = 'floor'

    return {
      ...state,
      map: nextMap,
      player: {
        ...nextPlayer,
        hp: state.player.hp + healing,
      },
      log: appendLog(
        state.log,
        healing > 0
          ? `The shrine floods your chest with warmth. +${healing} HP.`
          : 'The shrine sparks against your armor, but you are already whole.',
        'good'
      ),
    }
  }

  if (tile === 'exit') {
    if (!state.gateUnlocked) {
      return state
    }

    if (state.floor >= state.finalFloor) {
      return {
        ...state,
        status: 'won',
        log: appendLog(state.log, 'You break back into moonlight with the Depths behind you.', 'good'),
      }
    }

    return {
      ...state,
      player: nextPlayer,
      pendingRelics: drawRelics(state.player.relics),
      log: appendLog(state.log, 'The gate opens into a relic chamber. Choose what follows you down.', 'good'),
    }
  }

  if (samePosition(state.player.position, tilePosition)) {
    return state
  }

  return {
    ...state,
    player: nextPlayer,
  }
}

export const attackEnemy = (state: GameState, enemyId: string): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  const enemyIndex = state.enemies.findIndex((enemy) => enemy.id === enemyId)

  if (enemyIndex === -1) {
    return state
  }

  const target = state.enemies[enemyIndex]
  const crit = Math.random() < state.player.critChance
  const openingBonus = state.openingStrikeReady ? state.player.openingStrikeBonus : 0
  const damage = state.player.attack + randomInt(0, 2) + openingBonus + (crit ? 4 : 0)
  const healed = Math.min(state.player.maxHp - state.player.hp, state.player.lifesteal)
  const nextEnemy = { ...target, hp: target.hp - damage }
  let nextLog = appendLog(
    state.log,
    `${crit ? 'Critical strike. ' : ''}You carve ${damage} damage into ${target.name}.`,
    'good'
  )

  if (healed > 0) {
    nextLog = appendLog(nextLog, `Grave Salt restores ${healed} HP.`, 'good')
  }

  let nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      hp: state.player.hp + healed,
    },
    openingStrikeReady: false,
    log: nextLog,
  }

  if (nextEnemy.hp <= 0) {
    const playerAfterKill = {
      ...nextState.player,
      xp: nextState.player.xp + target.xp,
      essence: nextState.player.essence + target.essence,
    }
    const levelResult = resolveLevelUps(playerAfterKill, nextLog)
    const remainingEnemies = state.enemies.filter((enemy) => enemy.id !== enemyId)
    const gateUnlocked = remainingEnemies.length === 0

    nextLog = appendLog(
      levelResult.log,
      `${target.name} breaks apart. +${target.xp} XP, +${target.essence} essence.`,
      'good'
    )

    if (gateUnlocked) {
      nextLog = appendLog(nextLog, 'The descent gate unlocks. Push deeper when ready.', 'good')
    }

    nextState = {
      ...nextState,
      player: levelResult.player,
      enemies: remainingEnemies,
      gateUnlocked,
      log: nextLog,
    }
  } else {
    nextState = {
      ...nextState,
      enemies: state.enemies.map((enemy) => (enemy.id === enemyId ? nextEnemy : enemy)),
    }
  }

  return nextState
}

export const receiveEnemyAttack = (state: GameState, enemyId: string): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  const enemy = state.enemies.find((entry) => entry.id === enemyId)

  if (!enemy) {
    return state
  }

  if (state.player.ward > 0) {
    return {
      ...state,
      player: {
        ...state.player,
        ward: state.player.ward - 1,
      },
      log: appendLog(state.log, `${enemy.name} crashes into your ward.`, 'good'),
    }
  }

  const damage = Math.max(1, enemy.attack + randomInt(0, 1) - state.player.armor)
  const nextHp = state.player.hp - damage
  const nextLog = appendLog(state.log, `${enemy.name} hits for ${damage}.`, 'bad')

  if (nextHp <= 0) {
    return {
      ...state,
      player: {
        ...state.player,
        hp: 0,
      },
      log: appendLog(nextLog, 'The Depths close over your run.', 'bad'),
      status: 'lost',
    }
  }

  return {
    ...state,
    player: {
      ...state.player,
      hp: nextHp,
    },
    log: nextLog,
  }
}

export const drinkFlask = (state: GameState): GameState => {
  if (state.status !== 'playing' || state.pendingRelics) {
    return state
  }

  if (state.player.flasks <= 0 || state.player.hp >= state.player.maxHp) {
    return state
  }

  const healing = Math.min(state.player.potionPower, state.player.maxHp - state.player.hp)

  return {
    ...state,
    player: {
      ...state.player,
      hp: state.player.hp + healing,
      flasks: state.player.flasks - 1,
    },
    log: appendLog(state.log, `You drink from a flask and recover ${healing} HP.`, 'good'),
  }
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
    appendLog(state.log, `${relic.name} settles into the run.`, 'good')
  )
}
