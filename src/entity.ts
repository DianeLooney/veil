import report from './report'
import { IAbilityTemplate, IPassiveTemplate, IAbilityInstance } from './ability'
import { IWorld } from './world'
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
interface IHookFunc {
  (x: any): void
}
interface IPosition {
  x: number
  y: number
}
interface IVector {
  dx: number
  dy: number
}
export { IPosition }
export { IVector }
interface IVector {
  dx: number
  dy: number
}
interface IAttributeGroup {
  [key: string]: number
}
export { IAttributeGroup }
interface ITalentSlot {
  slug: string
  row: number
  column: number
  enabled: boolean
  passives: IPassiveTemplate[]
  actives: IAbilityTemplate[]
  attributes: IAttributeGroup
}
export const DefaultTalentSlot: ITalentSlot = {
  slug: 'default-talent-slot',
  row: -1,
  column: -1,
  enabled: false,
  passives: [],
  actives: [],
  attributes: {}
}
export { ITalentSlot }
interface IEntity {
  key: symbol
  id: number
  slug: string
  name: string
  level: number
  health: number
  alive: boolean
  hitradius: number
  friendly: boolean
  position: IPosition
  facing: IVector
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
  _talents: ITalentSlot[]
  talentsBySlug: { [key: string]: ITalentSlot }
  talentsByRow: ITalentSlot[][]
  hookDamageTakenPre: { (w: IWorld, src: IEntity, tar: IEntity, args: any): void }[]
  hookDamageTaken: { (w: IWorld, src: IEntity, tar: IEntity, args: any): void }[]
  hookDamageTakenPost: { (w: IWorld, src: IEntity, tar: IEntity, args: any): void }[]
  _attributes: any
  rng: { [key: string]: any }
  abilities: { [key: string]: IAbilityInstance }
  rechargingAbilities: IAbilityInstance[]
  restingAbilities: IAbilityInstance[]
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
    key: Symbol('Entity'),
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
    facing: { dx: 0, dy: 1 },
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
    hookDamageTakenPre: [],
    hookDamageTaken: [],
    hookDamageTakenPost: [],
    tickers: [],
    mods: [],
    passives: [],

    _talents: [],
    talentsBySlug: {},
    talentsByRow: [],

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
    key: Symbol('Entity'),
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
    facing: { dx: 0, dy: 1 },
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
    tickers: [],
    mods: [],
    passives: [],

    _talents: [],
    talentsBySlug: {},
    talentsByRow: [],

    hookDamageTakenPre: [],
    hookDamageTaken: [],
    hookDamageTakenPost: [],

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
