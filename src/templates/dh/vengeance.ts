import { IEntity, DefaultEntity } from '../../Entity'
import { IItem } from '../../item'
import { IWorld, formatTime } from '../../world'
import * as _ from '../../actions'
import { IAbilityTemplate, AbilityDefaults, IPassiveTemplate } from '../../Ability'
import { DefaultModifier, IModifier, IModifierTemplate, ITickerTemplate } from '../../Modifier'
import { sequence, rppm } from '../../rng'
import report from '../../report'
import * as _debug from 'debug'
import { start, end } from '../../perf'
const debug = _debug('vengeance')
const verbose = _debug('verbose:vengeance')

import artifactMappings from '../../consts/artifactMappings'

const soulFragmentConsume: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 204255,
  slug: 'soul-fragment-consume',
  onGCD: false,
  triggersGCD: false
})
const infernalStrike: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 189110,
  slug: 'infernal-strike',

  cooldown: 12,
  chargeMax: 2,
  cooldownIsHasted: true,

  onGCD: false,
  triggersGCD: false,

  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      let pos = Object.assign({}, t.position)
      _.Delayed(w, e, {
        when: w.now + 0.75 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          e.position = pos
          _.EnemiesTouchingRadius(w, pos, 6).forEach(tar => {
            _.DealDamage(w, e, tar, {
              source: e,
              target: t,
              type: 'FIRE',
              attackpower: 3.16 * e['*vengeance:damage'] * e['damage'],
              ability: shear
            })
          })
        }
      })
    }
  ]
})
const soulFragmentSpawn = Object.assign({}, AbilityDefaults, {
  id: 204255,
  slug: 'soul-fragment-spawn'
})
const metamorphosisModBase: ITickerTemplate = {
  id: 187827,
  slug: 'metamorphosis',
  stackMode: 'EXTEND',
  attributes: {
    '*health:max': 1.3, //TODO: Artifact trait modifies this.
    '*armor:rating': 2.0
  },
  sourcedAttributes: {},
  duration: 0,
  durationIsHasted: false,
  onApply: [],
  onDrop: [],
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity): void => {
      e['pain:current'] += 70
    }
  ],
  interval: 1,
  intervalIsHasted: false
}
const metamorphosisModCasted: ITickerTemplate = Object.assign({}, metamorphosisModBase, {
  duration: 15
})
const metamorphosisModProc: ITickerTemplate = Object.assign({}, metamorphosisModBase, {
  duration: 5
})
const metamorphosis: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 187827,
  slug: 'metamorphosis',
  cooldown: 180,
  cooldownIsHasted: false,
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity) => {
      _.ApplyTicker(w, e, e, metamorphosisModCasted)
    }
  ]
})
const spawnFragment = function(w: IWorld, e: IEntity, greater: boolean): void {
  debug('spawning a soul-fragment')

  _.Delayed(w, e, {
    when: w.now + w._second * 1.08,
    func: (w: IWorld, e: IEntity) => {
      if (e['fragment:expiration:time'].length >= 5) {
        consumeFragment(w, e, 1)
        //TODO: Handle greater fragments
      }
      e['fragment:expiration:time'].push(w.now + w._second * 20)
      e['fragment:count'] += 1
      debug(`\t${formatTime(w.now)}\t${e.slug} spawns a soul-fragment`)
      //report('ABILITY_CASTED', { entity: e, spell: soulFragmentSpawn })
    }
  })
}
const consumeFragment = function(w: IWorld, e: IEntity, count: number): void {
  while (count > 0) {
    debug(`\t${formatTime(w.now)}\t${e.slug} consumes a soul-fragment`)
    count--
    e['fragment:expiration:time'].shift()
    e['fragment:count'] -= 1
    _.DealHealing(e, e, {
      attackPower: 2.5,
      spell: soulFragmentConsume
    })
    if (e['trait:painbringer:rank'] !== undefined && e['trait:painbringer:rank'] >= 1) {
      _.ApplyMod(w, e, e, painbringerMod)
    }
    if (e['trait:fueled-by-pain:rank'] !== undefined && e['trait:fueled-by-pain:rank'] >= 1) {
      if (!e.rng['fueled-by-pain']) {
        e.rng['fueled-by-pain'] = rppm(w, 1.0)
      }
      if (e.rng['fueled-by-pain'].next()) {
        //TODO: Apply Meta Modifier
      }
    }
  }
}
const painbringerMod: IModifierTemplate = {
  id: 212988,
  slug: 'painbringer',
  stackMode: 'DISJOINT',
  attributes: {
    '*dr:all': 0.97
  },
  sourcedAttributes: undefined,
  duration: 4,
  durationIsHasted: false
}
const shear = Object.assign({}, AbilityDefaults, {
  id: 203782,
  slug: 'shear',
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      //340% Weapon Damage
      //+100 Pain
      //Shatter
      //start('shear:mult-calc')
      let z = 3.4 * e['*vengeance:damage'] * e['damage'] * (1 + e['+shear:damage'])
      //end('shear:mult-calc')

      //start('shear:deal-damage')
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        mhDamageNorm: z,
        ability: shear
      })
      //end('shear:deal-damage')
      //start('shear:pain')
      e['pain:current'] += 100
      //end('shear:pain')
      //start('shear:shatter')
      if (!e.rng['shear:shatter']) {
        e.rng['shear:shatter'] = sequence([0.04, 0.12, 0.25, 0.4, 0.6, 0.8, 0.9, 1.0])
      }
      //end('shear:shatter')
      //start('shear-artifact')
      if (e['trait:shatter-the-souls:rank'] !== undefined && e.health < 0.5 * e['maxHealth']) {
        if (e.rng['shear:shatter'].next(1 + e['trait:shatter-the-souls:rank'] * 0.05)) {
          spawnFragment(w, e, false)
        }
      } else {
        if (e.rng['shear:shatter'].next()) {
          spawnFragment(w, e, false)
        }
      }
      //end('shear-artifact')
    }
  ]
})
const fracture = Object.assign({}, AbilityDefaults, {
  id: 209795,
  slug: 'fracture',
  cost: {
    'pain:current': 300
  },
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      _.CastFreeAbilityByTemplate(w, e, fractureMainHand, t)
      _.Delayed(w, e, {
        when: w.now + 0.125 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          _.CastFreeAbilityByTemplate(w, e, fractureOffHand, t)
        }
      })
    }
  ]
})
const fractureMainHand: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 225919,
  slug: 'fracture-mh',
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        mhDamageNorm: 4.51 * e['*vengeance:damage'] * e['damage'],
        ability: fractureMainHand
      })
      spawnFragment(w, e, false)
    }
  ]
})
const fractureOffHand: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 225921,
  slug: 'fracture-oh',
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        ohDamageNorm: 8.97 * e['*vengeance:damage'] * e['damage'],
        ability: fractureOffHand
      })
      spawnFragment(w, e, false)
    }
  ]
})
const spiritBomb: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'spirit-bomb',
  requires: {
    ['fragment:count']: 1
  },
  onCast: [
    (w: IWorld, e: IEntity) => {
      let x = e['fragment:count']
      consumeFragment(w, e, x)
      debug('casting spirit bomb')
      _.Delayed(w, e, {
        when: w.now + 0.125 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          //TODO: target units in range of the caster intsead of his target
          _.EnemiesTouchingRadius(w, e.position, 8).forEach(tar => {
            _.DealDamage(w, e, tar, {
              source: e,
              target: tar,
              type: 'FIRE',
              attackPower: 1.8 * x * e['damage'],
              ability: spiritBomb
            })
          })

          //TODO: Apply healing modifier
        }
      })
    }
  ]
})
const sigilOfFlameTicker: ITickerTemplate = {
  id: 204598,
  slug: 'sigil-of-flame',
  stackMode: 'EXTEND',
  duration: 6,
  durationIsHasted: false,
  attributes: {},
  sourcedAttributes: {},
  onApply: [],
  onDrop: [],
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity): void => {
      _.DealDamage(w, s, e, {
        source: s,
        target: e,
        type: 'FIRE',
        attackPower: 1.86 * 0.95 * s['damage'] / 6,
        ability: sigilOfFlame
      })
    }
  ],
  interval: 1,
  intervalIsHasted: false
}
const sigilOfFlame: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'sigil-of-flame',
  cooldown: 30,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      let x = t.position
      _.Delayed(w, e, {
        when: w.now + 2 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          //TODO: Make this an AE spell
          _.EnemiesTouchingRadius(w, x, 8).forEach(y => {
            _.DealDamage(w, e, y, {
              source: e,
              target: y,
              type: 'FIRE',
              attackPower: 1.86 * 0.95 * e['damage'],
              ability: sigilOfFlame
            })
            _.ApplyTicker(w, e, y, sigilOfFlameTicker)
          })
        }
      })
    }
  ]
})

