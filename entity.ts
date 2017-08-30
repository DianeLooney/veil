import report from './report'
import { IAbility } from './ability'
import { IModifier } from './modifier'
import { IItem } from './item'
import consts from './consts'

interface IResource {
  current: number
  max: number
}
interface ISpawnFunc {
  (e: IEntity): void
}
interface DamageEvent {
  source: IEntity
  target: IEntity
  type: string
  amount: number
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
    shoulders: IItem
    back: IItem
    chest: IItem
    wrists: IItem
    hands: IItem
    waist: IItem
    legs: IItem
    feet: IItem
    finger1: IItem
    finger2: IItem
    trinket1: IItem
    trinket2: IItem
    weaponMH: IItem
    weaponOH: IItem
  }
  powers: { [key: string]: IResource }
  attributes: { [key: string]: number }
  _attributes: { [key: string]: number }
  _hooks: { [key: string]: IHookFunc[] }

  abilities: { [key: string]: IAbility }
  modifiers: IModifier[]

  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  _gcdRemaining: number

  learnAbility(a: IAbility): void
  unlearnAbility(a: IAbility): void
  gainModifier(m: IModifier): void
  dropModifier(m: IModifier): void
  maxPower(type: string): number
  gainPower(type: string, amount: number): void
  spendPower(type: string, amount: number): void
  learnPower(type: string, current: number, max: number): void
  unleanPower(type: string): void
  triggerGCD(): void
  isOnGCD(): boolean
  dealDamage(args: DamageEvent): void
  die(source: IEntity): void
  takeDamage(args: DamageEvent): void

  castAbility(slug: string, ...targets: IEntity[]): void

  equipItem(slot: string, i: IItem): void
  unequipItem(slot: string): void
}
const equipItem = function(slot: string, i: IItem): void {
  if (this.items[slot] !== undefined) {
    //TODO: some error message
    return
  }
  this.items[slot] = i
  //TODO: dispatch Item equipped event
  for (var a in i.stats) {
    switch (a.charAt(0)) {
      case '+':
        this.attributes[a] += i.stats[a]
        break
      case '*':
        this.attributes[a] *= i.stats[a]
        break
      default:
      // TODO: Error reporting
    }
  }
}
const unequipItem = function(slot: string): void {
  if (this.items[slot] === undefined) {
    //TODO: some error message
    return
  }
  let i = this.items[slot]
  for (var a in i.stats) {
    switch (a.charAt(0)) {
      case '+':
        this.attributes[a] -= i.stats[a]
        break
      case '*':
        this.attributes[a] /= i.stats[a]
        break
      default:
      // TODO: Error reporting
    }
  }
  this.items[slot] = undefined
}
const learnAbility = function(a: IAbility): void {
  if (!this.abilities[a.slug]) {
    this.abilities[a.slug] = a
    a.learn(this)
    report('ABILITY_LEARNED', { entity: this, ability: a })
  }
}
const unlearnAbility = function(a: IAbility): void {
  if (this.abilities[a.slug]) {
    this.abilities[a.slug] = undefined
    a.unlearn(this)
    report('ABILITY_UNLEARNED', { entity: this, ability: a })
  }
}
const gainModifier = function(m: IModifier): void {
  this.modifiers.push(m)
  m.apply(this)
  report('MODIFIER_GAINED', { entity: this, modifier: m })
}
const dropModifier = function(m: IModifier): void {
  let i = this.modifiers.indexOf(m)
  this.modifiers.splice(i)
  report('MODIFIER_DROPPED', { entity: this, modifier: m })
}
const maxPower = function(type: string): number {
  return (
    (this._attributes[`+maxPower${type}`] + this.powers[type].max) *
    (1 + this._attributes[`+maxPower${type}`])
  )
}
const gainPower = function(type: string, amount: number): void {
  let x = 0
  let max = this.maxPower(type)
  if (this.powers[type].current + amount < max) {
    x = amount
  } else if (amount > 0) {
    x = max - this.powers[type].current
  }
  this.powers[type].current += x
  report('POWER_GAINED', {
    entity: this,
    power: type,
    amount: amount,
    new: this.powers[type].current
  })
}
const spendPower = function(type: string, amount: number): void {
  if (this.powers[type].current >= amount) {
    this.powers[type].current -= amount
    report('POWER_SPENT', {
      entity: this,
      power: type,
      amount: amount,
      new: this.powers[type].current
    })
  }
}
const learnPower = function(type: string, current: number, max: number): void {
  this.powers[type] = { current, max }
  this._attributes[`+maxPower${type}`] = 0
  this._attributes[`*maxPower${type}`] = 0
  report('POWER_LEARNED', { entity: this, power: type })
}
const unleanPower = function(type: string): void {
  this.powers[type] = undefined
  report('POWER_UNLEARNED', { entity: this, power: type })
}
const triggerGCD = function(): void {
  this._gcdRemaining = 1.5
}
const isOnGCD = function(): boolean {
  return this._gcdRemaining > 0
}
const dealDamage = function(args: DamageEvent): void {
  let dmg: DamageEvent = {
    source: this,
    target: null,
    type: '',
    amount: 350
  }
  switch (args.type) {
    case 'WEAPON_NORMALIZED':
      report('ERROR', {
        type: 'NYI',
        details: `dealDamage handling not yet implemented for type ${args.type}`
      })
      dmg.type = 'SWING'
      dmg.target = args.target
      dmg.target.takeDamage(dmg)
      break
    default:
      report('ERROR', {
        type: 'NYI',
        details: `dealDamage handling not yet implemented for type ${args.type}`
      })
      return
  }
  //args.target.takeDamage(args)
}
const die = function(source: IEntity): void {
  report('IEntity_DIED', { unit: this, killingBlow: source })
}
const takeDamage = function(args: DamageEvent): void {
  let dr: number = 1
  if (args.type == 'PHYSICAL' || args.type == 'SWING') {
    dr *= this._attributes['*drPhysical']
  } else {
    dr *= this._attributes['*drMagical']
  }
  args.amount *= dr
  if (this.health > args.amount) {
    this.health -= args.amount
    report('DAMAGE_TAKEN', args)
  } else {
    this.health = 0
    report('DAMAGE_TAKEN', args)
    this.die(args.source)
  }

  /*report('ERROR', {
      type: 'NYI',
      details: `takeDamage handling not yet implemented for type ${args.type}`
    })*/
}
const castAbility = function(slug: string, ...targets: IEntity[]): void {
  let a = this.abilities[slug]
  if (a) {
    a.cast(...targets)
  }
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

const invalidationFunc = function(
  e: IEntity,
  k: string,
  values: string[]
): setter {
  return function(value: number) {
    e._attributes[k] = value
    values.forEach(x => {
      e._attributes[x] = undefined
    })
  }
}
const basicProp = function(
  e: IEntity,
  def: number,
  name: string,
  dependencies: string[]
): void {
  Object.defineProperty(e.attributes, name, {
    get: passthrough(e, name),
    set: invalidationFunc(e, name, dependencies)
  })
  e.attributes[name] = def
}

const passthrough = function(e: IEntity, x: string): getter {
  return function() {
    return e._attributes[x]
  }
}
const computedProp = function(
  e: IEntity,
  name: string,
  calcFunc: entityGetter,
  dependencies: string[]
) {
  Object.defineProperty(e.attributes, name, {
    get: function(): number {
      if (e._attributes[name] === undefined) {
        e._attributes[name] = calcFunc(e)
        dependencies.forEach(x => {
          e._attributes[x] = undefined
        })
      }
      return e._attributes[name]
    }
  })
}
const attachDefaultAttributes = function(e: IEntity) {
  basicProp(e, 0, '+stam', [])
  basicProp(e, 1, '*stam', [])

  basicProp(e, 0, '+armor', [])
  basicProp(e, 0, '+armor%', [])

  basicProp(e, 0, '+espertiseRating', [])
  basicProp(e, 0, '+expertise', [])
  basicProp(e, 0, '+attackerCritChance', [])
  basicProp(e, 1, '*drAll', [])
  basicProp(e, 1, '*drPhysical', [])
  basicProp(e, 1, '*drMagical', [])
  basicProp(e, 0, '+maxHealth%', [])
  basicProp(e, 1, '*maxHealth', [])

  computedProp(
    e,
    'stamina',
    function(e: IEntity): number {
      //TODO: Fix this Magic Number
      return (6259 + e.attributes['+stam']) * e.attributes['*stam']
    },
    []
  )
  computedProp(
    e,
    'health-max',
    function(e: IEntity): number {
      //TODO: Fix this magic number
      return (
        60 *
        e.attributes['stamina'] *
        (1 + e.attributes['+maxHealth%']) *
        e.attributes['*maxHealth']
      )
    },
    []
  )

  computedProp(
    e,
    'armor',
    function(e: IEntity): number {
      return e.attributes['+armor'] * (1 + e.attributes['+armor%'])
    },
    ['armor_dr']
  )
  computedProp(
    e,
    'armor_k',
    function(e: IEntity): number {
      return consts('armor-k', e.level)
    },
    ['armor_dr']
  )
  computedProp(
    e,
    'armor_dr',
    function(e: IEntity): number {
      //mult = 1 / (1 + x / k)
      return 1 / (1 + e.attributes['armor'] / e.attributes['armor_k'])
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
  powers: {},
  attributes: {},
  _attributes: {},
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
    shoulders: undefined,
    back: undefined,
    chest: undefined,
    wrists: undefined,
    hands: undefined,
    waist: undefined,
    legs: undefined,
    feet: undefined,
    finger1: undefined,
    finger2: undefined,
    trinket1: undefined,
    trinket2: undefined,
    weaponMH: undefined,
    weaponOH: undefined
  },
  abilities: {},
  modifiers: [],

  onSpawn: [],
  onDespawn: [],

  _gcdRemaining: 0,

  learnAbility,
  unlearnAbility,
  gainModifier,
  dropModifier,
  maxPower,
  gainPower,
  spendPower,
  learnPower,
  unleanPower,
  triggerGCD,
  isOnGCD,
  dealDamage,
  die,
  takeDamage,
  castAbility,
  equipItem,
  unequipItem
}

export { IEntity }

export { attachDefaultAttributes, DefaultEntity }
