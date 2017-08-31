import { IAbility } from './ability'
import { attachDefaultAttributes, IEntity } from './entity'
import { IActor } from './actor'
import report from './report'

class World {
  _second: number
  _tickDelta: number

  time: number
  entities: IEntity[]
  actors: IActor[]
  key: Symbol
  slug: string

  constructor(...template) {
    this.slug = ''
    this._second = 1000
    this._tickDelta = 50

    this.time = 0
    this.entities = []
    this.actors = []

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
    this.actors.forEach(a => {
      a.act(this)
    })
  }
  attachActor(a: IActor): void {
    this.actors.push(a)
  }
  detachActor(a: IActor): void {
    let i: number = this.actors.indexOf(a)
    if (i >= 0) {
      this.actors.splice(i)
    }
  }
  init(e: IEntity): void {
    attachDefaultAttributes(e)
    e.onInit.forEach(h => h(e))
  }
  spawn(e: IEntity): void {
    this.entities.push(e)
    e.onSpawn.forEach(h => h(e))
    report('ENTITY_SPAWNED', { entity: e })
  }
  despawn(e: IEntity): void {
    let i = this.entities.indexOf(e)
    if (i < 0) {
      report('ERROR', {
        type: 'unable to despawn object',
        details: 'not in the world'
      })
      return
    }
    this.entities.splice(i)
    e.onDespawn.forEach(h => h(e))
    report('ENTITY_DESPAWNED', { entity: e })
  }
}

export default World
