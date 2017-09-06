import report from './report'
import { IAbilityTemplate, IPassiveTemplate, IAbilityInstance } from './ability'
import { IWorld } from './world'
import { IModifier } from './modifier'
import { IItem } from './item'
import { ITickerTemplate, ITickerInstance, IModifierTemplate, IModifierInstance } from './modifier'
import consts from './consts'
import attributes from './templates/playerAttributes'
import bossAttributes from './templates/bossAttributes'
import { IRngSource } from './rng'

interface IResource {
  current: number
  max: number
}
interface IInitFunc {
  (w: IWorld, e: IEntity): void
}
interface ISpawnFunc {
  (w: IWorld, e: IEntity): void
}
interface IItemFunc {
  (w: IWorld, e: IEntity, i: IItem, slot: string): void
}
interface IDelayFunc {
  (w: IWorld, e: IEntity): void
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
interface IPosition {
  x: number
  y: number
}
export { IPosition }
interface IVector {
  dx: number
  dy: number
}
interface IEntity {
  id: number
  slug: string
  name: string
  level: number
  health: number
  alive: boolean
  hitradius: number
  friendly: boolean
  position: IPosition
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
  rng: { [key: string]: any }
  abilities: { [key: string]: IAbilityInstance }
  rechargingAbilities: IAbilityInstance[]
  restingAbilities: IAbilityInstance[]
  modifiers: IModifier[]
  tickers: ITickerInstance[]
  mods: IModifierInstance[]
  passives: IPassiveTemplate[]
  onInit: IInitFunc[]
  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  onEquipItem: IItemFunc[]
  onUnequipItem: IItemFunc[]

  delays: { when: number; func: IDelayFunc }[]
}
export { IEntity }

const DefaultEntity = function(): IEntity {
  return {
    id: 0,
    slug: '',
    name: '',
    level: 1,
    hitradius: 3,
    health: 100,
    friendly: true,
    alive: true,
    abilities: {},
    rechargingAbilities: [],
    restingAbilities: [],
    _attributes: attributes,
    position: { x: 0, y: 0 },
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
    modifiers: [],
    tickers: [],
    mods: [],
    passives: [],

    onInit: [],
    onSpawn: [],
    onDespawn: [],
    onEquipItem: [],
    onUnequipItem: [],
    delays: [],
    rng: {}
  }
}

const DefaultBossEntity = function(): IEntity {
  return {
    id: 0,
    slug: '',
    name: '',
    level: 1,
    health: 100,
    hitradius: 15,
    abilities: {},
    friendly: false,
    alive: true,
    rechargingAbilities: [],
    restingAbilities: [],
    _attributes: bossAttributes,
    position: { x: 0, y: 0 },
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
    modifiers: [],
    tickers: [],
    mods: [],
    passives: [],

    onInit: [],
    onSpawn: [],
    onDespawn: [],
    onEquipItem: [],
    onUnequipItem: [],
    delays: [],
    rng: {}
  }
}

export { DefaultEntity, DefaultBossEntity }
