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
      e._attributes[a] += this.attributes[a]
    }
    this.onApply.forEach(h => h(e))
  },
  drop(e: IEntity): void {
    for (var a in this.attributes) {
      e._attributes[a] -= this.attributes[a]
    }
    this.onDrop.forEach(h => h(e))
  },
  tick(w: World): void {
    if (this.expires <= w.time) {
      this.drop(this.host)
    }
    this.onTick.forEach(h => h(this.host))
  }
}

export { IModifier }
export { DefaultModifier }
