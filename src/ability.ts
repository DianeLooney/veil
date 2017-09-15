import { IEntity, DefaultPlayerEntity } from './Entity'
import * as _ from './actions'
import { IWorld } from './World'
import report from './report'
import { start, end } from './perf'

const _debug = require('debug')
const debug = _debug('ability')
const verbose = _debug('verbose:ability')

interface ILearnFunc {
  (w: IWorld, e: IEntity): void
}
interface ICastFunc {
  (w: IWorld, e: IEntity, i: IAbilityInstance, ...targets: IEntity[]): void
}
export { ICastFunc }

interface IAbilityTemplate {
  id: number
  slug: string
  onGCD: boolean
  triggersGCD: boolean
  cooldown: number
  cooldownIsHasted: boolean
  chargeMax: number
  attributes: { [key: string]: number }
  abilityAttributes: { [key: string]: number }
  _abilityAttributes: { [key: string]: number }
  requires: { [key: string]: number }
  cost: { [key: string]: number }
  onCast: ICastFunc[]
}
export { IAbilityTemplate }
const AbilityDefaults: IAbilityTemplate = {
  id: 0,
  slug: 'ability-template',
  onGCD: true,
  triggersGCD: true,
  cooldown: 0,
  cooldownIsHasted: false,
  chargeMax: 1,
  attributes: {},
  abilityAttributes: {},
  _abilityAttributes: {
    ['+cooldown']: 0,
    ['*damage']: 0
  },
  requires: {},
  cost: {},
  onCast: []
}
export { AbilityDefaults }
interface IPassiveTemplate {
  id: number
  slug: string
  attributes: { [key: string]: number }
}
export { IPassiveTemplate }
const PassiveDefaults: IPassiveTemplate = {
  id: 0,
  slug: 'passive-template',
  attributes: {}
}
export { PassiveDefaults }

interface IAbilityInstance {
  template: IAbilityTemplate
  currentCharges: number
  startedCharging: number
  willFinishCharging: number
  attributes: { [key: string]: number }
}
export { IAbilityInstance }
