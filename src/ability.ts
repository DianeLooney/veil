import { IEntity, DefaultEntity } from './Entity'
import World from './World'
import report from './report'

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
  //e[this.key].cooldown = this.cooldown
}
const activeLearn = function(w: World, e: IEntity): void {
  this.host = e
  this.onLearn.forEach(h => h(e))
}
const activeUnlearn = function(w: World, e: IEntity): void {
  this.onUnlearn.forEach(h => h(e))
}
const activeCast = function(w: World, ...targets: IEntity[]): void {
  if (this.onGCD && this.host.isOnGCD()) {
    return
  }
  for (let i in this.requires) {
    if (this.host[i] < this.requires[i]) {
      return
    }
  }
  for (let i in this.cost) {
    if (this.host[i] < this.cost[i]) {
      return
    }
  }
  for (let i in this.cost) {
    if ((this.host[i] -= this.cost[i])) {
      return
    }
  }
  targets.forEach(t => this.onCast.forEach(h => h(w, this.host, t)))
  if (this.triggersGCD) {
    this.host.triggerGCD()
  }
  report('ABILITY_CASTED', { entity: this.host, spell: this })
}

const DefaultAbility: IAbility = {
  id: 0,
  slug: '',
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
