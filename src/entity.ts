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
      if (a['_' + name] === undefined) {
        a['_' + name] = calcFunc(a)
        dependencies.forEach(x => {
          a['_' + x] = undefined
        })
      }
      return a['_' + name]
    }
  })
}
const attachDefaultAttributes = function(e: IEntity) {
  basicProp(e, 0, '+stam:rating', ['stamina', 'health-max'])
  basicProp(e, 1, '*stam:rating', ['stamina', 'health-max']) // 137
  computedProp(
    e,
    'stamina',
    function(e: any): number {
      //TODO: Fix this Magic Number
      return Math.round((6259 + e['+stam:rating']) * e['*stam:rating'])
    },
    []
  )

  basicProp(e, 0, '+haste:rating', ['haste'])
  basicProp(e, 1, '*haste:rating', ['haste'])
  basicProp(e, 0, '+haste', ['haste'])
  computedProp(
    e,
    'haste',
    function(e: any): number {
      //TODO: Fix this Magic Number
      return e['+haste'] + e['+haste:rating'] * e['*haste:rating'] / 375
    },
    ['armor_dr']
  )

  basicProp(e, 0, '+crit:rating', ['crit'])
  basicProp(e, 1, '*crit:rating', ['crit'])
  basicProp(e, 0, '+crit', ['crit'])
  computedProp(
    e,
    'crit',
    function(e: any): number {
      //TODO: Fix this Magic Number x2
      return 0.05 + 0.01 + e['+crit'] + e['+crit:rating'] * e['*crit:rating'] / 40000
    },
    []
  )
  basicProp(e, 0, '+vers:rating', [])
  basicProp(e, 0, '+primary:rating', [])
  basicProp(e, 0, '+str_agi:rating', [])
  basicProp(e, 0, '+agi_int:rating', [])

  computedProp(
    e,
    'attack_power',
    function(e: any): number {
      //TODO: Be an actual number.
      return 0
    },
    ['normalized_mh_weapon_damage', 'normalized_oh_weapon_damage', 'mh_weapon_dps', 'oh_weapon_dps']
  )

  basicProp(e, 0, '+mh:DamageMin', ['normalized_mh_weapon_damage', 'mh_weapon_dps'])
  basicProp(e, 0, '+mh:DamageMax', ['normalized_mh_weapon_damage', 'mh_weapon_dps'])
  basicProp(e, 0, '+mh:Period', ['normalized_mh_weapon_damage', 'mh_weapon_dps'])
  basicProp(e, 0, '+oh:DamageMin', ['normalized_oh_weapon_damage', 'oh_weapon_dps'])
  basicProp(e, 0, '+oh:DamageMax', ['normalized_oh_weapon_damage', 'oh_weapon_dps'])
  basicProp(e, 0, '+oh:Period', ['normalized_oh_weapon_damage', 'oh_weapon_dps'])
  computedProp(
    e,
    'normalized_mh_weapon_damage',
    function(e: any): number {
      let dmg: number = 0
      dmg += (e['+mh:DamageMin'] + e['+mh:DamageMax']) / 2
      dmg += e['+mh:Period'] * (1 / 3.5) * e['attack_power']
      return dmg
    },
    []
  )
  computedProp(
    e,
    'mh_weapon_dps',
    function(e: any): number {
      return e['normalized_mh_weapon_dmg'] / e['+mh:Period']
    },
    []
  )
  computedProp(
    e,
    'normalized_oh_weapon_damage',
    function(e: any): number {
      let dmg: number = 0
      dmg += (e['+mh:DamageMin'] + e['+mh:DamageMax']) / 2
      dmg += e['+mh:Period'] * (1 / 3.5) * e['attack_power']
      return dmg / 2
    },
    []
  )
  computedProp(
    e,
    'oh_weapon_dps',
    function(e: any): number {
      return e['normalized_oh_weapon_dmg'] / e['+oh:Period']
    },
    []
  )

  basicProp(e, 0, '+armor', ['armor', 'armor_dr'])
  basicProp(e, 0, '*armor', ['armor', 'armor_dr'])
  computedProp(
    e,
    'armor',
    function(e: any): number {
      return e['+armor'] * e['*armor']
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
      return 1 / (1 + e['armor'] / e['armor_k'])
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
