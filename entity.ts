import report from './report'
import { IAbility } from './ability'
import { IModifier } from './modifier'

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
  _healthMax: number
  powers: { [key: string]: IResource }
  attributes: { [key: string]: number }
  _attributes: { [key: string]: number }
  _hooks: { [key: string]: IHookFunc[] }

  abilities: { [key: string]: IAbility }
  modifiers: IModifier[]

  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  _gcdRemaining: number

  maxHealth(): number
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
}

const maxHealth = function(): number {
  return (
    (this._attributes['+maxHealth'] + this._healthMax) *
    (1 + this._attributes['*maxHealth'])
  )
}
const learnAbility = function(a: IAbility): void {
  if (!this.abilities[a.slug]) {
    this.abilities[a.slug] = a
    a.learn(this)
    report('ABILITY_LEARNED', { IEntity: this, ability: a })
  }
}
const unlearnAbility = function(a: IAbility): void {
  if (this.abilities[a.slug]) {
    this.abilities[a.slug] = undefined
    a.unlearn(this)
    report('ABILITY_UNLEARNED', { IEntity: this, ability: a })
  }
}
const gainModifier = function(m: IModifier): void {
  this.modifiers.push(m)
  m.apply(this)
  report('MODIFIER_GAINED', { IEntity: this, modifier: m })
}
const dropModifier = function(m: IModifier): void {
  let i = this.modifiers.indexOf(m)
  this.modifiers.splice(i)
  report('MODIFIER_DROPPED', { IEntity: this, modifier: m })
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
    IEntity: this,
    power: type,
    amount: amount,
    new: this.powers[type].current
  })
}
const spendPower = function(type: string, amount: number): void {
  if (this.powers[type].current >= amount) {
    this.powers[type].current -= amount
    report('POWER_SPENT', {
      IEntity: this,
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
  report('POWER_LEARNED', { IEntity: this, power: type })
}
const unleanPower = function(type: string): void {
  this.powers[type] = undefined
  report('POWER_UNLEARNED', { IEntity: this, power: type })
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

const attachDefaultAttributes = function(e: IEntity) {
  interface getter {
    (): number
  }
  interface setter {
    (value: any): void
  }
  const passthrough = function(x: string): getter {
    return function() {
      return e._attributes[x]
    }
  }
  const invalidationFunc = function(k: string, values: string[]): setter {
    return function(value: number) {
      e._attributes[k] = value
      values.forEach(x => {
        e._attributes[x] = undefined
      })
    }
  }
  const basicProp = function(
    def: number,
    name: string,
    dependencies: string[]
  ): void {
    Object.defineProperty(e.attributes, name, {
      get: passthrough(name),
      set: invalidationFunc(name, dependencies)
    })
    e.attributes[name] = def
  }
  basicProp(0, '+stam', [])
  basicProp(0, '+stam%', [])
  basicProp(0, '+armor', [])
  basicProp(0, '+armor%', [])
  basicProp(0, '+espertiseRating', [])
  basicProp(0, '+expertise', [])
  basicProp(0, '+attackerCritChance', [])
  basicProp(1, '*drAll', [])
  basicProp(1, '*drPhysical', [])
  basicProp(1, '*drMagical', [])
  basicProp(0, '+maxHealth%', [])
  basicProp(1, '*maxHealth', [])

  //TODO: computed props
}
const DefaultEntity: IEntity = {
  id: 0,
  slug: '',
  name: '',
  level: 1,
  health: 100,
  alive: true,
  _healthMax: 100,
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

  abilities: {},
  modifiers: [],

  onSpawn: [],
  onDespawn: [],

  _gcdRemaining: 0,

  maxHealth,
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
  castAbility
}

export { IEntity }

export { DefaultEntity }