const demonSpikesMod: IModifierTemplate = {
  id: 203819,
  slug: 'demon-spikes',
  stackMode: 'EXTEND',
  duration: 6,
  durationIsHasted: false,
  attributes: { '+parry': 0.2 },
  sourcedAttributes: undefined
}
const defensiveSpikesMod: IModifierTemplate = {
  id: 212871,
  slug: 'defensive-spikes',
  stackMode: 'EXTEND',
  duration: 3,
  durationIsHasted: false,
  attributes: { '+parry': 0.1 },
  sourcedAttributes: undefined
}

const demonSpikesSpell: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'demon-spikes',
  cooldown: 12,
  chargeMax: 2,
  cost: {
    'pain:current': 200
  },
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      let x = Object.assign({}, demonSpikesMod) as IModifierTemplate
      x.attributes['*dr:physical'] = 1 - Math.min(0.99, 0.12 + e['mastery:demon-spikes'])
      _.ApplyMod(w, e, e, demonSpikesMod)
      if (e['trait:defensive-spikes:rank'] !== undefined && e['trait:defensive-spikes:rank'] >= 1) {
        _.ApplyMod(w, e, e, defensiveSpikesMod)
      }
    }
  ]
})
const immolationAuraTicker: ITickerTemplate = {
  id: 223061,
  slug: 'immolation-aura',
  stackMode: 'DISJOINT',
  duration: 6,
  durationIsHasted: false,
  attributes: {},
  sourcedAttributes: {},
  onApply: [],
  onDrop: [],
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity): void => {
      e['pain:current'] = Math.min(e['pain:max'], e['pain:current'] + 20)
      _.EnemiesTouchingRadius(w, e.position, 8).forEach(x => {
        _.DealDamage(w, s, x, {
          source: s,
          target: x,
          type: 'FIRE',
          attackPower: 0.69 * 0.95 * s['damage'] / 6,
          ability: immolationAura
        })
      })
    }
  ],
  interval: 1,
  intervalIsHasted: false
}
const immolationAura: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'immolation-aura',
  cooldown: 15,
  cooldownIsHasted: true,
  onCast: [
    (w: IWorld, e: IEntity) => {
      e['pain:current'] = Math.min(e['pain:max'], e['pain:current'] + 80)
      _.EnemiesTouchingRadius(w, e.position, 8).forEach(x => {
        _.DealDamage(w, e, x, {
          source: e,
          target: x,
          type: 'FIRE',
          attackPower: 2.43 * 0.95 * e['damage'] / 6,
          ability: immolationAura
        })
      })
      _.ApplyTicker(w, e, e, immolationAuraTicker)
    }
  ]
})

