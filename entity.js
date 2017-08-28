class Entity {
  constructor() {
    this.id = 0
    this.slug = ''
    this.key = new Symbol('entity:', this.slug)
    this.name = ''
    this.health = 0
    this.attributes = {}

    this.maxHealthBase = 0
    this.attributes['+maxHealth'] = 0
    this.attributes['*maxHealth'] = 0

    this.abilities = {}
    this.modifiers = []
    this.onSpawn = []
    this.onDespawn = []
  }
  maxHealth() {
    return (
      (this.attributes['+maxHealth'] + this.maxHealthBase) *
      (1 + this.attributes['*maxHealth'])
    )
  }
  learnAbility(a) {
    this.abilities[a.key] = a
    a.learn(this)
  }
  unlearnAbility(a) {
    this.abilities[a.key] = undefined
    a.unlearn(this)
  }
}
module.exports = Entity
