import { IPassiveTemplate, IAbilityTemplate, IAbilityInstance } from './ability'
import { ITickerTemplate, IModifierTemplate, ITickerInstance, IModifierInstance } from './modifier'
import { IEntity, ITalentSlot, IPosition, IVector } from './entity'
import { IItem } from './item'
import { IWorld, formatTime } from './world'
import { parse, build } from './templates/attributeParser'
import report from './report'
import { start, end } from './perf'

const _debug = require('debug')
let debug: any
if (process.env.VEIL_MODE !== 'PERF') {
  debug = _debug('actions')
} else {
  debug = function() {}
}
let verbose
if (process.env.VEIL_MODE !== 'PERF') {
  verbose = _debug('actions:verbose')
} else {
  verbose = function() {}
}
const SpawnEntity = (w: IWorld, e: IEntity): void => {
  e.key = Symbol(`[Entity:${e.slug}]`)
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
  //start('loop2')
  w.entities.forEach(e => {
    while (e.tickers[0] !== undefined && e.tickers[0].nextTick <= w.now) {
      let x = e.tickers.shift() as ITickerInstance
      x.template.onInterval.forEach(h => h(w, x.source, e))
      let next = Math.min(
        x.expires,
        x.nextTick + w._second * x.template.interval * (x.template.intervalIsHasted ? 1 / (1 + x.source['haste']) : 1)
      )
      if (next > w.now) {
        x.nextTick = next
        e.tickers.push(x)
        e.tickers.sort((x, y) => x.nextTick - y.nextTick)
      } else {
        for (let a in x.template.attributes) {
          LoseAttribute(e, a, x.template[a])
        }
        x.template.onDrop.forEach(h => h(e))
      }
    }
    while (e.mods[0] !== undefined && e.mods[0].expires <= w.now) {
      let x = e.mods.shift()
      for (let a in x.template.attributes) {
        LoseAttribute(e, a, x.template.attributes[a])
      }
      //verbose`Expired mod ${x.template.slug} at ${w.now / 1000}`)
    }
  })
  //end('loop2')
  //start('loop3')
  w.entities.forEach(e => {
    while (e.delays.length > 0 && e.delays[0].when <= w.now) {
      e.delays[0].func(w, e)
      e.delays.splice(0, 1)
    }
  })
  //end('loop3')
  //start('loop4')
  w.entities.forEach(e => {
    let changes = false
    while (e.rechargingAbilities.length > 0 && e.rechargingAbilities[0].willFinishCharging <= w.now) {
      let a = e.rechargingAbilities[0]
      //verbose`handling charges for ${a.template.slug}: ${a.willFinishCharging}`)

      a.currentCharges = a.currentCharges + 1
      a.currentCharges = Math.min(a.template.chargeMax, a.currentCharges)
      if (a.currentCharges < a.template.chargeMax) {
        a.startedCharging = a.willFinishCharging
        a.willFinishCharging =
          a.startedCharging +
          (a.template.cooldown + a.attributes['+cooldown']) * (a.template.cooldownIsHasted ? 1 / (1 + e['haste']) : 1) * w._second
      } else {
        e.rechargingAbilities.splice(0, 1)
      }
      changes = true
    }
    if (changes) {
      e.rechargingAbilities.sort((x, y) => x.willFinishCharging - y.willFinishCharging)
    }
  })
  //end('loop4')
  report('WORLD_TICKED', { time: w.now / w._second })
}
export { TickWorld }
const Delayed = function(w: IWorld, e: IEntity, f: any) {
  e.delays.push(f)
  e.delays.sort((x, y) => x.when - y.when)
}
export { Delayed }

