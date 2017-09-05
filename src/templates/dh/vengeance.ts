import { IEntity, DefaultEntity } from '../../Entity'
import { IItem } from '../../item'
import { IWorld } from '../../world'
import * as _ from '../../actions'
import { IAbility, DefaultAbility, DefaultPassive } from '../../Ability'
import { DefaultModifier, IModifier } from '../../Modifier'
import { sequence, rppm } from '../../rng'
import report from '../../report'
import * as _debug from 'debug'
const debug = _debug('vengeance')

import artifactMappings from '../../consts/artifactMappings'
const soulFragmentConsume = Object.assign(Object.create(DefaultPassive), {
  id: 204255,
  slug: 'soul-fragment-consume'
})
const soulFragmentSpawn = Object.assign(Object.create(DefaultPassive), {
  id: 204255,
  slug: 'soul-fragment-spawn'
})
const spawnFragment = function(w: IWorld, e: IEntity, greater: boolean): void {
  debug('spawning a soul-fragment')
  e.delays.push({
    when: w.now + w._second * 1.08,
    func: (w: IWorld, e: IEntity) => {
      if (e['fragment:expiration:time'].length >= 5) {
        consumeFragment(w, e, 1)
        //TODO: Handle greater fragments
      }
      e['fragment:expiration:time'].push(w.now + w._second * 20)
      e['fragment:count'] += 1
      debug('spawned a soul-fragment')
      //report('ABILITY_CASTED', { entity: e, spell: soulFragmentSpawn })
    }
  })
}
const consumeFragment = function(w: IWorld, e: IEntity, count: number): void {
  while (count > 0) {
    debug('consuming a soul-fragment')
    count--
    e['fragment:expiration:time'].shift()
    e['fragment:count'] -= 1
    _.DealHealing(e, e, {
      attackPower: 2.5,
      spell: soulFragmentConsume
    })
    if (e['trait:painbringer:rank'] !== undefined && e['trait:painbringer:rank'] >= 1) {
      _.ApplyModifier(w, e, Object.assign(Object.create(painbringerModifier), { source: e }) as IModifier)
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
const painbringerModifier = Object.assign(Object.create(DefaultModifier), {
  slug: 'painbringer',
  stackMode: 'DISJOINT',
  attributes: {
    '*dr:all': 0.97
  },
  duration: 4
})
const shear = Object.assign(Object.create(DefaultAbility), {
  id: 203782,
  slug: 'shear',
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      //340% Weapon Damage
      //+100 Pain
      //Shatter

      _.DealDamage(e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        mhDamageNorm: 3.4 * e['*vengeance:damage'] * e['damage'] * (1 + e['+shear:damage']),
        ability: shear
      })

      e['pain:current'] += 100

      if (!e.rng['shear:shatter']) {
        e.rng['shear:shatter'] = sequence([0.04, 0.12, 0.25, 0.4, 0.6, 0.8, 0.9, 1.0])
      }
      if (e['trait:shatter-the-souls:rank'] !== undefined && e.health < 0.5 * e['maxHealth']) {
        if (e.rng['shear:shatter'].next(1 + e['trait:shatter-the-souls:rank'] * 0.05)) {
          spawnFragment(w, e, false)
        }
      } else {
        if (e.rng['shear:shatter'].next()) {
          spawnFragment(w, e, false)
        }
      }
    }
  ]
})
const fracture = Object.assign(Object.create(DefaultAbility), {
  id: 209795,
  slug: 'fracture',
  cost: {
    'pain:current': 300
  },
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      _.CastAbilityByReference(w, e, fractureMainHand, t)
      e.delays.push({
        when: w.now + 0.125 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          _.CastAbilityByReference(w, e, fractureOffHand, t)
        }
      })
    }
  ]
})
const fractureMainHand = Object.assign(Object.create(DefaultAbility), {
  id: 225919,
  slug: 'fracture-mh',
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      _.DealDamage(e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        mhDamageNorm: 4.51,
        ability: fractureMainHand
      })
      spawnFragment(w, e, false)
    }
  ]
})
const fractureOffHand = Object.assign(Object.create(DefaultAbility), {
  id: 225921,
  slug: 'fracture-oh',
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      _.DealDamage(e, t, {
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
const spiritBomb = Object.assign(Object.create(DefaultAbility), {
  slug: 'spirit-bomb',
  requires: {
    ['fragment:count']: 1
  },
  onCast: [
    (w: IWorld, e: IEntity) => {
      let x = e['fragment:count']
      consumeFragment(w, e, x)
      debug('casting spirit bomb')
      e.delays.push({
        when: w.now + 0.125 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          //TODO: target units in range of the caster intsead of his target
          _.EnemiesTouchingRadius(w, e.position, 8).forEach(tar => {
            _.DealDamage(e, tar, {
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
      debug(`spent ${x} fragments on spirit-bomb`)
    }
  ]
})

const sigilOfFlameModifier = Object.assign(Object.create(DefaultModifier), {
  slug: 'sigil-of-flame-modifier',
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity) => {
      _.DealDamage(s, e, {
        source: s,
        target: e,
        type: 'FIRE',
        attackPower: 1.86 * 0.95 * s['damage'] / 6,
        ability: sigilOfFlame
      })
    }
  ],
  interval: 1,
  duration: 6
}) as IModifier
const sigilOfFlame = Object.assign(Object.create(DefaultAbility), {
  slug: 'sigil-of-flame',
  cooldown: 30,
  recharges: ['ability:sigil-of-flame:cooldown'],
  cost: { ['ability:sigil-of-flame:cooldown']: 1 },
  attributes: {
    'ability:sigil-of-flame:cooldown': 1
  },
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      let x = t.position
      e.delays.push({
        when: w.now + 2 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          //TODO: Make this an AE spell
          _.EnemiesTouchingRadius(w, x, 8).forEach(y => {
            _.DealDamage(e, y, {
              source: e,
              target: y,
              type: 'FIRE',
              attackPower: 1.86 * 0.95 * e['damage'],
              ability: sigilOfFlame
            })
            let z = Object.assign(Object.create(sigilOfFlameModifier), { source: e })
            _.ApplyModifier(w, y, z)
          })
        }
      })
    }
  ]
}) as IAbility

const demonSpikesBuff = Object.assign(Object.create(DefaultModifier), {
  slug: 'demon-spikes',
  stackMode: 'EXTEND',
  duration: 6,
  attributes: {
    ['+parry']: 0.2
  }
}) as IModifier
const defensiveSpikesBuff = Object.assign(Object.create(DefaultModifier), {
  slug: 'defensive-spikes',
  duration: 3,
  attributes: {
    ['+parry']: 0.1
  }
}) as IModifier
const demonSpikesSpell = Object.assign(Object.create(DefaultAbility), {
  slug: 'demon-spikes',
  cooldown: 12,

  hastedRecharges: ['ability:demon-spikes:charges'],
  cost: {
    'ability:demon-spikes:charges': 1,
    'pain:current': 200
  },
  attributes: {
    'ability:demon-spikes:charges': 2,
    'ability:demon-spikes:charges:cap': 2
  },
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      debug(`Current charges of demon-pikes: ${e['ability:demon-spikes:charges']}`)
      _.ApplyModifier(
        w,
        e,
        Object.assign(Object.create(demonSpikesBuff), {
          attributes: {
            ['+parry']: 0.2,
            ['*dr:physical']: 1 - Math.min(0.99, 0.12 + e['mastery:demon-spikes'])
          }
        })
      )

      if (e['trait:defensive-spikes:rank'] !== undefined && e['trait:defensive-spikes:rank'] >= 1) {
        defensiveSpikesBuff.apply(w, e)
      }
    }
  ]
})

const immolationAuraModifier = Object.assign(Object.create(DefaultModifier), {
  slug: 'immolation-aura',
  stackMode: 'DISJOINT',
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity) => {
      e['pain:current'] = Math.min(e['pain:max'], e['pain:current'] + 20)
      _.EnemiesTouchingRadius(w, e.position, 8).forEach(x => {
        _.DealDamage(s, x, {
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
  duration: 6
}) as IModifier
const immolationAura = Object.assign(Object.create(DefaultAbility), {
  slug: 'immolation-aura',
  cooldown: 15,
  hastedRecharges: ['ability:immolation-aura:cooldown'],
  cost: { 'ability:immolation-aura:cooldown': 1 },
  attributes: { 'ability:immolation-aura:cooldown': 1 },
  onCast: [
    (w: IWorld, e: IEntity) => {
      e['pain:current'] = Math.min(e['pain:max'], e['pain:current'] + 80)
      _.EnemiesTouchingRadius(w, e.position, 8).forEach(x => {
        _.DealDamage(e, x, {
          source: e,
          target: x,
          type: 'FIRE',
          attackPower: 2.43 * 0.95 * e['damage'] / 6,
          ability: immolationAura
        })
      })
      _.ApplyModifier(w, e, Object.assign(Object.create(immolationAuraModifier), { source: e }) as IModifier)
    }
  ]
}) as IAbility

const soulCarverDebuff = Object.assign(Object.create(DefaultModifier), {
  slug: 'immolation-aura',
  onInterval: [
    (w: IWorld, s: IEntity, e: IEntity) => {
      _.EnemiesTouchingRadius(w, e.position, 8).forEach(x => {
        spawnFragment(w, e, false)
        _.DealDamage(s, e, {
          source: s,
          target: e,
          type: 'FIRE',
          attackpower: 1.55 * 0.95 * e['damage'], //TODO: Add fire damage modifier in here
          ability: soulCarver
        })
      })
    }
  ],
  interval: 1,
  duration: 3
})
const soulCarver = Object.assign(Object.create(DefaultAbility), {
  slug: 'soul-carver',
  cooldown: 45,
  recharges: ['ability:soul-carver:cooldown'],
  cost: { 'ability:soul-carver:cooldown': 1 },
  attributes: { 'ability:soul-carver:cooldown': 1 },
  onCast: [
    (w: IWorld, e: IEntity, t: IEntity) => {
      spawnFragment(w, e, false)
      spawnFragment(w, e, false)
      _.DealDamage(e, t, {
        source: e,
        target: t,
        type: 'FIRE',
        'mainHand:damage:normalized': 5.07 * 0.95 * e['damage'], //TODO: Add fire damage modifier in here
        ability: soulCarver
      })
      _.DealDamage(e, t, {
        source: e,
        target: t,
        type: 'FIRE',
        'offHand:damage:normalized': 5.07 * 0.95 * e['damage'], //TODO: Add fire damage modifier in here
        ability: soulCarver
      })
    }
  ]
})

const empowerWardsBuff = Object.assign(Object.create(DefaultModifier), {
  slug: 'empower-wards-modifier',
  duration: 6,
  attributes: {
    '*dr:magical': 0.7
  }
}) as IModifier
const empowerWards = Object.assign(Object.create(DefaultAbility), {
  slug: 'empower-wards',
  cooldown: 20,
  recharges: ['ability:empower-wards:cooldown'],
  cost: {
    'ability:empower-wards:cooldown': 1
  },
  attributes: {
    'ability:empower-wards:cooldown': 1
  },
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity) => {
      empowerWardsBuff.apply(w, e)
    }
  ]
}) as IAbility
const increasedThreat = Object.assign(Object.create(DefaultPassive), {
  id: 189926,
  slug: 'increased-threat',
  attributes: {
    '+threat': 9
  }
})
const demonicWards = Object.assign(Object.create(DefaultPassive), {
  id: 203513,
  slug: 'demonic-wards',
  attributes: {
    '*dr:all': 0.8,
    //'+attackerCritChance': -0.06,
    //'+expertise': 3,
    '*stam:rating': 1.55,
    '*armor': 1.75
  }
})
const leatherSpecialization = Object.assign(Object.create(DefaultPassive), {
  id: 226359,
  slug: 'leather-specialization',
  attributes: {
    '*stam:rating': 1.05
  }
})
const criticalStrikes = Object.assign(Object.create(DefaultPassive), {
  id: 221351,
  slug: 'critical-strikes',
  attributes: {
    '+crit': 0.05
  }
})
const arcaneAcuity = Object.assign(Object.create(DefaultPassive), {
  id: 154742,
  slug: 'arcane-acuity',
  attributes: {
    '+crit': 0.01
  }
})
const artifactTraitsById = {
  212819: function willOfTheIllidari(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212819,
      slug: 'will-of-the-illidari',
      attributes: {
        '*maxHealth': 1.0 + 0.01 * rank
      }
    })
  },
  214909: function soulgorger(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 214909,
      slug: 'soulgorger',
      attributes: {
        '*armor': 1.1
      }
    })
  },
  211309: function artificialStamina(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212819,
      slug: 'artificial-stamina',
      attributes: {
        '*stam:rating': 1.0 + 0.01 * rank
      }
    })
  },
  226829: function artificialDamage(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212819,
      slug: 'artificial-damage',
      attributes: {
        '*damage': 1.0 + 0.0065 * (Math.min(rank, 52) + 6)
      }
    })
  },
  241091: function illidariDurability(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212819,
      slug: 'illidari-durability',
      attributes: {
        //currently bugged: '*stam:rating': 1.1
        '*damage': 1.1,
        '*armor': 1.2
        //TODO: Pet damage done
      }
    })
  },
  207343: function aldrachiDesign(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 207343,
      slug: 'aldrachi-design',
      attributes: {
        '+parry': 0.04
      }
    })
  },
  212829: function defensiveSpikes(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212829,
      slug: 'defensive-spikes',
      attributes: {
        'trait:defensive-spikes:rank': rank
      }
    })
  },
  207387: function painbringer(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 207387,
      slug: 'painbringer',
      attributes: {
        'trait:painbringer:rank': rank
      }
    })
  },
  212827: function shatterTheSouls(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212827,
      slug: 'shatter-the-souls',
      attributes: {
        'trait:shatter-the-souls:rank': rank
      }
    })
  },
  213017: function fueledByPain(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 213017,
      slug: 'fueled-by-pain',
      attributes: {
        'trait:fueled-by-pain:rank': rank
      }
    })
  }
}
const enchants = Object.assign(Object.create(DefaultPassive), {
  id: -1,
  slug: 'enchants-temporary',
  attributes: {
    '+agi:rating': 400,
    '+crit:rating': 400
  }
})
const DefaultVengeance = function() {
  let x = Object.assign(DefaultEntity(), {
    onInit: [
      function(w: IWorld, e: IEntity) {
        _.TeachAbility(w, e, arcaneAcuity) //TODO: Only load of belfs

        _.TeachAbility(w, e, shear)
        _.TeachAbility(w, e, fracture)
        _.TeachAbility(w, e, spiritBomb)
        _.TeachAbility(w, e, demonSpikesSpell)
        _.TeachAbility(w, e, sigilOfFlame)
        _.TeachAbility(w, e, empowerWards)
        _.TeachAbility(w, e, immolationAura)
        _.TeachAbility(w, e, soulCarver)

        _.TeachAbility(w, e, fractureMainHand)
        _.TeachAbility(w, e, fractureOffHand)
        _.TeachAbility(w, e, increasedThreat)
        _.TeachAbility(w, e, demonicWards)
        _.TeachAbility(w, e, leatherSpecialization)
        _.TeachAbility(w, e, criticalStrikes)
        _.TeachAbility(w, e, enchants)
      }
    ],
    onEquipItem: [
      (w: IWorld, e: IEntity, i: IItem, s: string) => {
        if (i.artifactId === 60) {
          let totalRanks = -3
          i.artifactTraits.forEach(t => {
            totalRanks += t.rank
            let spellId = artifactMappings[t.id][t.rank - 1]
            if (artifactTraitsById[spellId] !== undefined) {
              _.TeachAbility(w, e, artifactTraitsById[spellId](t.rank))
            } else {
              console.warn(`unrecognized artifact trait: ${spellId} (rank ${t.rank})`)
            }
          })
          _.TeachAbility(w, e, artifactTraitsById[211309](totalRanks))
          _.TeachAbility(w, e, artifactTraitsById[226829](totalRanks))
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
            if (artifactTraitsById[spellId] !== undefined) {
              _.UnteachAbility(w, e, artifactTraitsById[spellId](t.rank))
            } else {
              console.warn(`unrecognized artifact trait: ${spellId} (rank ${t.rank})`)
            }
          })
          _.UnteachAbility(w, e, artifactTraitsById[211309](totalRanks))
          _.UnteachAbility(w, e, artifactTraitsById[226829](totalRanks))
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
    ['*damage']: 1,
    ['damage']: function(e) {
      return e['*damage'] * (1 + e['vers:damage-done'])
    },
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
