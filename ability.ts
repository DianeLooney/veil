class Ability {
  constructor(...template) {
    this.id = 0
    this.slug = ''
    this.cooldown = 0
    this.triggersGCD = true
    this.onGCD = true
    this.charges = 0
    this.host = undefined
    this.onLearn = []
    this.onUnlearn = []
    this.onSpawn = []
    this.onDespawn = []
    this.onCast = []

    this.castability = []

    Object.assign(this, ...template)
    this.onLearn = this.onLearn.map(x => x.bind(this))
    this.onUnlearn = this.onUnlearn.map(x => x.bind(this))
    this.onSpawn = this.onSpawn.map(x => x.bind(this))
    this.onDespawn = this.onDespawn.map(x => x.bind(this))
    this.onCast = this.onCast.map(x => x.bind(this))
    this.key = Symbol('ability:' + this.slug)
  }
  triggerCooldown(e) {
    e[this.key].cooldown = this.cooldown
  }
  learn(e) {
    this.host = e
    this.onLearn.forEach(h => h(e))
  }
  unlearn(e) {
    this.onUnlearn.forEach(h => h(e))
  }
  cast(...targets) {
    targets.forEach(t => this.onCast.forEach(h => h(this.host, t)))
  }
}

export default Ability