const InitEntity = (w: IWorld, e: IEntity, c?: any): void => {
  e.talentsByRow = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
  ]
  e.talentsBySlug = {}
  e._talents.forEach(t => {
    e.talentsByRow[t.row][t.column] = t
    e.talentsBySlug[t.slug] = t
  })

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
    if (stat === 'ability') {
      let y = i.stats.ability as any
      for (var ability in y) {
        let x = e.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in y[ability]) {
          GainAttribute(x, s, y[ability][s])
        }
      }
    } else {
      GainAttribute(e, stat, i.stats[stat])
    }
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
  for (var stat in i.stats) {
    if (stat === 'ability') {
      let y = i.stats[stat]
      for (var ability in i.stats[stat]) {
        let x = e.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in i.stats[stat][ability]) {
          LoseAttribute(x, s, i.stats[stat][ability][s])
        }
      }
    } else {
      LoseAttribute(e, stat, i.stats[stat])
    }
  }
  e.items[slot] = undefined
  e.onUnequipItem.forEach(h => h(w, e, i, slot))
  //TODO: Some reporting
}
export { UnequipItem }
const CastAbilityByName = (w: IWorld, e: IEntity, slug: string, ...targets: IEntity[]): boolean => {
  let a = e.abilities[slug]
  if (a) {
    return CastAbilityByReference(w, e, a, ...targets)
  } else {
    //TODO: some error message
  }
}
export { CastAbilityByName }
const CastAbilityByReference = (w: IWorld, e: IEntity, i: IAbilityInstance, ...targets: IEntity[]): boolean => {
  let a = i.template
  ////start('onGCD')
  if (a.onGCD && IsOnGCD(w, e)) {
    ////end('onGCD')
    return false
  }
  ////end('onGCD')
  ////start('cooldown')
  if (a.cooldown + i.attributes['+cooldown'] > 0 && i.currentCharges < 1) {
    //end('cooldown')
    return false
  }
  //end('cooldown')
  //start('requires')
  for (let i in a.requires) {
    if (e[i] < a.requires[i]) {
      //end('requires')
      return false
    }
  }
  //end('requires')
  //start('costs')
  for (let i in a.cost) {
    if (e[i] < a.cost[i]) {
      return false
    }
  }
  CastFreeAbilityByReference(w, e, i, ...targets)
  return true
}
export { CastAbilityByReference }
const CastFreeAbilityByReference = (w: IWorld, e: IEntity, i: IAbilityInstance, ...targets: IEntity[]): boolean => {
  let a = i.template
  report('ABILITY_CASTED', { entity: e, spell: i.template })
  debug(`\t${formatTime(w.now)}\t${e.slug} casts ${a.slug}`)
  //end('costs')
  i.currentCharges = i.currentCharges - 1
  //start('a.cooldown')
  if (a.cooldown + i.attributes['+cooldown'] > 0) {
    i.startedCharging = w.now
    i.willFinishCharging = w.now + (a.cooldown + i.attributes['+cooldown']) * (a.cooldownIsHasted ? 1 / (1 + e['haste']) : 1) * w._second
    if (!e.rechargingAbilities.includes(i)) {
      e.rechargingAbilities.push(i)
    }

    e.rechargingAbilities.sort((x, y) => x.willFinishCharging - y.willFinishCharging)
  }
  //end('a.cooldown')
  //start('costremove')
  for (let i in a.cost) {
    e[i] -= a.cost[i]
  }
  //end('costremove')
  //start('targets.length')
  if (targets.length > 0) {
    //debug(`${e.slug} casting ${a.slug} on targets: ${targets.toString()}`)
    targets.forEach(t => a.onCast.forEach(h => h(w, e, i, t)))
  } else {
    //debug(`${e.slug} casting ${a.slug}`)
    a.onCast.forEach(h => h(w, e, i))
  }
  //end('targets.length')
  //start('triggerGCD')
  if (a.triggersGCD) {
    TriggerGCD(w, e)
  }
  //end('triggerGCD')
  return false
}
export { CastFreeAbilityByReference }
const CastFreeAbilityByTemplate = (w: IWorld, e: IEntity, tmpl: IAbilityTemplate, ...targets: IEntity[]): void => {
  if (targets.length > 0) {
    targets.forEach(t =>
      tmpl.onCast.forEach(h => h(w, e, { attributes: Object.assign({}, tmpl._abilityAttributes, tmpl.abilityAttributes) } as any, t))
    )
  } else {
    tmpl.onCast.forEach(h => h(w, e, { attributes: Object.assign({}, tmpl._abilityAttributes, tmpl.abilityAttributes) } as any))
  }
}
export { CastFreeAbilityByTemplate }
const DealDamage = (w: IWorld, e: IEntity, t: IEntity, args: any): void => {
  //start('deal-damage:first-half')
  let a: number = 0
  switch (args.type) {
    case 'PHYSICAL':
    case 'FIRE':
      let s: IEntity = args.source
      if (args.mhDamageNorm !== undefined) {
        a += s['mainHand:damage:normalized'] * args.mhDamageNorm * s['damage']
      }
      if (args.ohDamageNorm !== undefined) {
        a += s['offHand:damage:normalized'] * args.ohDamageNorm * s['damage']
      }
      if (args.attackPower !== undefined) {
        a += s['attackpower'] * args.attackPower
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
  //end('deal-damage:first-half')
  //start('deal-damage:second-half')

  args.amount = a
  if (t[e.key] !== undefined && t[e.key]['*target:damage'] !== undefined) {
    args.amount *= t[e.key]['*target:damage']
  }
  if (!args.critDisabled) {
    let critChance = args.source['crit']
    if (t[e.key] !== undefined && t[e.key]['+crit'] !== undefined) {
      critChance += t[e.key]['+crit']
    }
    if (Math.random() <= critChance) {
      args.amount *= 2
      args.didCrit = true
      //verbose'spell did crit')
    }
  }
  //end('deal-damage:second-half')
  //start('deal-damage:third-half')
  let dr: number = t['*dr:all']
  if (args.type == 'PHYSICAL') {
    dr *= t['*dr:physical']
    dr *= t['armor']
  } else {
    dr *= t['*dr:magical']
  }
  args.amount *= dr
  //end('deal-damage:third-half')
  args.amount = Math.round(args.amount)

  t.hookDamageTakenPost.forEach(h => h(w, e, t, args))
  if (t.health > args.amount) {
    t.health -= args.amount
    ////debug(`damage done:\t${args.source.slug}\t${args.target.slug}\t${args.amount}\t${args.ability.slug}`)
    report('DAMAGE_TAKEN', args)
  } else {
    t.health = 0
    ////debug(`unit died from:${args.source.slug}\t${args.target.slug}\t${args.amount}\t${args.ability.slug}`)
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
const Kill = (e: IEntity, a: IAbilityTemplate): void => {
  e.alive = false
  e.health = 0
  report('ENTITY_DIED', { unit: e, killingBlow: a })
}
export { Kill }
const TeachAbility = (w: IWorld, e: IEntity, a: IAbilityTemplate): void => {
  let x: IAbilityInstance = {
    template: a,
    currentCharges: a.chargeMax,
    startedCharging: -1,
    willFinishCharging: -1,
    attributes: Object.assign({}, a._abilityAttributes, a.abilityAttributes)
  }
  e.restingAbilities.push(x)
  e.abilities[a.slug] = x
  for (let attr in a.attributes) {
    GainAttribute(e, attr, a.attributes[attr])
  }
  report('ABILITY_LEARNED', { entity: e, ability: a })
  if (!e.abilities[a.slug]) {
    e.abilities[a.slug] = x
  }
}
export { TeachAbility }
const UnteachAbility = (w: IWorld, e: IEntity, a: IAbilityInstance): void => {
  //Ignored for now
}
export { UnteachAbility }

const TeachPassive = (w: IWorld, e: IEntity, p: IPassiveTemplate) => {
  for (let a in p.attributes) {
    GainAttribute(e, a, p.attributes[a])
  }
  e.passives.push(p)
}
export { TeachPassive }
const UnteachPassive = (w: IWorld, e: IEntity, p: IPassiveTemplate) => {
  let i = e.passives.indexOf(p)
  if (i < 0) {
    return
  }
  for (let a in p.attributes) {
    LoseAttribute(e, a, p.attributes[a])
  }
  e.passives.splice(i, 1)
}
export { UnteachPassive }
const ApplyMod = (w: IWorld, src: IEntity, tar: IEntity, m: IModifierTemplate): void => {
  let x: IModifierInstance = {
    template: m,
    source: src,
    applied: w.now,
    expires: w.now + m.duration * (m.durationIsHasted ? 1 / (1 + src['haste']) : 1) * w._second
  }
  switch (m.stackMode) {
    case 'OVERWRITE':
      {
        let matching = tar.mods.filter(y => y.template.id == x.template.id && y.source == x.source)
        matching.forEach(z => {
          _dropModifierAttrs(w, z.source, tar, z.template)
        })
        if (matching.length > 0) {
          tar.mods = tar.mods.filter(y => !(y.template.id == x.template.id && y.source == x.source))
        }
        _applyModifierAttrs(w, src, tar, m)
        tar.mods.push(x)
      }
      break
    case 'EXTEND':
      {
        let extendable = tar.mods.filter(y => y.template.id == x.template.id && y.source == x.source)
        if (extendable.length > 0) {
          //verbose`extending the old mod for ${m.slug}`)
          extendable[0].expires += m.duration * (m.durationIsHasted ? 1 / (1 + src['haste']) : 1) * w._second
        } else {
          //verbose`Applying a new mod ${m.slug} at ${w.now}`)
          tar.mods.push(x)
        }
      }
      break
    case 'DISJOINT':
      x.expires += m.duration * (m.durationIsHasted ? 1 / (1 + src['haste']) : 1) * w._second
      tar.mods.push(x)
      _applyModifierAttrs(w, src, tar, m)
      //verbose`${m.slug} was just attached`)
      break
    default:
    //debug(`Unrecognized mod stackMode: '${m.stackMode}'`)
  }
  tar.mods.sort((x, y) => x.expires - y.expires)
}
const _applyModifierAttrs = (w: IWorld, src: IEntity, tar: IEntity, m: IModifierTemplate): void => {
  for (let a in m.attributes) {
    GainAttribute(tar, a, m.attributes[a])
  }
  for (let attr in m.attributes) {
    if (attr === 'ability') {
      let y = m.attributes.ability as any
      for (var ability in y) {
        let x = tar.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in y[ability]) {
          GainAttribute(x, s, y[ability][s])
        }
      }
    } else {
      GainAttribute(tar, attr, m.attributes[attr])
    }
  }
  if (m.sourcedAttributes !== undefined) {
    if (tar[src.key] === undefined) {
      tar[src.key] = {}
    }
    for (let a in m.sourcedAttributes) {
      GainAttribute(tar[src.key], a, m.sourcedAttributes[a])
    }
  }
}
const _dropModifierAttrs = (w: IWorld, src: IEntity, tar: IEntity, m: IModifierTemplate): void => {
  for (let attr in m.attributes) {
    if (attr === 'ability') {
      let y = m.attributes[attr]
      for (var ability in m.attributes[attr] as any) {
        let x = tar.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in m.attributes[attr][ability]) {
          LoseAttribute(x, s, m.attributes[attr][ability][s])
        }
      }
    } else {
      LoseAttribute(tar, attr, m.attributes[attr])
    }
  }
  if (m.sourcedAttributes !== undefined) {
    for (let a in m.sourcedAttributes) {
      LoseAttribute(tar[src.key], a, m.sourcedAttributes[a])
    }
  }
}
const _applyTickerAttrs = (w: IWorld, src: IEntity, tar: IEntity, m: ITickerTemplate): void => {
  for (let a in m.attributes) {
    GainAttribute(tar, a, m.attributes[a])
  }
  for (let attr in m.attributes) {
    if (attr === 'ability') {
      let y = m.attributes[attr]
      for (var ability in m.attributes[attr] as any) {
        let x = tar.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in m.attributes[attr][ability]) {
          GainAttribute(x, s, m.attributes[attr][ability][s])
        }
      }
    } else {
      GainAttribute(tar, attr, m.attributes[attr])
    }
  }
  if (m.sourcedAttributes !== undefined) {
    if (tar[src.key] === undefined) {
      tar[src.key] = {}
    }
    for (let a in m.sourcedAttributes) {
      GainAttribute(tar[src.key], a, m.sourcedAttributes[a])
    }
  }
}
const _dropTickerAttrs = (w: IWorld, src: IEntity, tar: IEntity, m: ITickerTemplate): void => {
  for (let a in m.attributes) {
    LoseAttribute(tar, a, m.attributes[a])
  }
  for (let attr in m.attributes) {
    if (attr === 'ability') {
      let y = m.attributes[attr]
      for (var ability in m.attributes[attr] as any) {
        let x = tar.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in m.attributes[attr][ability]) {
          LoseAttribute(x, s, m.attributes[attr][ability][s])
        }
      }
    } else {
      LoseAttribute(tar, attr, m.attributes[attr])
    }
  }
  if (m.sourcedAttributes !== undefined) {
    for (let a in m.sourcedAttributes) {
      LoseAttribute(tar[src.key], a, m.sourcedAttributes[a])
    }
  }
}
export { ApplyMod }
const ApplyTicker = (w: IWorld, src: IEntity, tar: IEntity, t: ITickerTemplate): void => {
  let x: ITickerInstance = {
    template: t,
    source: src,
    applied: w.now,
    expires: w.now + t.duration * (t.durationIsHasted ? 1 / (1 + src['haste']) : 1) * w._second,
    nextTick: w.now + t.interval * (t.intervalIsHasted ? 1 / (1 + src['haste']) : 1) * w._second
  }
  switch (t.stackMode) {
    case 'OVERWRITE':
      {
        let matching = tar.tickers.filter(y => y.template.id == t.id && y.source == src)
        matching.forEach(z => {
          for (let a in z.template.attributes) {
            LoseAttribute(tar, a, z.template.attributes[a])
          }
        })
        if (matching.length > 0) {
          tar.tickers = tar.tickers.filter(y => !(y.template.id == t.id && y.source == src))
        }
        tar.tickers.push(x)
      }
      break
    case 'EXTEND':
      {
        let extendable = tar.tickers.filter(y => y.template.id == t.id && y.source == src)
        if (extendable.length > 0) {
          //verbose`extending the old mod for ${t.slug}`)
          extendable[0].expires += t.duration * (t.durationIsHasted ? 1 / (1 + src['haste']) : 1) * w._second
        } else {
          //verbose`Applying a new mod ${t.slug} at ${w.now}`)
          tar.tickers.push(x)
        }
      }
      break
    case 'DISJOINT':
      x.expires += t.duration * (t.durationIsHasted ? 1 / (1 + src['haste']) : 1) * w._second
      tar.tickers.push(x)
      for (let a in t.attributes) {
        GainAttribute(tar, a, t.attributes[a])
      }
      //verbose`${t.slug} was just attached`)
      break
    default:
    //debug(`Unrecognized mod stackMode: '${t.stackMode}'`)
  }
  tar.tickers.sort((x, y) => x.nextTick - y.nextTick)
}

