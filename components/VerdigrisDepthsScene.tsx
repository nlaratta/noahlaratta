import { ContactShadows, OrbitControls, PerspectiveCamera, Sparkles, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { type MutableRefObject, useEffect, useRef, useState } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Group, MathUtils, MeshStandardMaterial, Vector3 } from 'three'
import type { Enemy, GameState, Position, TileType } from '../lib/verdigrisDepths'

interface VerdigrisDepthsSceneProps {
  game: GameState
  onAttackEnemy: (enemyId: string) => void
  onEnemyAttack: (enemyId: string) => void
  onTouchTile: (position: Position) => void
  onDrinkFlask: () => void
  onRestartRun: () => void
}

interface EffectEntry {
  id: string
  kind: 'slash' | 'burst' | 'ward' | 'player-hit'
  position: [number, number, number]
  color: string
}

interface EnemyMotionState {
  x: number
  z: number
  rotation: number
  nextPathAt: number
  nextAttackAt: number
  pathTarget: Position | null
}

const floorColors: Record<TileType, string> = {
  floor: '#1f2937',
  wall: '#102114',
  exit: '#7c2d12',
  shrine: '#0f3f4c',
}

const enemyColors: Record<Enemy['kind'], { base: string; glow: string }> = {
  mossling: { base: '#22c55e', glow: '#86efac' },
  wisp: { base: '#8b5cf6', glow: '#c4b5fd' },
  sentinel: { base: '#38bdf8', glow: '#7dd3fc' },
  knight: { base: '#fb7185', glow: '#fda4af' },
}

const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

const tileKey = (position: Position) => `${position.x},${position.y}`

const isWalkableTile = (map: TileType[][], position: Position) =>
  position.x >= 0 &&
  position.y >= 0 &&
  position.y < map.length &&
  position.x < map[0].length &&
  map[position.y][position.x] !== 'wall'

const samePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y

const toWorld = (position: Position, mapSize: number) => {
  const offset = (mapSize - 1) / 2

  return {
    x: position.x - offset,
    z: position.y - offset,
  }
}

const worldToTile = (x: number, z: number, mapSize: number): Position => {
  const offset = (mapSize - 1) / 2

  return {
    x: Math.round(x + offset),
    y: Math.round(z + offset),
  }
}

const canOccupy = (
  map: TileType[][],
  x: number,
  z: number,
  radius: number
) => {
  const mapSize = map.length
  const samples = [
    { x, z },
    { x: x + radius, z },
    { x: x - radius, z },
    { x, z: z + radius },
    { x, z: z - radius },
    { x: x + radius, z: z + radius },
    { x: x - radius, z: z - radius },
    { x: x + radius, z: z - radius },
    { x: x - radius, z: z + radius },
  ]

  return samples.every((sample) => isWalkableTile(map, worldToTile(sample.x, sample.z, mapSize)))
}

const getNextPathStep = (map: TileType[][], start: Position, goal: Position) => {
  if (samePosition(start, goal)) {
    return start
  }

  const queue: Position[] = [start]
  const seen = new Set([tileKey(start)])
  const previous = new Map<string, Position>()

  while (queue.length > 0) {
    const current = queue.shift()

    if (!current) {
      break
    }

    if (samePosition(current, goal)) {
      break
    }

    for (const direction of directions) {
      const next = {
        x: current.x + direction.x,
        y: current.y + direction.y,
      }
      const nextKey = tileKey(next)

      if (!isWalkableTile(map, next) || seen.has(nextKey)) {
        continue
      }

      seen.add(nextKey)
      previous.set(nextKey, current)
      queue.push(next)
    }
  }

  const goalKey = tileKey(goal)

  if (!previous.has(goalKey)) {
    return start
  }

  let current = goal
  let parent = previous.get(goalKey)

  while (parent && !samePosition(parent, start)) {
    current = parent
    parent = previous.get(tileKey(parent))
  }

  return current
}

