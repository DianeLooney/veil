import Entity from './Entity'

interface IApplyFunc {
  (e: Entity): void
}
interface IDropFunc {
  (e: Entity): void
}
interface ITickFunc {
  (e: Entity): void
}

class Modifier {
  id: number
  slug: string
  host: Entity
  attributes: { [key: string]: number }
  onApply: IApplyFunc[]
  onDrop: IDropFunc[]
  onTick: ITickFunc[]
  expires: number
  key: Symbol

  constructor(...template) {
    this.id = 0
    this.slug = ''
    this.expires = 0
    this.host = undefined
    this.attributes = {}
    this.onApply = []
    this.onDrop = []
    this.onTick = []

    Object.assign(this, ...template)
    this.key = Symbol('modifier:' + this.slug)
  }
  apply(e) {
    this.host = e
    for (var a in this.attributes) {
      e.attributes[a] += this.attributes[a]
    }
    this.onApply.forEach(h => h(e))
  }
  drop(e) {
    for (var a in this.attributes) {
      e.attributes[a] -= this.attributes[a]
    }
    this.onDrop.forEach(h => h(e))
  }
  tick(w) {
    if (this.expires <= w.time) {
      this.drop(this.host)
    }
    this.onTick.forEach(h => h(this.host))
  }
}

export default Modifier
