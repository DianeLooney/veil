import { IAbility } from './ability'
import { IModifier } from './modifier'
import { IEntity } from './entity'
import { IItem } from './item'
import { IWorld } from './world'
import { parse, build } from './templates/attributeParser'
import report from './report'
import * as _debug from 'debug'
const debug = _debug('actions')
const debugVerbose = _debug('actions:verbose')

const SpawnEntity = (w: IWorld, e: IEntity): void => {
  w.entities.push(e)
  e.health = e['maxHealth']
  e.onSpawn.forEach(h => h(w, e))
  report('ENTITY_SPAWNED', { entity: e })
}
export { SpawnEntity }
const DespawnEntity = (w: IWorld, e: IEntity): void => {
  let i = w.entities.indexOf(e)
  if (i < 0) {
    report('ERROR', {
      type: 'unable to despawn object',
      details: 'not in the world'
    })
    return
  }
  w.entities.splice(i)
  e.onDespawn.forEach(h => h(w, e))
  report('ENTITY_DESPAWNED', { entity: e })
}
export { DespawnEntity }
const TickWorld = (w: IWorld): void => {
  w.now += w._tickDelta
  w.entities.forEach(e => {
    if (e['gcd:remaining'] !== undefined && e['gcd:remaining'] > 0) {
      e['gcd:remaining'] -= w._tickDelta
    }
  })
  w.entities.forEach(e => {
    e.modifiers.forEach(m => {
      if (m._nextInterval <= w.now) {
        m.onInterval.forEach(h => h(w, m.source, m.host))
        if (m.intervalIsHasted) {
          m._nextInterval += w._second * m.interval / (1 + m.host['haste'])
        } else {
          m._nextInterval += w._second * m.interval
        }
      }
      if (m._expires <= w.now) {
        m.drop(w, m.host)
        return
      }
      m.onTick.forEach(h => h(w, m.source, m.host))
    })
  })
  w.entities.forEach(e => {
    e.delays = e.delays.filter(d => {
      if (d.when <= w.now) {
        d.func(w, e)
        return false
      }
      return true
    })
  })
  w.entities.forEach(e => {
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
          e[cd] = Math.min(cap, e[cd] + e['spell:recharge-rate:hasted'] * w._tickDelta / (w._second * a.cooldown))
        }
      })
    }
  })
  report('WORLD_TICKED', { time: w.now / w._second })
}
export { TickWorld }
const LoadDefaultAttributes = function(e: IEntity) {
  let d = build(parse(e._attributes))
  for (let i in d) {
    let k = i
    let r = d[k]
    switch (typeof r.value) {
      case 'function':
        delete e[k]
        Object.defineProperty(e, k, {
          get: function() {
            if (e[`__${k}__`] === undefined) {
              e[`__${k}__`] = r.value(e)
            }
            return e[`__${k}__`]
          },
          set: function(v) {
            console.error(`Unable to set attribute ${k} of ${e.slug}`)
          }
        })
        break
      default:
        delete e[k]
        e[k] = r.value
    }
  }
}
export { LoadDefaultAttributes }
const InitEntity = (w: IWorld, e: IEntity): void => {
  LoadDefaultAttributes(e)
  e.onInit.forEach(h => h(w, e))
}
export { InitEntity }
const GainAttribute = (a: any, name: string, val: number): void => {
  switch (name.charAt(0)) {
    case '+':
      a[name] += val
      break
    case '*':
      a[name] *= val
      break
    default:
      a[name] = val
    // TODO: Error reporting
  }
}
export { GainAttribute }
const LoseAttribute = (a: any, name: string, val: number): void => {
  switch (name.charAt(0)) {
    case '+':
      a[name] -= val
      break
    case '*':
      a[name] /= val
      break
    default:
      a[name] = undefined
    // TODO: Error reporting
  }
}
export { LoseAttribute }
const EquipItem = (w: IWorld, e: IEntity, slot: string, i: IItem): void => {
  if (e.items[slot] !== undefined) {
    //TODO: some error message
    return
  }
  e.items[slot] = i
  for (var stat in i.stats) {
    GainAttribute(e, stat, i.stats[stat])
  }
  e.onEquipItem.forEach(h => h(w, e, i, slot))
  //TODO: dispatch Item equipped event
}
export { EquipItem }
const UnequipItem = (w: IWorld, e: IEntity, slot: string): void => {
  if (e.items[slot] === undefined) {
    //TODO: some error message
    return
  }
  let i = e.items[slot]
  for (var a in i.stats) {
    LoseAttribute(e, a, i.stats[a])
  }
  e.items[slot] = undefined
  e.onUnequipItem.forEach(h => h(w, e, i, slot))
  //TODO: Some reporting
}
export { UnequipItem }
const CastAbilityByName = (w: IWorld, e: IEntity, slug: string, ...targets: IEntity[]): void => {
  let a = e.abilities[slug]
  if (a) {
    a.cast(w, ...targets)
  } else {
    //TODO: some error message
  }
}
export { CastAbilityByName }
const CastAbilityByReference = (w: IWorld, e: IEntity, a: IAbility, ...targets: IEntity[]): void => {
  a.cast(w, ...targets)
}
export { CastAbilityByReference }
const DealDamage = (e: IEntity, t: IEntity, args: any): void => {
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
    debug(`unit died from:${args.source.slug}\t${args.target.slug}\t${args.amount}\t${args.ability.slug}`)
    report('DAMAGE_TAKEN', args)
    Kill(args.source, args.ability)
  }
}
export { DealDamage }
const DealHealing = (e: IEntity, t: IEntity, args: any): void => {
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
export { DealHealing }
const Kill = (e: IEntity, a: IAbility): void => {
  e.alive = false
  e.health = 0
  report('ENTITY_DIED', { unit: e, killingBlow: a })
}
export { Kill }
const TeachAbility = (w: IWorld, e: IEntity, a: IAbility): void => {
  if (!e.abilities[a.slug]) {
    e.abilities[a.slug] = a
    a.learn(w, e)
    report('ABILITY_LEARNED', { entity: e, ability: a })
  }
}
export { TeachAbility }
const UnteachAbility = (w: IWorld, e: IEntity, a: IAbility): void => {
  if (e.abilities[a.slug]) {
    e.abilities[a.slug].unlearn(this, e)
    e.abilities[a.slug] = undefined
    report('ABILITY_UNLEARNED', { entity: e, ability: a })
  }
}
export { UnteachAbility }
const ApplyModifier = (w: IWorld, e: IEntity, m: IModifier): void => {
  e.modifiers.push(m)
  m.apply(w, e)
  report('MODIFIER_GAINED', { entity: e, modifier: m })
}
export { ApplyModifier }
const UnapplyModifier = (e: IEntity, m: IModifier): void => {
  let i = e.modifiers.indexOf(m)
  e.modifiers.splice(i)
  report('MODIFIER_DROPPED', { entity: e, modifier: m })
}
export { UnapplyModifier }
const TriggerGCD = (e: IEntity): void => {
  e['gcd:remaining'] = e['gcd:time']
}
export { TriggerGCD }
const IsOnGCD = (e: IEntity): boolean => {
  return e['gcd:remaining'] > 0
}
export { IsOnGCD }
