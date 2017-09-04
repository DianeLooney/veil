import { IEntity } from './Entity'
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
  (w: IWorld, e: IEntity): void
}
interface IModifier {
  id: number
  slug: string
  source: IEntity
  host: IEntity
  stackMode: string
  attributes: { [key: string]: number }
  onApply: IApplyFunc[]
  onDrop: IDropFunc[]
  onTick: ITickFunc[]
  onInterval: ITickFunc[]
  interval: number
  intervalIsHasted: boolean
  _nextInterval: number
  _expires: number
  duration: number
  apply(w: IWorld, e: IEntity): void
  drop(w: IWorld, e: IEntity): void
  tick(w: IWorld): void
}
const DefaultModifier: IModifier = {
  id: 0,
  slug: '',
  source: undefined,
  host: undefined,
  stackMode: 'OVERWRITE',
  attributes: {},
  onApply: [],
  onDrop: [],
  onTick: [],
  onInterval: [],
  interval: 0,
  intervalIsHasted: false,
  _nextInterval: 0,
  duration: 0,
  _expires: 0,
  apply(w: IWorld, e: IEntity): void {
    this.host = e
    //TODO: Base this off of spellID
    let matching = e.modifiers.filter(x => x.slug === this.slug)
    if (matching.length > 0) {
      switch (this.stackMode) {
        case 'OVERWRITE':
          matching.forEach(m => {
            for (var a in m.attributes) {
              //TODO: Move this to world drop
              switch (a.charAt[0]) {
                case '+':
                  e[a] -= m.attributes[a]
                  break
                case '*':
                  e[a] /= m.attributes[a]
                  break
                default:
                // TODO: Error reporting
              }
            }
          })
          e.modifiers = e.modifiers.filter(m => !matching.includes(m))

          break
        case 'EXTEND':
          matching[0]._expires += this.duration
          return
        default:
          debug(`Unrecognized stack mode '${this.stackMode}' on '${this.slug}`)
      }
      for (var a in this.attributes) {
        //TODO: Move this to world drop
        switch (a.charAt[0]) {
          case '+':
            e[a] += this.attributes[a]
            break
          case '*':
            e[a] *= this.attributes[a]
            break
          default:
          // TODO: Error reporting
        }
      }
    }
    let x = Object.create(this) as IModifier
    e.modifiers.push(x)
    x._expires = w.now + x.duration * w._second
    if (x.interval) {
      x._nextInterval = w.now + x.interval * w._second
    }
    for (var a in this.attributes) {
      //TODO: Move this to world apply
      switch (a.charAt[0]) {
        case '+':
          e[a] += x.attributes[a]
          break
        case '*':
          e[a] *= x.attributes[a]
          break
        default:
        // TODO: Error reporting
      }
    }
    x.onApply.forEach(h => h(e))
    debug(`Adding modifier ${x.slug} to ${e.slug}`)
  },
  drop(w: IWorld, e: IEntity): void {
    for (var a in this.attributes) {
      //TODO: Move this to world drop
      switch (a.charAt[0]) {
        case '+':
          e[a] -= this.attributes[a]
          break
        case '*':
          e[a] /= this.attributes[a]
          break
        default:
        // TODO: Error reporting
      }
    }
    this.onDrop.forEach(h => h(e))
    e.modifiers = e.modifiers.filter(x => x != this)
    debug(`Dropping modifier ${this.slug} from ${e.slug}`)
  },
  tick(w: IWorld): void {
    if (this._nextInterval <= w.now) {
      this.onInterval.forEach(h => h(w, this.source, this.host))
      if (this.intervalIsHasted) {
        this._nextInterval += w._second * this.interval / (1 + this.host['haste'])
      } else {
        this._nextInterval += w._second * this.interval
      }
    }
    if (this._expires <= w.now) {
      this.drop(w, this.host)
      return
    }
    this.onTick.forEach(h => h(w, this.host))
  }
}

export { IModifier }
export { DefaultModifier }
