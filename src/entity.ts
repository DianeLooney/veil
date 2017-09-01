import report from './report'
import { IAbility } from './ability'
import World from './world'
import { IModifier } from './modifier'
import { IItem } from './item'
import consts from './consts'
import attributes from './templates/playerAttributes'
import { parse, build } from './templates/attributeParser'
import { IRngSource } from './rng'
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
interface IDelayFunc {
  (w: World, e: IEntity): void
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
  _attributes: any
  _hooks: { [key: string]: IHookFunc[] }
  rng: { [key: string]: IRngSource }
  abilities: { [key: string]: IAbility }
  modifiers: IModifier[]

  onInit: IInitFunc[]
  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  onEquipItem: IItemFunc[]
  onUnequipItem: IItemFunc[]

  delays: { when: number; func: IDelayFunc }[]

  triggerGCD(): void
  isOnGCD(): boolean
}
const triggerGCD = function(): void {
  this['gcd:remaining'] = this['gcd:time']
}
const isOnGCD = function(): boolean {
  return this['gcd:remaining'] > 0
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

const loadAttributes = function(e: IEntity) {
  let d = build(parse(e._attributes))
  for (let i in d) {
    let k = i
    let r = d[k]
    switch (typeof r.value) {
      case 'function':
        delete e[k]
        Object.defineProperty(e, k, {
          get: function() {
            if (e[`__${k}__`] === undefined) {
              e[`__${k}__`] = r.value(e)
            }
            return e[`__${k}__`]
          },
          set: function(v) {
            console.error(`Unable to set attribute ${k} of ${e.slug}`)
          }
        })
        break
      default:
        delete e[k]
        e[k] = r.value
    }
  }
}
const DefaultEntity: IEntity = {
  id: 0,
  slug: '',
  name: '',
  level: 1,
  health: 100,
  alive: true,
  _attributes: attributes,
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
  delays: [],
  rng: {},

  triggerGCD,
  isOnGCD
}

export { IEntity }

export { loadAttributes, DefaultEntity }
