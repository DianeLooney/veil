import { IAbility } from './ability'
import { IModifier } from './modifier'
import { loadAttributes, IEntity } from './entity'
import { IActor } from './actor'
import { IItem } from './item'
import report from './report'
import * as _debug from 'debug'
const debug = _debug('world')
const debugVerbose = _debug('world:verbose')

class World {
  _second: number
  _tickDelta: number

  now: number
  entities: IEntity[]
  actors: IActor[]
  key: Symbol
  slug: string

  constructor(...template) {
    this.slug = ''
    this._second = 1000
    this._tickDelta = 40

    this.now = 0
    this.entities = []
    this.actors = []

    Object.assign(this, ...template)
    this.key = Symbol('world:' + this.slug)
  }
  tick(): void {
    this.now += this._tickDelta
    this.entities.forEach(e => {
      if (e['gcd:remaining'] !== undefined && e['gcd:remaining'] > 0) {
        e['gcd:remaining'] -= this._tickDelta
      }
    })
    this.entities.forEach(e => {
      e.modifiers.forEach(m => {
        m.tick(this)
      })
    })
    this.entities.forEach(e => {
      e.delays = e.delays.filter(d => {
        if (d.when <= this.now) {
          d.func(this, e)
          return false
        }
        return true
      })
    })
    this.entities.forEach(e => {
      for (let k in e.abilities) {
        let a = e.abilities[k]
        if (a.cooldown == 0 || !a.cooldown) {
          continue
        }
        a.hastedRecharges.forEach(cd => {
          let cap = 1
          if (e[cd + ':cap'] !== undefined) {
            cap = e[cd + ':cap']
          }
          if (e[cd] !== cap) {
            e[cd] = Math.min(cap, e[cd] + e['spell:recharge-rate:hasted'] * this._tickDelta / (this._second * a.cooldown))
          }
        })
      }
    })
    this.actors.forEach(a => {
      a.act(this)
    })
    report('WORLD_TICKED', { time: this.now / this._second })
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
    e.health = e['maxHealth']
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
        a[name] = amount
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
        a[name] = undefined
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
      a.cast(this, ...targets)
    } else {
      //TODO: some error message
    }
  }
  castAbilityByReference(e: IEntity, a: IAbility, ...targets: IEntity[]): void {
    a.cast(this, ...targets)
  }
  dealDamage(e: IEntity, t: IEntity, args: any): void {
    let a: number = 0
    switch (args.type) {
      case 'PHYSICAL':
      case 'FIRE':
        let s: IEntity = args.source
        if (args.mhDamageNorm) {
          let x = s['mainHand:damage:normalized'] * args.mhDamageNorm * s['damage']
          debugVerbose(`adding ${x} damage from mainHand`)
          a += x
        }
        if (args.ohDamageNorm) {
          let x = s['offHand:damage:normalized'] * args.ohDamageNorm * s['damage']
          debugVerbose(`adding ${x} damage from offHand`)
          a += x
        }
        if (args.attackPower) {
          let x = s['attackpower'] * args.attackPower
          debugVerbose(`adding ${x} damage from arrackpower`)
          a += x
        } /*
        if (args.mhDamageRaw) {
          a += args.mhDamageRaw * (s['+mainHand:damage:min'] + Math.random() * (s['+mainHand:damage:max'] - s['+mainHand:damage:min']))
        }
        if (args.ohDamageRaw) {
          a += 0.5 * args.ohDamageRaw * (s['+offHand:damage:min'] + Math.random() * (s['+offHand:damage:max'] - s['+offHand:damage:min']))
        }*/

        break
      default:
        report('ERROR', {
          type: 'NYI',
          details: `dealDamage handling not yet implemented for type ${args.type}`
        })
        return
    }
    args.amount = a
    if (!args.critDisabled) {
      if (Math.random() <= args.source['crit']) {
        args.amount *= 2
        args.didCrit = true
        debugVerbose('spell did crit')
      }
    }
    let dr: number = t['*dr:all']
    debugVerbose(`baseline dr: ${t['*dr:all']}`)
    if (args.type == 'PHYSICAL') {
      debugVerbose(`physical dr: ${t['*dr:physical']}`)
      dr *= t['*dr:physical']
      debugVerbose(`armor dr: ${t['armor']}`)
      dr *= t['armor']
    } else {
      debugVerbose(`magic dr: ${t['*dr:magical']}`)
      dr *= t['*dr:magical']
    }
    args.amount *= dr

    args.amount = Math.round(args.amount)

    if (t.health > args.amount) {
      t.health -= args.amount
      debug(`damage done:\t${args.source.slug}\t${args.target.slug}\t${args.amount}\t${args.ability.slug}`)
      report('DAMAGE_TAKEN', args)
    } else {
      t.health = 0

      report('DAMAGE_TAKEN', args)
      this.kill(args.source, args.ability)
    }
  }
  applyHeal(e: IEntity, t: IEntity, args: any): void {
    args.source = e
    args.target = t
    if (args.attackPower) {
      args.amount += args.attackPower * e['attackpower'] * e['vers:healing-done']
    }

    args.amount = Math.round(args.amount)

    if (t.health + args.amount > t['maxHealth']) {
      t.health = t['maxHealth']
    } else {
      t.health += args.amount
    }
    report('HEALING_DONE', args)
  }
  kill(e: IEntity, a: IAbility): void {
    e.alive = false
    e.health = 0
    report('ENTITY_DIED', { unit: e, killingBlow: a })
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
    m.apply(this, e)
    report('MODIFIER_GAINED', { entity: e, modifier: m })
  }
  unapplyModifier(e: IEntity, m: IModifier): void {
    let i = e.modifiers.indexOf(m)
    e.modifiers.splice(i)
    report('MODIFIER_DROPPED', { entity: e, modifier: m })
  }
}

export default World
