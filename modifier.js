class Modifier {
  constructor() {
    this.id = 0
    this.slug = ''
    this.key = new Symbol('modifier:' + this.slug)
    this.attributes = {}
  }
  apply(e) {
    for (var a in this.attributes) {
      e.attributes[a] += this.attributes[a]
    }
  }
  drop(e) {
    for (var a in this.attributes) {
      e.attributes[a] -= this.attributes[a]
    }
  }
}
