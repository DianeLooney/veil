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
    console.log('Equipping a duplicate!')
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
const gainPower = function(type: string, amount: number): void {
  let x = 0
  let max = this.attributes[`maxPower:${type}`]
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

  basicProp(this, max, `+maxPower:${type}`, [`maxPower:${type}`])
  basicProp(this, 1, `*maxPower:${type}`, [`maxPower:${type}`])
  computedProp(
    this,
    `maxPower:${type}`,
    function(e: IEntity): number {
      //TODO: Fix this Magic Number
      return e.attributes[`+maxPower:${type}`] * e.attributes[`*maxPower:${type}`]
    },
    []
  )
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
    amount: 0,
    weaponAmount: 0
  }
  switch (args.type) {
    case 'PHYSICAL':
      dmg.type = 'PHYSICAL'
      dmg.target = args.target
      let a: number = args.amount
      a += args.source.attributes['normalized_mh_weapon_damage']
      a += args.source.attributes['normalized_oh_weapon_damage']
      dmg.amount = a
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
  report('ENTITY_DIED', { unit: this, killingBlow: source })
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

const invalidationFunc = function(e: IEntity, k: string, values: string[]): setter {
  return function(value: number) {
    e._attributes[k] = value
    values.forEach(x => {
      e._attributes[x] = undefined
    })
  }
}
const basicProp = function(e: IEntity, def: number, name: string, dependencies: string[]): void {
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
const computedProp = function(e: IEntity, name: string, calcFunc: entityGetter, dependencies: string[]) {
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
  basicProp(e, 0, '+stam', ['stamina', 'health-max'])
  basicProp(e, 1, '*stam', ['stamina', 'health-max']) // 137
  computedProp(
    e,
    'stamina',
    function(e: IEntity): number {
      //TODO: Fix this Magic Number
      console.log('+stam:', e.attributes['+stam'])
      console.log('*stam:', e.attributes['*stam'])
      console.log('stam:', (6259 + e.attributes['+stam']) * e.attributes['*stam'])
      return (6259 + e.attributes['+stam']) * e.attributes['*stam']
    },
    []
  )

  basicProp(e, 0, '+haste:rating', ['haste'])
  basicProp(e, 1, '*haste:rating', ['haste'])
  basicProp(e, 0, '+haste', ['haste'])
  computedProp(
    e,
    'haste',
    function(e: IEntity): number {
      //TODO: Fix this Magic Number
      return e.attributes['+haste'] + e.attributes['+haste:rating'] * e.attributes['*haste:rating'] / 375
    },
    ['armor_dr']
  )

  basicProp(e, 0, '+crit:rating', ['crit'])
  basicProp(e, 1, '*crit:rating', ['crit'])
  basicProp(e, 0, '+crit', ['crit'])
  computedProp(
    e,
    'crit',
    function(e: IEntity): number {
      //TODO: Fix this Magic Number x2
      return 0.06 + e.attributes['+crit'] + e.attributes['+crit:rating'] * e.attributes['*crit:rating'] / 40000
    },
    []
  )

  computedProp(
    e,
    'attack_power',
    function(e: IEntity): number {
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
    function(e: IEntity): number {
      let dmg: number = 0
      dmg += (e.attributes['+mh:DamageMin'] + e.attributes['+mh:DamageMax']) / 2
      dmg += e.attributes['+mh:Period'] * (1 / 3.5) * e.attributes['attack_power']
      return dmg
    },
    []
  )
  computedProp(
    e,
    'mh_weapon_dps',
    function(e: IEntity): number {
      return e.attributes['normalized_mh_weapon_dmg'] / e.attributes['+mh:Period']
    },
    []
  )
  computedProp(
    e,
    'normalized_oh_weapon_damage',
    function(e: IEntity): number {
      let dmg: number = 0
      dmg += (e.attributes['+mh:DamageMin'] + e.attributes['+mh:DamageMax']) / 2
      dmg += e.attributes['+mh:Period'] * (1 / 3.5) * e.attributes['attack_power']
      return dmg / 2
    },
    []
  )
  computedProp(
    e,
    'oh_weapon_dps',
    function(e: IEntity): number {
      return e.attributes['normalized_oh_weapon_dmg'] / e.attributes['+oh:Period']
    },
    []
  )

  basicProp(e, 0, '+armor', [])
  basicProp(e, 0, '+armor%', [])
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
    function(e: IEntity): number {
      //TODO: Fix this magic number
      let m = Math.floor(60 * e.attributes['stamina'] * (1 + e.attributes['+maxHealth%']) * e.attributes['*maxHealth'])
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

  onSpawn: [],
  onDespawn: [],

  _gcdRemaining: 0,

  learnAbility,
  unlearnAbility,
  gainModifier,
  dropModifier,
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