const soulCarverTicker: ITickerTemplate = {
  id: -2,
  slug: 'soul-carver',
  stackMode: 'DISJOINT',
  duration: 3,
  durationIsHasted: false,
  attributes: {},
  sourcedAttributes: {},
  onApply: [],
  onDrop: [],
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity): void => {
      spawnFragment(w, s, false)
      _.DealDamage(w, s, e, {
        source: s,
        target: e,
        type: 'FIRE',
        attackpower: 1.55 * 0.95 * s['damage'], //TODO: Add fire damage modifier in here
        ability: soulCarver
      })
    }
  ],
  interval: 1,
  intervalIsHasted: false
}
const soulCarver: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'soul-carver',
  cooldown: 45,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      spawnFragment(w, e, false)
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'FIRE',
        'mainHand:damage:normalized': 5.07 * 0.95 * e['damage'], //TODO: Add fire damage modifier in here
        ability: soulCarver
      })
      spawnFragment(w, e, false)
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'FIRE',
        'offHand:damage:normalized': 5.07 * 0.95 * e['damage'], //TODO: Add fire damage modifier in here
        ability: soulCarver
      })
      _.ApplyTicker(w, e, t, soulCarverTicker)
    }
  ]
})
const empowerWardsMod: IModifierTemplate = {
  id: 218256,
  slug: 'empower-wards',
  stackMode: 'DISJOINT',
  attributes: {
    '*dr:magical': 0.7
  },
  sourcedAttributes: undefined,
  duration: 6,
  durationIsHasted: false
}
const empowerWards: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'empower-wards',
  cooldown: 20,
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity) => {
      _.ApplyMod(w, e, e, empowerWardsMod)
    }
  ]
})
const increasedThreatPassive: IPassiveTemplate = {
  id: 218256,
  slug: 'empower-wards',
  attributes: {
    '+threat': 9
  }
}
const demonicWardsPassive: IPassiveTemplate = {
  id: 203513,
  slug: 'demonic-wards',
  attributes: {
    '*dr:all': 0.8,
    //'+attackerCritChance': -0.06,
    //'+expertise': 3,
    '*stam:rating': 1.55,
    '*armor': 1.75
  }
}
const leatherSpecializationPassive: IPassiveTemplate = {
  id: 226359,
  slug: 'leather-specialization',
  attributes: {
    '*stam:rating': 1.05
  }
}
const criticalStrikesPassive: IPassiveTemplate = {
  id: 221351,
  slug: 'critical-strikes',
  attributes: {
    '+crit': 0.05
  }
}
const arcaneAcuityPassive: IPassiveTemplate = {
  id: 154742,
  slug: 'arcane-acuity',
  attributes: {
    '+crit': 0.01
  }
}
interface iRankHandler {
  (rank: number): IPassiveTemplate
}
const artifactPassivesById: { [key: number]: iRankHandler } = {
  212819: function willOfTheIllidari(rank: number): IPassiveTemplate {
    return {
      id: 212819,
      slug: 'will-of-the-illidari',
      attributes: {
        '*maxHealth': 1.0 + 0.01 * rank
      }
    }
  },
  214909: function soulgorger(rank: number): IPassiveTemplate {
    return {
      id: 214909,
      slug: 'soulgorger',
      attributes: {
        '*armor': 1.1
      }
    }
  },
  211309: function artificialStamina(rank: number): IPassiveTemplate {
    return {
      id: 212819,
      slug: 'artificial-stamina',
      attributes: {
        '*stam:rating': 1.0 + 0.01 * rank
      }
    }
  },
  226829: function artificialDamage(rank: number): IPassiveTemplate {
    return {
      id: 212819,
      slug: 'artificial-damage',
      attributes: {
        '*damage': 1.0 + 0.0065 * (Math.min(rank, 52) + 6)
      }
    }
  },
  241091: function illidariDurability(rank: number): IPassiveTemplate {
    return {
      id: 212819,
      slug: 'illidari-durability',
      attributes: {
        //currently bugged: '*stam:rating': 1.1
        '*damage': 1.1,
        '*armor': 1.2
        //TODO: Pet damage done
      }
    }
  },
  207343: function aldrachiDesign(rank: number): IPassiveTemplate {
    return {
      id: 207343,
      slug: 'aldrachi-design',
      attributes: {
        '+parry': 0.04
      }
    }
  },
  212829: function defensiveSpikes(rank: number): IPassiveTemplate {
    return {
      id: 212829,
      slug: 'defensive-spikes',
      attributes: {
        'trait:defensive-spikes:rank': rank
      }
    }
  },
  207387: function painbringer(rank: number): IPassiveTemplate {
    return {
      id: 207387,
      slug: 'painbringer',
      attributes: {
        'trait:painbringer:rank': rank
      }
    }
  },
  212827: function shatterTheSouls(rank: number): IPassiveTemplate {
    return {
      id: 212827,
      slug: 'shatter-the-souls',
      attributes: {
        'trait:shatter-the-souls:rank': rank
      }
    }
  },
  213017: function fueledByPain(rank: number): IPassiveTemplate {
    return {
      id: 213017,
      slug: 'fueled-by-pain',
      attributes: {
        'trait:fueled-by-pain:rank': rank
      }
    }
  }
}
const enchantsPassive: IPassiveTemplate = {
  id: -1,
  slug: 'enchants-temporary',
  attributes: {
    '+agi:rating': 400,
    '+crit:rating': 400
  }
}
const DefaultVengeance = function() {
  let x = Object.assign(DefaultEntity(), {
    onInit: [
      function(w: IWorld, e: IEntity) {
        _.TeachAbility(w, e, shear)
        _.TeachAbility(w, e, fracture)
        _.TeachAbility(w, e, spiritBomb)
        _.TeachAbility(w, e, demonSpikesSpell)
        _.TeachAbility(w, e, immolationAura)
        _.TeachAbility(w, e, infernalStrike)
        _.TeachAbility(w, e, metamorphosis)
        //_.TeachAbility(w, e, soulCleave)
        //_.TeachAbility(w, e, fieryBrandSpell)
        _.TeachAbility(w, e, sigilOfFlame)
        _.TeachAbility(w, e, empowerWards)
        _.TeachAbility(w, e, soulCarver)

        _.TeachAbility(w, e, fractureMainHand)
        _.TeachAbility(w, e, fractureOffHand)

        _.TeachPassive(w, e, arcaneAcuityPassive) //TODO: Only load of belfs
        _.TeachPassive(w, e, leatherSpecializationPassive)
        _.TeachPassive(w, e, criticalStrikesPassive)
        _.TeachPassive(w, e, enchantsPassive)

        _.TeachPassive(w, e, increasedThreatPassive)
        _.TeachPassive(w, e, demonicWardsPassive)
      }
    ],
    onEquipItem: [
      (w: IWorld, e: IEntity, i: IItem, s: string) => {
        if (i.artifactId === 60) {
          let totalRanks = -3
          i.artifactTraits.forEach(t => {
            totalRanks += t.rank
            let spellId = artifactMappings[t.id][t.rank - 1]
            if (artifactPassivesById[spellId] !== undefined) {
              _.TeachPassive(w, e, artifactPassivesById[spellId](t.rank))
            } else {
              verbose(`unrecognized artifact trait: ${spellId} (rank ${t.rank})`)
            }
          })
          _.TeachPassive(w, e, artifactPassivesById[211309](totalRanks))
          _.TeachPassive(w, e, artifactPassivesById[226829](totalRanks))
        }
      }
    ],
    onUnequipItem: [
      (w: IWorld, e: IEntity, i: IItem, s: string) => {
        if (i.artifactId === 60) {
          let totalRanks = -3
          i.artifactTraits.forEach(t => {
            totalRanks += t.rank
            let spellId = artifactMappings[t.id][t.rank - 1]
            if (artifactPassivesById[spellId] !== undefined) {
              _.UnteachPassive(w, e, artifactPassivesById[spellId](t.rank))
            } else {
              verbose(`unrecognized artifact trait: ${spellId} (rank ${t.rank})`)
            }
          })
          _.UnteachPassive(w, e, artifactPassivesById[211309](totalRanks))
          _.UnteachPassive(w, e, artifactPassivesById[226829](totalRanks))
        }
      }
    ],
    onSpawn: [(w: IWorld, e: IEntity) => {}]
  })
  x._attributes = Object.assign(x._attributes, {
    ['pain:max:base']: 1000,
    ['+pain:max']: 0,
    ['pain:current']: 0,
    ['pain:max']: function(e) {
      return e['pain:max:base'] + e['+pain:max']
    },
    ['fragment:expiration:time']: [],
    ['fragment:count']: 0,
    ['*vengeance:damage']: 0.95,
    ['+shear:damage']: 0.12,

    ['artifact:defensive-spikes:amount']: 0.1,
    ['artifact:defensive-spikes:duration']: 0.1,
    ['mastery:rating:conversion:demon-spikes']: 0.75,
    ['mastery:demon-spikes']: function(e) {
      return e['mastery:standard'] * e['mastery:rating:conversion:demon-spikes']
    }
  })
  return x as IEntity
}

export default DefaultVengeance

/* 
//passives
189926, // Increased Threat
203513, // Demonic Wards
185244, // Pain
207197, // Riposte
204254, // Shattered Souls
212613, // Vengeance Demon Hunter
203747, // Mastery: Fel Blood
226359, // Leather Specialization (Passive)
162700, // Stat Negation Aura - Agility Tank

// actives
213011, // Charred Warblades
203720, // Demon Spikes
218256, // Empower Wards
204021, // Fiery Brand
209245, // Fiery Brand
212818, // Fiery Demise
178740, // Immolation Aura
189110, // Infernal Strike
187827, // Metamorphosis
203782, // Shear
204596, // Sigil of Flame
207684, // Sigil of Misery
202137, // Sigil of Silence
228477, // Soul Cleave
204157, // Throw Glaive
185245, // Torment
*/
