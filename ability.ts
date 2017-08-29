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
  triggersGCD: boolean
  onGCD: boolean
  charges: number
  host: IEntity
  onLearn: ILearnFunc[]
  onUnlearn: ILearnFunc[]
  onCast: ICastFunc[]
  triggerCooldown(e: IEntity)
  learn(e: IEntity): void
  unlearn(e: IEntity): void
  cast(...targets: IEntity[]): void
}
const triggerCooldown = function(e: IEntity) {
  //e[this.key].cooldown = this.cooldown
}
const learn = function(e: IEntity): void {
  this.host = e
  this.onLearn.forEach(h => h(e))
}
const unlearn = function(e: IEntity): void {
  this.onUnlearn.forEach(h => h(e))
}
const cast = function(...targets: IEntity[]): void {
  targets.forEach(t => this.onCast.forEach(h => h(this.host, t)))
}

const DefaultAbility = {
  id: 0,
  slug: '',
  cooldown: 0,
  triggersGCD: true,
  onGCD: true,
  charges: 0,
  host: undefined,
  onLearn: [],
  onUnlearn: [],
  onCast: [],
  triggerCooldown,
  learn,
  unlearn,
  cast
}

export { IAbility }
export { DefaultAbility }