function EffectSprite({
  effect,
  onDone,
}: {
  effect: EffectEntry
  onDone: (id: string) => void
}) {
  const group = useRef<Group>(null)
  const createdAt = useRef(performance.now())
  const done = useRef(false)
  const durationMs =
    effect.kind === 'burst' ? 650 : effect.kind === 'player-hit' ? 320 : 240

  useFrame(() => {
    if (!group.current) {
      return
    }

    const elapsed = performance.now() - createdAt.current
    const progress = Math.min(elapsed / durationMs, 1)

    if (effect.kind === 'slash') {
      group.current.scale.setScalar(0.75 + progress * 1.2)
      group.current.rotation.y += 0.35
      group.current.position.y = effect.position[1] + progress * 0.3
    } else if (effect.kind === 'burst') {
      group.current.rotation.y += 0.18
      group.current.scale.setScalar(0.7 + progress * 1.7)
    } else {
      group.current.scale.setScalar(0.7 + progress * 1.4)
    }

    if (progress >= 1 && !done.current) {
      done.current = true
      onDone(effect.id)
    }
  })

  if (effect.kind === 'burst') {
    return (
      <group ref={group} position={effect.position}>
        {Array.from({ length: 10 }, (_, index) => (
          <mesh
            key={`${effect.id}-${index}`}
            position={[
              Math.cos((index / 10) * Math.PI * 2) * 0.25,
              (index % 3) * 0.08,
              Math.sin((index / 10) * Math.PI * 2) * 0.25,
            ]}
          >
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={effect.color} emissive={effect.color} emissiveIntensity={0.9} />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <group ref={group} position={effect.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.045, 12, 30]} />
        <meshStandardMaterial color={effect.color} emissive={effect.color} emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

function TorchSconce({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 10]} />
        <meshStandardMaterial color="#a16207" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 0.65, 0]} intensity={0.75} distance={2.4} color="#fdba74" />
    </group>
  )
}

function DungeonGeometry({
  game,
}: {
  game: GameState
}) {
  const mapSize = game.map.length

  return (
    <>
      {game.map.flatMap((row, y) =>
        row.map((tile, x) => {
          const world = toWorld({ x, y }, mapSize)
          const adjacentFloor = directions.some((direction) =>
            isWalkableTile(game.map, { x: x + direction.x, y: y + direction.y })
          )
          const torchHere = tile === 'wall' && adjacentFloor && (x * 13 + y * 7) % 11 === 0
          const floorHeight = ((x * 5 + y * 3) % 4) * 0.015

          if (tile === 'wall') {
            return (
              <group key={`${x}-${y}`} position={[world.x, 0, world.z]}>
                <mesh castShadow receiveShadow position={[0, 1.15, 0]}>
                  <boxGeometry args={[1, 2.35, 1]} />
                  <meshStandardMaterial color={floorColors.wall} roughness={0.95} />
                </mesh>
                <mesh castShadow position={[0, 2.38, 0]}>
                  <boxGeometry args={[0.92, 0.14, 0.92]} />
                  <meshStandardMaterial color="#1e3a29" roughness={0.8} />
                </mesh>
                {torchHere && <TorchSconce position={[0, 0.4, 0]} />}
              </group>
            )
          }

          return (
            <group key={`${x}-${y}`} position={[world.x, 0, world.z]}>
              <mesh castShadow receiveShadow position={[0, floorHeight, 0]}>
                <boxGeometry args={[1, 0.16, 1]} />
                <meshStandardMaterial
                  color={floorColors[tile]}
                  roughness={0.9}
                  emissive={tile === 'exit' ? '#f59e0b' : tile === 'shrine' ? '#22d3ee' : '#0f172a'}
                  emissiveIntensity={tile === 'floor' ? 0.04 : 0.16}
                />
              </mesh>

              {tile === 'exit' && (
                <>
                  <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.32, 0.07, 12, 36]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.4} />
                  </mesh>
                  <Sparkles
                    count={8}
                    size={2}
                    scale={[0.9, 0.4, 0.9]}
                    position={[0, 0.3, 0]}
                    speed={0.8}
                    color="#fde68a"
                  />
                </>
              )}

              {tile === 'shrine' && (
                <>
                  <mesh position={[0, 0.18, 0]}>
                    <cylinderGeometry args={[0.18, 0.22, 0.24, 8]} />
                    <meshStandardMaterial color="#164e63" />
                  </mesh>
                  <mesh position={[0, 0.56, 0]} rotation={[0.2, 0.4, 0]}>
                    <octahedronGeometry args={[0.18]} />
                    <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.2} />
                  </mesh>
                  <Sparkles
                    count={12}
                    size={2}
                    scale={[0.7, 0.6, 0.7]}
                    position={[0, 0.58, 0]}
                    speed={0.8}
                    color="#a5f3fc"
                  />
                </>
              )}
            </group>
          )
        })
      )}
    </>
  )
}

