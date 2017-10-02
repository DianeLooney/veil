import { IEntity } from './entity'
import { IItem } from './item'
import report from './report'
import * as _debug from 'debug'
import { ISubscription, INotifyFunc } from './metric'
const debug = _debug('world')
const debugVerbose = _debug('world:verbose')

interface IWorld {
  _second: number
  _tickDelta: number
  _subscriptions: {
    [key: string]: {
      filters?: string[]
      f: INotifyFunc
    }[]
  }

  now: number
  entities: IEntity[]
  slug: string
}

const formatTime = function(n: number): string {
  let x = Math.floor(n / 1000)
  let millis = '' + (n - x * 1000)
  while (millis.length < 3) {
    millis = '0' + millis
  }
  n = x
  x = Math.floor(n / 60)
  let secs = '' + (n - x * 60)
  while (secs.length < 2) {
    secs = '0' + secs
  }
  let mins = '' + x
  while (mins.length < 2) {
    mins = ' ' + mins
  }
  return `${mins}:${secs}.${millis}`
}
export { formatTime }

export { IWorld }
const DefaultWorld = function(): IWorld {
  return {
    _subscriptions: {},
    _second: 1000,
    _tickDelta: 40,

    now: 0,
    entities: [],
    slug: 'default-world'
  }
}
export { DefaultWorld }
