import { IEntity, DefaultEntity } from './Entity'
import World from './World'
import report from './report'

import * as _debug from 'debug'
const debug = _debug('ability')
const verbose = _debug('verbose:ability')

interface ILearnFunc {
  (w: World, e: IEntity): void
}
interface ICastFunc {
  (e: IEntity, ...targets: IEntity[]): void
}
interface IAbility {
  id: number
  slug: string
  cooldown: number
  recharges: string[]
  hastedRecharges: string[]
  requires: { [key: string]: number }
  cost: { [key: string]: number }
  passive: boolean
  triggersGCD: boolean
  attributes: { [key: string]: number }
  onGCD: boolean
  charges: number
  host?: IEntity
  onLearn: ILearnFunc[]
  onUnlearn: ILearnFunc[]
  onCast: ICastFunc[]
  triggerCooldown(e: IEntity): void
  learn: ILearnFunc
  unlearn: ILearnFunc
  cast(w: World, ...targets: IEntity[]): void
}
const triggerCooldown = function(e: IEntity): void {
  verbose(`triggering cooldown of ${this.slug} for ${e.slug}`)
  //e[this.key].cooldown = this.cooldown
}
const activeLearn = function(w: World, e: IEntity): void {
  debug(`learning active ${this.slug} for ${e.slug}`)
  this.host = e
  this.onLearn.forEach(h => h(e))
  for (var a in this.attributes) {
    w.gainAttribute(e, a, this.attributes[a])
  }
}
const activeUnlearn = function(w: World, e: IEntity): void {
  debug(`unlearning active ${this.slug} for ${e.slug}`)
  this.onUnlearn.forEach(h => h(e))
  for (var a in this.attributes) {
    w.loseAttribute(e, a, this.attributes[a])
  }
}
const activeCast = function(w: World, ...targets: IEntity[]): void {
  verbose(`attempting to cast ${this.slug} for ${this.host.slug}`)
  if (this.onGCD && this.host.isOnGCD()) {
    verbose(`rejected cast of ${this.slug} for ${this.host.slug}: on gcd`)
    return
  }
  for (let i in this.requires) {
    if (this.host[i] < this.requires[i]) {
      verbose(`rejected cast of ${this.slug} for ${this.host.slug}: requires '${i}' >= '${this.requires[i]}', and it was '${this.host[i]}'`)
      return
    }
  }
  for (let i in this.cost) {
    if (this.host[i] < this.cost[i]) {
      verbose(`rejected cast of ${this.slug} for ${this.host.slug}: costs '${i}' - '${this.requires[i]}', and it was '${this.host[i]}'`)
      return
    }
  }
  for (let i in this.cost) {
    this.host[i] -= this.cost[i]
  }
  if (targets.length > 0) {
    targets.forEach(t => this.onCast.forEach(h => h(w, this.host, t)))
  } else {
    this.onCast.forEach(h => h(w, this.host, this.host))
  }

  if (this.triggersGCD) {
    this.host.triggerGCD()
  }
  report('ABILITY_CASTED', { entity: this.host, spell: this })
  debug(`casted ${this.slug} for ${this.host.slug}`)
}

const DefaultAbility: IAbility = {
  id: 0,
  slug: '',
  recharges: [],
  hastedRecharges: [],
  requires: {},
  cost: {},
  cooldown: 0,
  passive: false,
  triggersGCD: true,
  attributes: {},
  onGCD: true,
  charges: 0,
  host: undefined,
  onLearn: [],
  onUnlearn: [],
  onCast: [],
  triggerCooldown,
  learn: activeLearn,
  unlearn: activeUnlearn,
  cast: activeCast
}

const passiveLearn = function(w: World, e: IEntity): void {
  this.host = e
  for (var a in this.attributes) {
    w.gainAttribute(e, a, this.attributes[a])
  }
}
const passiveUnlearn = function(w: World, e: IEntity): void {
  for (var a in this.attributes) {
    w.loseAttribute(e, a, this.attributes[a])
  }
}
const passiveCast = function(w: World, ...target: IEntity[]): void {}

const DefaultPassive: IAbility = {
  id: 0,
  slug: '',
  cooldown: 0,
  passive: true,
  recharges: [],
  hastedRecharges: [],
  requires: {},
  cost: {},
  triggersGCD: false,
  attributes: {},
  onGCD: false,
  charges: 0,
  host: undefined,
  onLearn: [],
  onUnlearn: [],
  onCast: [],
  triggerCooldown: (e: IEntity): void => {},
  learn: passiveLearn,
  unlearn: passiveUnlearn,
  cast: passiveCast
}
export { IAbility }
export { DefaultAbility }
export { DefaultPassive }
