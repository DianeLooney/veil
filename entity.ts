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
  maxHealth() {
    return (this._attributes['+maxHealth'] + this._healthMax) * (1 + this._attributes['*maxHealth'])
  }
  learnAbility(a) {
    if (!this.abilities[a.slug]) {
      this.abilities[a.slug] = a
      a.learn(this)
      report('ABILITY_LEARNED', { entity: this, ability: a })
    }
  }
  unlearnAbility(a) {
    if (this.abilities[a.key]) {
      this.abilities[a.key] = undefined
      a.unlearn(this)
      report('ABILITY_UNLEARNED', { entity: this, ability: a })
    }
  }
  gainModifier(m) {
    this.modifiers.push(m)
    m.onApply(this)
    report('MODIFIER_GAINED', { entity: this, modifier: m })
  }
  dropModifier(m) {
    let i = this.modifiers.indexOf(m)
    this.modifiers.splice(i)
    report('MODIFIER_DROPPED', { entity: this, modifier: m })
  }
  maxPower(type) {
    return (this._attributes[`+maxPower${type}`] + this.powers[type].max) * (1 + this._attributes[`+maxPower${type}`])
  }
  gainPower(type, amount) {
    let x = 0
    let max = this.maxPower(type)
    if (this.powers[type].current + amount < max) {
      x = amount
    } else if (amount > 0) {
      x = max - this.powers[type].current
    }
    this.powers[type].current += x
    report('POWER_GAINED', { entity: this, power: type, amount: amount, new: this.powers[type].current })
  }
  spendPower(type, amount) {
    if (this.powers[type].current >= amount) {
      this.powers[type].current -= amount
      report('POWER_SPENT', { entity: this, power: type, amount: amount, new: this.powers[type].current })
    }
  }
  learnPower(type, current, max) {
    this.powers[type] = { current, max }
    this._attributes[`+maxPower${type}`] = 0
    this._attributes[`*maxPower${type}`] = 0
    report('POWER_LEARNED', { entity: this, power: type })
  }
  unleanPower(type) {
    this.powers[type] = undefined
    report('POWER_UNLEARNED', { entity: this, power: type })
  }
  triggerGCD() {
    this._gcdRemaining = 1.5
  }
  isOnGCD() {
    return this._gcdRemaining > 0
  }
  dealDamage(args) {
    args.source = this
    switch (args.type) {
      default:
        report('ERROR', { type: 'NYI', details: `dealDamage handling not yet implemented for type ${args.type}` })
        return
    }
    //args.target.takeDamage(args)
  }
  takeDamage(args) {
    report('ERROR', { type: 'NYI', details: `takeDamage handling not yet implemented for type ${args.type}` })
  }
  castAbility(slug, ...targets) {
    let a = this.abilities[slug]
    if (a) {
      a.cast(targets)
    }
  }
}
export default Entity
