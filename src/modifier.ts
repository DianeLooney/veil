import { IEntity } from './Entity'
import World from './World'

interface IApplyFunc {
  (e: IEntity): void
}
interface IDropFunc {
  (e: IEntity): void
}
interface ITickFunc {
  (e: IEntity): void
}
interface IModifier {
  id: number
  slug: string
  host: IEntity
  attributes: { [key: string]: number }
  onApply: IApplyFunc[]
  onDrop: IDropFunc[]
  onTick: ITickFunc[]
  expires: number
  apply(e: IEntity): void
  drop(e: IEntity): void
  tick(w: World): void
}
const DefaultModifier: IModifier = {
  id: 0,
  slug: '',
  host: undefined,
  attributes: {},
  onApply: [],
  onDrop: [],
  onTick: [],
  expires: 0,
  apply(e: IEntity): void {
    this.host = e
    for (var a in this.attributes) {
      //TODO: Move this to world apply
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
    this.onApply.forEach(h => h(e))
  },
  drop(e: IEntity): void {
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
  },
  tick(w: World): void {
    if (this.expires <= w.now) {
      this.drop(this.host)
    }
    this.onTick.forEach(h => h(this.host))
  }
}

export { IModifier }
export { DefaultModifier }
