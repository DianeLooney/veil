import { IEntity, DefaultEntity } from './Entity'
import * as _ from './actions'
import { IWorld } from './World'
import report from './report'
import { start, end } from './perf'

import * as _debug from 'debug'
const debug = _debug('ability')
const verbose = _debug('verbose:ability')

interface ILearnFunc {
  (w: IWorld, e: IEntity): void
}
interface ICastFunc {
  (w: IWorld, e: IEntity, ...targets: IEntity[]): void
}

interface IAbilityTemplate {
  id: number
  slug: string
  onGCD: boolean
  triggersGCD: boolean
  cooldown: number
  cooldownIsHasted: boolean
  chargeMax: number
  attributes: { [key: string]: number }
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
  '+cooldown': number
}
export { IAbilityInstance }
