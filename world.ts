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
  tick() {
    this.time += this._tickDelta
    this.entities.forEach(e => {
      e.modifiers.forEach(m => {
        m.tick(this)
      })
    })
  }
  spawn(e) {
    if (e instanceof Entity) {
      this.entities.push(e)
      e.onSpawn.forEach(h => h(e))
      report('ENTITY_SPAWNED', { entity: e })
      return
    }
    report('ERROR', { type: 'unable to spawn object', details: 'not recognized as an entity' })
  }
  despawn(e) {
    if (e instanceof Entity) {
      let i = this.entities.indexOf(e)
      if (i < 0) {
        report('ERROR', { type: 'unable to despawn object', details: 'not in the world' })
        return
      }
      this.entities.splice(i)
      e.onDespawn.forEach(h => h(e))
      report('ENTITY_DESPAWNED', { entity: e })
      return
    }
    report('ERROR', { type: 'unable to despawn object', details: 'not recognized as an entity' })
  }
}

export default World
