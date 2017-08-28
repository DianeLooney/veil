const consts = require('consts')

class Ability {
  constructor() {
    this.id = 0
    this.slug = ''
    this.key = new Symbol('ability:' + this.slug)
    this.cooldown = 0
    this.charges = 0
    this.onLearn = []
    this.onUnlearn = []
    this.onSpawn = []
    this.onDespawn = []
  }
  triggerCooldown(e) {
    e[this.key].cooldown = this.cooldown
  }
  learn(e) {
    e[this.key].cooldown = 0
    e[this.key].charges = 0
    this.onLearn.forEach(handler => handler(e))
  }
  unlearn(e) {
    this.onUnlearn.forEach(handler => handler(e))
  }
}

module.exports = Ability