function PlayerActor({
  motionRef,
  attackUntilRef,
  hitPulseUntil,
  wardPulseUntil,
}: {
  motionRef: MutableRefObject<{ x: number; z: number; rotation: number }>
  attackUntilRef: MutableRefObject<number>
  hitPulseUntil: number
  wardPulseUntil: number
}) {
  const group = useRef<Group>(null)
  const bodyMaterial = useRef<MeshStandardMaterial | null>(null)

  useFrame((_, delta) => {
    if (!group.current) {
      return
    }

    const now = performance.now()
    const attackPulse = now < attackUntilRef.current ? 1 - (attackUntilRef.current - now) / 220 : 0

    group.current.position.x = MathUtils.lerp(group.current.position.x, motionRef.current.x, delta * 10)
    group.current.position.z = MathUtils.lerp(group.current.position.z, motionRef.current.z, delta * 10)
    group.current.position.y = 0.22 + Math.sin(now * 0.004) * 0.035
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, motionRef.current.rotation, delta * 12)
    group.current.rotation.z = attackPulse > 0 ? Math.sin(attackPulse * Math.PI) * -0.18 : 0

    if (bodyMaterial.current) {
      if (hitPulseUntil > now) {
        bodyMaterial.current.emissive.set('#fb7185')
        bodyMaterial.current.emissiveIntensity = 0.95
      } else if (wardPulseUntil > now) {
        bodyMaterial.current.emissive.set('#7dd3fc')
        bodyMaterial.current.emissiveIntensity = 0.78
      } else {
        bodyMaterial.current.emissive.set('#34d399')
        bodyMaterial.current.emissiveIntensity = 0.42
      }
    }
  })

  return (
    <group ref={group} position={[0, 0.22, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.2, 0.52, 6, 12]} />
        <meshStandardMaterial ref={bodyMaterial} color="#ecfccb" emissive="#34d399" emissiveIntensity={0.42} />
      </mesh>
      <mesh castShadow position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.16, 18, 18]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh castShadow position={[0.24, 0.2, -0.04]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.08, 0.58, 0.08]} />
        <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[0, 0.75, 0]} intensity={1.15} distance={3.2} color="#86efac" />
    </group>
  )
}

