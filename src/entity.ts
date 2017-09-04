import report from './report'
import { IAbility } from './ability'
import { IWorld } from './world'
import { IModifier } from './modifier'
import { IItem } from './item'
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
  rng: { [key: string]: IRngSource }
  abilities: { [key: string]: IAbility }
  modifiers: IModifier[]

  onInit: IInitFunc[]
  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  onEquipItem: IItemFunc[]
  onUnequipItem: IItemFunc[]

  delays: { when: number; func: IDelayFunc }[]
}
export { IEntity }
const DefaultEntity: IEntity = {
  id: 0,
  slug: '',
  name: '',
  level: 1,
  health: 100,
  alive: true,
  _attributes: attributes,
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
  rng: {}
}
const DefaultBossEntity: IEntity = {
  id: 0,
  slug: '',
  name: '',
  level: 1,
  health: 100,
  alive: true,
  _attributes: bossAttributes,
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
  rng: {}
}

export { DefaultEntity, DefaultBossEntity }
