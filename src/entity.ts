import report from './report'
import { IAbility } from './ability'
import World from './world'
import { IModifier } from './modifier'
import { IItem } from './item'
import consts from './consts'

interface IResource {
  current: number
  max: number
}
interface IInitFunc {
  (w: World, e: IEntity): void
}
interface ISpawnFunc {
  (w: World, e: IEntity): void
}
interface IItemFunc {
  (w: World, e: IEntity, i: IItem, slot: string): void
}
interface DamageEvent {
  source: IEntity
  target: IEntity
  type: string
  amount: number
  weaponAmount: number
}
interface IHookFunc {
  (x: any): void
}
interface IEntity {
  id: number
  slug: string
  name: string
  level: number
  health: number
  alive: boolean
  items: {
    head: IItem
    neck: IItem
    shoulder: IItem
    back: IItem
    chest: IItem
    wrist: IItem
    hands: IItem
    waist: IItem
    legs: IItem
    feet: IItem
    finger1: IItem
    finger2: IItem
    trinket1: IItem
    trinket2: IItem
    mainHand: IItem
    offHand: IItem
  }
  _hooks: { [key: string]: IHookFunc[] }

  abilities: { [key: string]: IAbility }
  modifiers: IModifier[]

  onInit: IInitFunc[]
  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  onEquipItem: IItemFunc[]
  onUnequipItem: IItemFunc[]

  _gcdRemaining: number

  triggerGCD(): void
  isOnGCD(): boolean
}
const triggerGCD = function(): void {
  this._gcdRemaining = 1.5
}
const isOnGCD = function(): boolean {
  return this._gcdRemaining > 0
}

interface getter {
  (): number
}
interface entityGetter {
  (e: IEntity): number
}
interface setter {
  (value: any): void
}

const invalidationFunc = function(a: any, k: string, values: string[]): setter {
  return function(value: number) {
    a['_' + k] = value
    values.forEach(x => {
      a['_' + x] = undefined
    })
  }
}
const basicProp = function(a: any, def: number, name: string, dependencies: string[]): void {
  Object.defineProperty(a, name, {
    get: passthrough(a, name),
    set: invalidationFunc(a, name, dependencies)
  })
  a[name] = def
}

const passthrough = function(a: any, x: string): getter {
  return function() {
    return a['_' + x]
  }
}
const computedProp = function(a: any, name: string, calcFunc: entityGetter, dependencies: string[]) {
  Object.defineProperty(a, name, {
    get: function(): number {
      return calcFunc(a)
      /*
      if (a['_' + name] === undefined) {
        a['_' + name] = calcFunc(a)
        dependencies.forEach(x => {
          a['_' + x] = undefined
        })
      }
      return a['_' + name]
      */
    }
  })
}
const attachDefaultAttributes = function(e: IEntity) {
  basicProp(e, 0, '+armor', ['armor', 'armor_dr'])
  basicProp(e, 1, '*armor', ['armor', 'armor_dr'])
  computedProp(
    e,
    'armor',
    function(e: any): number {
      return Math.round(e['+armor'] * e['*armor'])
    },
    ['armor_dr']
  )
  computedProp(
    e,
    'armor_k',
    function(e: any): number {
      return consts('armor-k', e.level)
    },
    ['armor_dr']
  )
  computedProp(
    e,
    'armor_dr',
    function(e: any): number {
      //mult = 1 / (1 + x / k)
      //TODO: Fix Magic Number
      return 1 / (1 + e['armor'] / 7390)
    },
    []
  )

  basicProp(e, 0, '+espertiseRating', [])
  basicProp(e, 0, '+expertise', [])
  basicProp(e, 0, '+attackerCritChance', [])
  basicProp(e, 1, '*drAll', [])
  basicProp(e, 1, '*drPhysical', [])
  basicProp(e, 1, '*drMagical', [])
  basicProp(e, 0, '+maxHealth%', ['health-max'])
  basicProp(e, 1, '*maxHealth', ['health-max'])

  computedProp(
    e,
    'health-max',
    function(e: any): number {
      //TODO: Fix this magic number
      let m = Math.floor(60 * e['stamina'] * (1 + e['+maxHealth%']) * e['*maxHealth'])
      if (m < 0) {
        return 1
      }
      return m
    },
    []
  )
}
const DefaultEntity: IEntity = {
  id: 0,
  slug: '',
  name: '',
  level: 1,
  health: 100,
  alive: true,
  _hooks: {
    TakingMeleeWhiteDamage: [],
    TakingMeleeYellowDamage: [],
    TakingRangedWhiteDamage: [],
    TakingRangedYellowDamage: [],
    TakingHarmfulSpell: [],
    TakingPeriodicDamage: []
  },
  items: {
    head: undefined,
    neck: undefined,
    shoulder: undefined,
    back: undefined,
    chest: undefined,
    wrist: undefined,
    hands: undefined,
    waist: undefined,
    legs: undefined,
    feet: undefined,
    finger1: undefined,
    finger2: undefined,
    trinket1: undefined,
    trinket2: undefined,
    mainHand: undefined,
    offHand: undefined
  },
  abilities: {},
  modifiers: [],

  onInit: [],
  onSpawn: [],
  onDespawn: [],
  onEquipItem: [],
  onUnequipItem: [],
  _gcdRemaining: 0,

  triggerGCD,
  isOnGCD
}

export { IEntity }

export { attachDefaultAttributes, DefaultEntity }