function EnemyActor({
  enemy,
  mapSize,
  motionRef,
  flashUntil,
  onClick,
}: {
  enemy: Enemy
  mapSize: number
  motionRef: MutableRefObject<Record<string, EnemyMotionState>>
  flashUntil: number
  onClick: () => void
}) {
  const group = useRef<Group>(null)
  const materialRef = useRef<MeshStandardMaterial | null>(null)
  const palette = enemyColors[enemy.kind]

  useFrame((_, delta) => {
    if (!group.current) {
      return
    }

    const motion = motionRef.current[enemy.id]

    if (!motion) {
      return
    }

    group.current.position.x = MathUtils.lerp(group.current.position.x, motion.x, delta * 9)
    group.current.position.z = MathUtils.lerp(group.current.position.z, motion.z, delta * 9)
    group.current.position.y = 0.16 + Math.sin(performance.now() * 0.003 + enemy.position.x + enemy.position.y) * 0.05
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, motion.rotation, delta * 10)

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = flashUntil > performance.now() ? 1.4 : 0.7
    }
  })

  return (
    <group ref={group} position={[toWorld(enemy.position, mapSize).x, 0.16, toWorld(enemy.position, mapSize).z]} onClick={onClick}>
      <mesh castShadow>
        {enemy.kind === 'wisp' ? (
          <sphereGeometry args={[0.22, 18, 18]} />
        ) : enemy.kind === 'sentinel' ? (
          <boxGeometry args={[0.46, 0.68, 0.46]} />
        ) : enemy.kind === 'knight' ? (
          <coneGeometry args={[0.3, 0.78, 6]} />
        ) : (
          <dodecahedronGeometry args={[0.24, 0]} />
        )}
        <meshStandardMaterial
          ref={materialRef}
          color={palette.base}
          emissive={palette.glow}
          emissiveIntensity={0.7}
          roughness={0.42}
          metalness={0.22}
        />
      </mesh>
      <mesh castShadow position={[0, enemy.kind === 'knight' ? 0.58 : 0.45, 0]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#ffffff" emissive={palette.glow} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function SceneRuntime({
  game,
  onAttackEnemy,
  onEnemyAttack,
  onTouchTile,
  onDrinkFlask,
  onRestartRun,
  setHoveredLabel,
}: VerdigrisDepthsSceneProps & {
  setHoveredLabel: (value: string) => void
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const movementRef = useRef({ forward: false, backward: false, left: false, right: false })
  const playerMotionRef = useRef({ x: 0, z: 0, rotation: 0 })
  const enemyMotionRef = useRef<Record<string, EnemyMotionState>>({})
  const playerAttackUntilRef = useRef(0)
  const playerAttackReadyAtRef = useRef(0)
  const lastTileRef = useRef(game.player.position)
  const attackHandlerRef = useRef<(preferredEnemyId?: string) => void>(() => {})
  const drinkHandlerRef = useRef<() => void>(() => {})
  const restartHandlerRef = useRef<() => void>(() => {})
  const [effects, setEffects] = useState<EffectEntry[]>([])
  const [enemyFlashUntil, setEnemyFlashUntil] = useState<Record<string, number>>({})
  const [playerHitPulseUntil, setPlayerHitPulseUntil] = useState(0)
  const [wardPulseUntil, setWardPulseUntil] = useState(0)
  const previousGameRef = useRef<GameState | null>(null)
  const mapSize = game.map.length
  const startTileX = game.startTile.x
  const startTileY = game.startTile.y

  useEffect(() => {
    const startWorld = toWorld({ x: startTileX, y: startTileY }, mapSize)
    playerMotionRef.current = {
      x: startWorld.x,
      z: startWorld.z,
      rotation: playerMotionRef.current.rotation,
    }
    lastTileRef.current = { x: startTileX, y: startTileY }
    playerAttackReadyAtRef.current = 0
    playerAttackUntilRef.current = 0
    enemyMotionRef.current = {}
    previousGameRef.current = null
    setEffects([])
    setEnemyFlashUntil({})
    setHoveredLabel('Run the corridors and strike in melee range')
  }, [game.floor, mapSize, setHoveredLabel, startTileX, startTileY])

  useEffect(() => {
    const activeIds = new Set(game.enemies.map((enemy) => enemy.id))

    game.enemies.forEach((enemy) => {
      if (enemyMotionRef.current[enemy.id]) {
        return
      }

      const world = toWorld(enemy.position, mapSize)
      enemyMotionRef.current[enemy.id] = {
        x: world.x,
        z: world.z,
        rotation: 0,
        nextPathAt: 0,
        nextAttackAt: 0,
        pathTarget: enemy.position,
      }
    })

    Object.keys(enemyMotionRef.current).forEach((enemyId) => {
      if (!activeIds.has(enemyId)) {
        delete enemyMotionRef.current[enemyId]
      }
    })
  }, [game.enemies, mapSize])

  useEffect(() => {
    const previousGame = previousGameRef.current

    if (!previousGame || previousGame.floor !== game.floor) {
      previousGameRef.current = game
      return
    }

    if (game.player.hp < previousGame.player.hp) {
      const now = performance.now()
      setPlayerHitPulseUntil(now + 260)
      const position = playerMotionRef.current
      setEffects((current) => [
        ...current,
        {
          id: `player-hit-${now}`,
          kind: 'player-hit',
          position: [position.x, 0.35, position.z],
          color: '#fb7185',
        },
      ])
    }

    if (game.player.ward < previousGame.player.ward) {
      const now = performance.now()
      setWardPulseUntil(now + 220)
      const position = playerMotionRef.current
      setEffects((current) => [
        ...current,
        {
          id: `ward-${now}`,
          kind: 'ward',
          position: [position.x, 0.35, position.z],
          color: '#7dd3fc',
        },
      ])
    }

    const nextFlashes: Record<string, number> = {}
    const nextEffects: EffectEntry[] = []

    previousGame.enemies.forEach((enemy) => {
      const currentEnemy = game.enemies.find((entry) => entry.id === enemy.id)
      const motion = enemyMotionRef.current[enemy.id]
      const world = motion
        ? [motion.x, 0.32, motion.z]
        : [toWorld(enemy.position, mapSize).x, 0.32, toWorld(enemy.position, mapSize).z]

      if (currentEnemy && currentEnemy.hp < enemy.hp) {
        const now = performance.now()
        nextFlashes[enemy.id] = now + 180
        nextEffects.push({
          id: `slash-${enemy.id}-${now}`,
          kind: 'slash',
          position: world as [number, number, number],
          color: '#fbbf24',
        })
      }

      if (!currentEnemy) {
        nextEffects.push({
          id: `burst-${enemy.id}-${performance.now()}`,
          kind: 'burst',
          position: world as [number, number, number],
          color: enemyColors[enemy.kind].glow,
        })
      }
    })

    if (Object.keys(nextFlashes).length > 0) {
      setEnemyFlashUntil((current) => ({ ...current, ...nextFlashes }))
    }

    if (nextEffects.length > 0) {
      setEffects((current) => [...current, ...nextEffects])
    }

    previousGameRef.current = game
  }, [game, mapSize])

  const attemptAttack = (preferredEnemyId?: string) => {
    const now = performance.now()

    if (now < playerAttackReadyAtRef.current || game.status !== 'playing' || game.pendingRelics) {
      return
    }

    const candidates = game.enemies
      .map((enemy) => {
        const motion = enemyMotionRef.current[enemy.id]

        if (!motion) {
          return null
        }

        const distance = Math.hypot(
          motion.x - playerMotionRef.current.x,
          motion.z - playerMotionRef.current.z
        )

        return {
          id: enemy.id,
          distance,
        }
      })
      .filter((entry): entry is { id: string; distance: number } => entry !== null)
      .filter((entry) => entry.distance <= game.player.attackRange + 0.2)
      .sort((left, right) => {
        if (preferredEnemyId) {
          if (left.id === preferredEnemyId) {
            return -1
          }

          if (right.id === preferredEnemyId) {
            return 1
          }
        }

        return left.distance - right.distance
      })

    if (!candidates[0]) {
      setHoveredLabel('No enemy in range')
      return
    }

    playerAttackReadyAtRef.current = now + game.player.attackCooldownMs
    playerAttackUntilRef.current = now + 220
    setHoveredLabel('Steel meets stone and root')
    onAttackEnemy(candidates[0].id)
  }

  attackHandlerRef.current = attemptAttack
  drinkHandlerRef.current = onDrinkFlask
  restartHandlerRef.current = onRestartRun

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const key = event.key.toLowerCase()

      if (['w', 'a', 's', 'd', ' ', 'h', 'r'].includes(key)) {
        event.preventDefault()
      }

      if (key === 'w') {
        movementRef.current.forward = true
      } else if (key === 's') {
        movementRef.current.backward = true
      } else if (key === 'a') {
        movementRef.current.left = true
      } else if (key === 'd') {
        movementRef.current.right = true
      } else if (key === ' ') {
        if (!event.repeat) {
          attackHandlerRef.current()
        }
      } else if (key === 'h' && !event.repeat) {
        drinkHandlerRef.current()
      } else if (key === 'r' && !event.repeat) {
        restartHandlerRef.current()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (key === 'w') {
        movementRef.current.forward = false
      } else if (key === 's') {
        movementRef.current.backward = false
      } else if (key === 'a') {
        movementRef.current.left = false
      } else if (key === 'd') {
        movementRef.current.right = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(({ camera }, delta) => {
    const now = performance.now()

    if (controlsRef.current) {
      const target = new Vector3(playerMotionRef.current.x, 0.9, playerMotionRef.current.z)
      controlsRef.current.target.lerp(target, 0.08)
      controlsRef.current.update()
    }

    if (game.status !== 'playing' || game.pendingRelics) {
      return
    }

    const moveX = (movementRef.current.right ? 1 : 0) - (movementRef.current.left ? 1 : 0)
    const moveY = (movementRef.current.forward ? 1 : 0) - (movementRef.current.backward ? 1 : 0)

    if (moveX !== 0 || moveY !== 0) {
      const forward = new Vector3()
      camera.getWorldDirection(forward)
      forward.y = 0
      forward.normalize()

      const right = new Vector3(forward.z, 0, -forward.x)
      const moveDirection = forward.multiplyScalar(moveY).add(right.multiplyScalar(moveX)).normalize()
      const player = playerMotionRef.current
      const speed = game.player.moveSpeed
      const nextX = player.x + moveDirection.x * speed * delta
      const nextZ = player.z + moveDirection.z * speed * delta
      const radius = 0.24

      if (canOccupy(game.map, nextX, player.z, radius)) {
        player.x = nextX
      }

      if (canOccupy(game.map, player.x, nextZ, radius)) {
        player.z = nextZ
      }

      player.rotation = Math.atan2(moveDirection.x, moveDirection.z)
    }

    const currentTile = worldToTile(playerMotionRef.current.x, playerMotionRef.current.z, mapSize)

    if (!samePosition(currentTile, lastTileRef.current)) {
      lastTileRef.current = currentTile
      onTouchTile(currentTile)
    }

    const playerTile = currentTile

    game.enemies.forEach((enemy) => {
      const motion = enemyMotionRef.current[enemy.id]

      if (!motion) {
        const world = toWorld(enemy.position, mapSize)
        enemyMotionRef.current[enemy.id] = {
          x: world.x,
          z: world.z,
          rotation: 0,
          nextPathAt: 0,
          nextAttackAt: 0,
          pathTarget: enemy.position,
        }
        return
      }

      const dx = playerMotionRef.current.x - motion.x
      const dz = playerMotionRef.current.z - motion.z
      const distance = Math.hypot(dx, dz)

      if (distance <= 0.92) {
        motion.rotation = Math.atan2(dx, dz)

        if (now >= motion.nextAttackAt) {
          motion.nextAttackAt = now + enemy.attackCooldownMs
          onEnemyAttack(enemy.id)
          setHoveredLabel(`${enemy.name} lunges from the corridor`)
        }

        return
      }

      const enemyTile = worldToTile(motion.x, motion.z, mapSize)

      if (!motion.pathTarget || now >= motion.nextPathAt || samePosition(enemyTile, motion.pathTarget)) {
        motion.pathTarget = getNextPathStep(game.map, enemyTile, playerTile)
        motion.nextPathAt = now + 260
      }

      const targetWorld = toWorld(motion.pathTarget, mapSize)
      const towardX = targetWorld.x - motion.x
      const towardZ = targetWorld.z - motion.z
      const towardDistance = Math.hypot(towardX, towardZ)

      if (towardDistance > 0.04) {
        const stepX = (towardX / towardDistance) * enemy.speed * delta
        const stepZ = (towardZ / towardDistance) * enemy.speed * delta

        if (canOccupy(game.map, motion.x + stepX, motion.z, 0.2)) {
          motion.x += stepX
        }

        if (canOccupy(game.map, motion.x, motion.z + stepZ, 0.2)) {
          motion.z += stepZ
        }

        motion.rotation = Math.atan2(stepX, stepZ)
      }
    })
  })

  const removeEffect = (id: string) => {
    setEffects((current) => current.filter((effect) => effect.id !== id))
  }

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight intensity={0.48} groundColor="#04160d" color="#bfdbfe" />
      <directionalLight
        castShadow
        position={[6, 12, 5]}
        intensity={1.25}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 3.8, 0]} intensity={0.5} color="#34d399" distance={14} />

      <PerspectiveCamera makeDefault position={[0, 6.8, 7.4]} fov={45} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={4.8}
        maxDistance={9.8}
        minPolarAngle={0.65}
        maxPolarAngle={1.18}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#020617" roughness={1} />
      </mesh>

      <DungeonGeometry game={game} />

      {game.enemies.map((enemy) => (
        <EnemyActor
          key={enemy.id}
          enemy={enemy}
          mapSize={mapSize}
          motionRef={enemyMotionRef}
          flashUntil={enemyFlashUntil[enemy.id] ?? 0}
          onClick={() => attemptAttack(enemy.id)}
        />
      ))}

      <PlayerActor
        motionRef={playerMotionRef}
        attackUntilRef={playerAttackUntilRef}
        hitPulseUntil={playerHitPulseUntil}
        wardPulseUntil={wardPulseUntil}
      />

      {effects.map((effect) => (
        <EffectSprite key={effect.id} effect={effect} onDone={removeEffect} />
      ))}

      <Stars radius={34} depth={18} count={1300} factor={3} saturation={0} fade speed={0.6} />
      <Sparkles count={42} size={2.6} scale={[18, 5, 18]} position={[0, 2, 0]} speed={0.3} color="#86efac" />
      <ContactShadows position={[0, -0.145, 0]} opacity={0.45} scale={18} blur={2.4} far={12} />
    </>
  )
}

