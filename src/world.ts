import { IAbility } from './ability'
import { IModifier } from './modifier'
import { loadAttributes, IEntity } from './entity'
import { IActor } from './actor'
import { IItem } from './item'
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
    loadAttributes(e)
    e.onInit.forEach(h => h(this, e))
  }
  spawn(e: IEntity): void {
    this.entities.push(e)
    e.onSpawn.forEach(h => h(this, e))
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
    e.onDespawn.forEach(h => h(this, e))
    report('ENTITY_DESPAWNED', { entity: e })
  }
  gainAttribute(a: any, name: string, amount: number) {
    switch (name.charAt(0)) {
      case '+':
        a[name] += amount
        break
      case '*':
        a[name] *= amount
        break
      default:
      // TODO: Error reporting
    }
  }
  loseAttribute(a: IEntity, name: string, amount: number) {
    switch (name.charAt(0)) {
      case '+':
        a[name] -= amount
        break
      case '*':
        a[name] /= amount
        break
      default:
      // TODO: Error reporting
    }
  }
  equipItem(e: IEntity, slot: string, i: IItem): void {
    if (e.items[slot] !== undefined) {
      //TODO: some error message
      console.log('Equipping a duplicate!')
      return
    }
    e.items[slot] = i
    for (var a in i.stats) {
      this.gainAttribute(e, a, i.stats[a])
    }
    e.onEquipItem.forEach(h => h(this, e, i, slot))
    //TODO: dispatch Item equipped event
  }
  unequipItem(e: IEntity, slot: string): void {
    if (e.items[slot] === undefined) {
      //TODO: some error message
      return
    }
    let i = e.items[slot]
    for (var a in i.stats) {
      this.loseAttribute(e, a, i.stats[a])
    }
    e.items[slot] = undefined
    e.onUnequipItem.forEach(h => h(this, e, i, slot))
    //TODO: Some reporting
  }
  castAbilityByName(e: IEntity, slug: string, ...targets: IEntity[]): void {
    let a = e.abilities[slug]
    if (a) {
      a.cast(...targets)
    } else {
      //TODO: some error message
    }
  }
  dealDamage(e: IEntity, t: IEntity, args: any): void {
    let a: number = args.amount
    switch (args.type) {
      case 'PHYSICAL':
        //a += args.source.attributes['normalized_mh_weapon_damage']
        //a += args.source.attributes['normalized_oh_weapon_damage']
        break
      default:
        report('ERROR', {
          type: 'NYI',
          details: `dealDamage handling not yet implemented for type ${args.type}`
        })
        return
    }

    let dr: number = 1
    if (args.type == 'PHYSICAL' || args.type == 'SWING') {
      dr *= t['*drPhysical']
    } else {
      dr *= t['*drMagical']
    }
    args.amount *= dr
    if (t.health > args.amount) {
      t.health -= args.amount
      report('DAMAGE_TAKEN', args)
    } else {
      t.health = 0
      report('DAMAGE_TAKEN', args)
      this.kill(args.source)
    }
  }
  kill(e: IEntity): void {
    e.alive = false
    e.health = 0
    report('ENTITY_DIED', { unit: e, killingBlow: null })
  }
  teachAbility(e: IEntity, a: IAbility): void {
    if (!e.abilities[a.slug]) {
      e.abilities[a.slug] = a
      a.learn(this, e)
      report('ABILITY_LEARNED', { entity: this, ability: a })
    }
  }
  unteachAbility(e: IEntity, a: IAbility): void {
    if (e.abilities[a.slug]) {
      e.abilities[a.slug].unlearn(this, e)
      e.abilities[a.slug] = undefined
      report('ABILITY_UNLEARNED', { entity: e, ability: a })
    }
  }
  applyModifier(e: IEntity, m: IModifier): void {
    e.modifiers.push(m)
    m.apply(e)
    report('MODIFIER_GAINED', { entity: e, modifier: m })
  }
  unapplyModifier(e: IEntity, m: IModifier): void {
    let i = e.modifiers.indexOf(m)
    e.modifiers.splice(i)
    report('MODIFIER_DROPPED', { entity: e, modifier: m })
  }
}

export default World
