import { IEntity, DefaultEntity } from './Entity'

interface ILearnFunc {
  (e: IEntity): void
}
interface ICastFunc {
  (e: IEntity, ...targets: IEntity[]): void
}
interface IAbility {
  id: number
  slug: string
  cooldown: number
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
  learn(e: IEntity): void
  unlearn(e: IEntity): void
  cast(...targets: IEntity[]): void
}
const triggerCooldown = function(e: IEntity): void {
  //e[this.key].cooldown = this.cooldown
}
const activeLearn = function(e: IEntity): void {
  this.host = e
  this.onLearn.forEach(h => h(e))
}
const activeUnlearn = function(e: IEntity): void {
  this.onUnlearn.forEach(h => h(e))
}
const activeCast = function(...targets: IEntity[]): void {
  targets.forEach(t => this.onCast.forEach(h => h(this.host, t)))
}

const DefaultAbility: IAbility = {
  id: 0,
  slug: '',
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

const passiveLearn = function(e: IEntity): void {
  this.host = e
  for (var a in this.attributes) {
    switch (a.charAt[0]) {
      case '+':
        e.attributes[a] += this.attributes[a]
        break
      case '*':
        e.attributes[a] *= this.attributes[a]
        break
      default:
      // TODO: Error reporting
    }
  }
}
const passiveUnlearn = function(e: IEntity): void {
  for (var a in this.attributes) {
    switch (a.charAt[0]) {
      case '+':
        e.attributes[a] -= this.attributes[a]
        break
      case '*':
        e.attributes[a] /= this.attributes[a]
        break
      default:
      // TODO: Error reporting
    }
  }
}
const passiveCast = function(...target: IEntity[]): void {}

const DefaultPassive: IAbility = {
  id: 0,
  slug: '',
  cooldown: 0,
  passive: true,
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
