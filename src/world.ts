import { IModifier } from './modifier'
import { IEntity } from './entity'
import { IItem } from './item'
import report from './report'
import * as _debug from 'debug'
const debug = _debug('world')
const debugVerbose = _debug('world:verbose')

interface IWorld {
  _second: number
  _tickDelta: number

  now: number
  entities: IEntity[]
  slug: string
}
export { IWorld }
const DefaultWorld = function(): IWorld {
  return {
    _second: 1000,
    _tickDelta: 40,

    now: 0,
    entities: [],
    slug: 'default-world'
  }
}
export { DefaultWorld }
