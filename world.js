const Ability = require('./ability.js')
const Entity = require('./entity.js')

class World {
  constructor() {
    this.tickDelta
    this.entities = []
  }
  tick() {}
  spawn(e) {
    if (e instanceof Entity) {
      this.entities.push(e)
      e.onSpawn.forEach(h => h())
      return
    }
    console.error('unable to spawn object: not recognized as an entity')
  }
  despawn(e) {
    if (e instanceof Entity) {
      let i = this.entities.indexOf(e)
      if (i < 0) {
        console.error('unable to despawn object: not in the world')
        return
      }
      this.entities.splice(i)
      e.onDespawn.forEach(h => h())
      return
    }
    console.error('unable to despawn object: not recognized as an entity')
  }
}
