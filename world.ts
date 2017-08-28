import Ability from './ability'
import Entity from './entity'
import report from './report'

class World {
  _second: number
  _tickDelta: number

  time: number
  entities: Entity[]
  key: Symbol
  slug: string

  constructor(...template) {
    this.slug = ''
    this._second = 1000
    this._tickDelta = 50

    this.time = 0
    this.entities = []

    Object.assign(this, ...template)
    this.key = Symbol('world:' + this.slug)
  }
  tick(): void {
    this.time += this._tickDelta
    this.entities.forEach(e => {
      e.modifiers.forEach(m => {
        m.tick(this)
      })
    })
  }
  spawn(e: Entity): void {
    this.entities.push(e)
    e.onSpawn.forEach(h => h(e))
    report('ENTITY_SPAWNED', { entity: e })
  }
  despawn(e: Entity): void {
    let i = this.entities.indexOf(e)
    if (i < 0) {
      report('ERROR', { type: 'unable to despawn object', details: 'not in the world' })
      return
    }
    this.entities.splice(i)
    e.onDespawn.forEach(h => h(e))
    report('ENTITY_DESPAWNED', { entity: e })
  }
}

export default World
