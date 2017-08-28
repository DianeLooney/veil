import report from './report'
import Ability from './ability'
import Modifier from './modifier'

interface IResource {
  current: number
  max: number
}
interface ISpawnFunc {
  (e: Entity): void
}
interface DamageEvent {
  source: Entity
  target: Entity
  type: string
}
class Entity {
  id: number
  slug: string
  name: string
  health: number
  _healthMax: number
  powers: { [key: string]: IResource }
  _attributes: { [key: string]: number }

  abilities: { [key: string]: Ability }
  modifiers: Modifier[]

  onSpawn: ISpawnFunc[]
  onDespawn: ISpawnFunc[]

  _gcdRemaining: number

  key: Symbol
  constructor(...template) {
    this.id = 0
    this.slug = ''
    this.name = ''
    this.health = 0
    this._healthMax = 0

    this.powers = {}
    this._attributes = {}

    this._attributes['+maxHealth'] = 0
    this._attributes['*maxHealth'] = 0

    this.abilities = {}
    this.modifiers = []
    this.onSpawn = []
    this.onDespawn = []

    this._gcdRemaining = 0
    Object.assign(this, ...template)
    this.key = Symbol('entity:' + this.slug)

    this.onSpawn = this.onSpawn.map(h => h.bind(this))
    this.onDespawn = this.onDespawn.map(h => h.bind(this))
  }
  maxHealth(): number {
    return (
      (this._attributes['+maxHealth'] + this._healthMax) *
      (1 + this._attributes['*maxHealth'])
    )
  }
  learnAbility(a: Ability): void {
    if (!this.abilities[a.slug]) {
      this.abilities[a.slug] = a
      a.learn(this)
      report('ABILITY_LEARNED', { entity: this, ability: a })
    }
  }
  unlearnAbility(a: Ability): void {
    if (this.abilities[a.slug]) {
      this.abilities[a.slug] = undefined
      a.unlearn(this)
      report('ABILITY_UNLEARNED', { entity: this, ability: a })
    }
  }
  gainModifier(m: Modifier): void {
    this.modifiers.push(m)
    m.apply(this)
    report('MODIFIER_GAINED', { entity: this, modifier: m })
  }
  dropModifier(m: Modifier): void {
    let i = this.modifiers.indexOf(m)
    this.modifiers.splice(i)
    report('MODIFIER_DROPPED', { entity: this, modifier: m })
  }
  maxPower(type: string): number {
    return (
      (this._attributes[`+maxPower${type}`] + this.powers[type].max) *
      (1 + this._attributes[`+maxPower${type}`])
    )
  }
  gainPower(type: string, amount: number): void {
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
  spendPower(type: string, amount: number): void {
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
  learnPower(type: string, current: number, max: number): void {
    this.powers[type] = { current, max }
    this._attributes[`+maxPower${type}`] = 0
    this._attributes[`*maxPower${type}`] = 0
    report('POWER_LEARNED', { entity: this, power: type })
  }
  unleanPower(type: string): void {
    this.powers[type] = undefined
    report('POWER_UNLEARNED', { entity: this, power: type })
  }
  triggerGCD(): void {
    this._gcdRemaining = 1.5
  }
  isOnGCD(): boolean {
    return this._gcdRemaining > 0
  }
  dealDamage(args: DamageEvent): void {
    let dmg: DamageEvent = {
      source: this,
      target: null,
      type: ''
    }
    switch (args.type) {
      case 'WEAPON_NORMALIZED':
        report('ERROR', {
          type: 'NYI',
          details: `dealDamage handling not yet implemented for type ${args.type}`
        })
        dmg.type = 'PHYSICAL'
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
  takeDamage(args: DamageEvent): void {
    report('ERROR', {
      type: 'NYI',
      details: `takeDamage handling not yet implemented for type ${args.type}`
    })
  }
  castAbility(slug: string, ...targets: Entity[]): void {
    let a = this.abilities[slug]
    if (a) {
      a.cast(targets)
    }
  }
}
export default Entity