export default function VerdigrisDepthsScene({
  game,
  onAttackEnemy,
  onEnemyAttack,
  onTouchTile,
  onDrinkFlask,
  onRestartRun,
}: VerdigrisDepthsSceneProps) {
  const [hoveredLabel, setHoveredLabel] = useState('Hold WASD to move, drag to orbit, press Space to attack')
  const damageFlash = game.status === 'lost'

  return (
    <div className="relative h-[620px] overflow-hidden rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),rgba(2,6,23,0.96)_48%)]">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-emerald-200 backdrop-blur">
          3D Dungeon Run
        </div>
        <div className="max-w-[68%] rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-xs text-slate-300 backdrop-blur">
          {hoveredLabel}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-200 ${
          damageFlash ? 'bg-rose-500/10 opacity-100' : 'opacity-0'
        }`}
      />

      <Canvas shadows dpr={[1, 1.75]}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 8, 20]} />
        <SceneRuntime
          game={game}
          onAttackEnemy={onAttackEnemy}
          onEnemyAttack={onEnemyAttack}
          onTouchTile={onTouchTile}
          onDrinkFlask={onDrinkFlask}
          onRestartRun={onRestartRun}
          setHoveredLabel={setHoveredLabel}
        />
      </Canvas>
    </div>
  )
}
