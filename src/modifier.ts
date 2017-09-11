import { IEntity, IAttributeGroup } from './Entity'
import { IWorld } from './World'
import * as _debug from 'debug'
const debug = _debug('modifier')
const verbose = _debug('verbose:modifier')

interface IApplyFunc {
  (e: IEntity): void
}
interface IDropFunc {
  (e: IEntity): void
}
interface ITickFunc {
  (w: IWorld, s: IEntity, e: IEntity): void
}
interface IModifierTemplate {
  id: number
  slug: string
  stackMode: string
  duration: number
  durationIsHasted: boolean
  attributes: IAttributeGroup
  sourcedAttributes: { [key: string]: number }
}
export { IModifierTemplate }
interface IModifierInstance {
  template: IModifierTemplate
  source: IEntity
  applied: number
  expires: number
}
export { IModifierInstance }
interface ITickerTemplate {
  id: number
  slug: string
  stackMode: string
  duration: number
  durationIsHasted: boolean
  attributes: IAttributeGroup
  sourcedAttributes: { [key: string]: number }
  onApply: IApplyFunc[]
  onDrop: IDropFunc[]
  onInterval: ITickFunc[]
  interval: number
  intervalIsHasted: boolean
}
export { ITickerTemplate }
interface ITickerInstance {
  template: ITickerTemplate
  source: IEntity
  applied: number
  expires: number
  nextTick: number
}
export { ITickerInstance }