export { ApplyTicker }

const TriggerGCD = (w: IWorld, e: IEntity): void => {
  e['gcd:started'] = w.now
  e['gcd:refreshes'] = w.now + e['gcd:time']
}
export { TriggerGCD }
const IsOnGCD = (w: IWorld, e: IEntity): boolean => {
  if (e['gcd:refreshes'] === undefined) {
    return false
  }
  return e['gcd:refreshes'] > w.now
}
export { IsOnGCD }

const DistanceBetweenUnits = (e1: IEntity, e2: IEntity): number => {
  let dx = e1.position.x - e2.position.x
  let dy = e1.position.y - e2.position.y
  return Math.sqrt(dx * dx + dy * dy)
}
export { DistanceBetweenUnits }

const DistanceToUnitCenter = (pos: IPosition, e: IEntity): number => {
  let dx = pos.x - e.position.x
  let dy = pos.y - e.position.y
  return Math.sqrt(dx * dx + dy * dy)
}
const DistanceToUnitHitbox = (pos: IPosition, e: IEntity): number => {
  return Math.max(0, DistanceToUnitCenter(pos, e) - e.hitradius)
}
export { DistanceToUnitHitbox }
const EnemiesTouchingRadius = (w: IWorld, pos: IPosition, r: number): IEntity[] => {
  return w.entities.filter(x => x.friendly === false && DistanceToUnitHitbox(pos, x) <= r)
}
export { EnemiesTouchingRadius }
const UnitVector = (v: IVector): IVector => {
  if (v.dx === 0 && v.dy === 0) {
    return { dx: 1, dy: 0 }
  }
  let d = Math.sqrt(v.dx * v.dx + v.dy * v.dy)
  return { dx: v.dx / d, dy: v.dy / d }
}
export { UnitVector }
const SelectTalent = (w: IWorld, e: IEntity, t: ITalentSlot): void => {
  if (e._talents.filter(x => x === t).length === 0) {
    console.error(`Unable to select the talent ${t.slug} as it isn't taught to ${e.slug}`)
    return
  }
  t.actives.forEach(a => TeachAbility(w, e, a))
  t.passives.forEach(p => TeachPassive(w, e, p))
  for (let attr in t.attributes) {
    if (attr === 'ability') {
      let y = t.attributes[attr]
      for (var ability in t.attributes[attr] as any) {
        let x = e.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in t.attributes[attr][ability]) {
          GainAttribute(x, s, t.attributes[attr][ability][s])
        }
      }
    } else {
      GainAttribute(e, attr, t.attributes[attr])
    }
  }
  t.enabled = true
  //TODO: Log this somewhere
}
export { SelectTalent }
const UnselectTalent = (w: IWorld, e: IEntity, t: ITalentSlot): void => {
  //t.actives.forEach(a => UnteachAbility(w, e, a)) //TODO: Fix this eventually
  t.passives.forEach(p => UnteachPassive(w, e, p))
  for (let attr in t.attributes) {
    if (attr === 'ability') {
      let y = t.attributes[attr]
      for (var ability in t.attributes[attr] as any) {
        let x = e.abilities[ability]
        if (x === undefined) {
          continue
        }
        for (var s in t.attributes[attr][ability]) {
          LoseAttribute(x, s, t.attributes[attr][ability][s])
        }
      }
    } else {
      LoseAttribute(e, attr, t.attributes[attr])
    }
  }
  t.enabled = false
}
export { UnselectTalent }
