import { IEntity, DefaultEntity } from '../../Entity'
import { IItem } from '../../item'
import World from '../../world'
import { IAbility, DefaultAbility, DefaultPassive } from '../../Ability'
import { DefaultModifier, IModifier } from '../../Modifier'
import { sequence } from '../../rng'
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
const spawnFragment = function(w: World, e: IEntity, greater: boolean): void {
  debug('spawning a soul-fragment')
  e.delays.push({
    when: w.now + w._second * 1.08,
    func: (w: World, e: IEntity) => {
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
const consumeFragment = function(w: World, e: IEntity, count: number): void {
  while (count > 0) {
    debug('consuming a soul-fragment')
    count--
    e['fragment:expiration:time'].shift()
    e['fragment:count'] -= 1
    w.applyHeal(e, e, {
      attackPower: 2.5,
      spell: soulFragmentConsume
    })
  }
}
const shear = Object.assign(Object.create(DefaultAbility), {
  id: 203782,
  slug: 'shear',
  onCast: [
    (w: World, e: IEntity, t: IEntity) => {
      //340% Weapon Damage
      //+100 Pain
      //Shatter

      w.dealDamage(e, t, {
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
      if (e.rng['shear:shatter'].next()) {
        spawnFragment(w, e, false)
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
    (w: World, e: IEntity, t: IEntity) => {
      w.castAbilityByReference(e, fractureMainHand, t)
      e.delays.push({
        when: w.now + 0.125 * w._second,
        func: (w: World, e: IEntity): void => {
          w.castAbilityByReference(e, fractureOffHand, t)
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
    (w: World, e: IEntity, t: IEntity) => {
      w.dealDamage(e, t, {
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
    (w: World, e: IEntity, t: IEntity) => {
      w.dealDamage(e, t, {
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
    (w: World, e: IEntity, t: IEntity) => {
      let x = e['fragment:count']
      consumeFragment(w, e, x)
      e.delays.push({
        when: w.now + 0.125 * w._second,
        func: (w: World, e: IEntity): void => {
          //TODO: target units in range of the caster intsead of his target
          w.dealDamage(e, t, {
            source: e,
            target: t,
            type: 'FIRE',
            attackPower: 1.8 * x * e['damage'],
            ability: spiritBomb
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
    (w: World, s: IEntity, e: IEntity) => {
      console.log('this:', this)
      w.dealDamage(this.source, e, {
        source: this.source,
        target: e,
        type: 'FIRE',
        attackPower: 1.86 * 0.95 * e['damage'],
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
  onCast: [
    (w: World, e: IEntity, t: IEntity) => {
      e.delays.push({
        when: w.now + 2 * w._second,
        func: (w: World, e: IEntity): void => {
          //TODO: Make this an AE spell
          w.dealDamage(e, t, {
            source: e,
            target: t,
            type: 'FIRE',
            attackPower: 1.86 * 0.95 * e['damage'],
            ability: sigilOfFlame
          })
          let x = Object.assign(Object.create(sigilOfFlameModifier), { source: e })
          console.log(x.source)
          w.applyModifier(t, x)
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
    'pain:current': 20
  },
  attributes: {
    'ability:demon-spikes:charges': 2,
    'ability:demon-spikes:charges:cap': 2
  },
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: World, e: IEntity, t: IEntity) => {
      debug(`Current charges of demon-pikes: ${e['ability:demon-spikes:charges']}`)
      demonSpikesBuff.apply(w, e)
      defensiveSpikesBuff.apply(w, e)
    }
  ]
})
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
const vengeance = Object.assign(Object.create(DefaultEntity), {
  onInit: [
    function(w: World, e: IEntity) {
      w.teachAbility(e, arcaneAcuity) //TODO: Only load of belfs

      w.teachAbility(e, shear)
      w.teachAbility(e, fracture)
      w.teachAbility(e, spiritBomb)
      w.teachAbility(e, demonSpikesSpell)
      w.teachAbility(e, sigilOfFlame)

      w.teachAbility(e, fractureMainHand)
      w.teachAbility(e, fractureOffHand)
      w.teachAbility(e, increasedThreat)
      w.teachAbility(e, demonicWards)
      w.teachAbility(e, leatherSpecialization)
      w.teachAbility(e, criticalStrikes)
      w.teachAbility(e, enchants)
    }
  ],
  onEquipItem: [
    (w: World, e: IEntity, i: IItem, s: string) => {
      if (i.artifactId === 60) {
        let totalRanks = -3
        i.artifactTraits.forEach(t => {
          totalRanks += t.rank
          let spellId = artifactMappings[t.id][t.rank - 1]
          if (artifactTraitsById[spellId] !== undefined) {
            w.teachAbility(e, artifactTraitsById[spellId](t.rank))
          } else {
            console.warn(`unrecognized artifact trait: ${spellId} (rank ${t.rank})`)
          }
        })
        w.teachAbility(e, artifactTraitsById[211309](totalRanks))
        w.teachAbility(e, artifactTraitsById[226829](totalRanks))
      }
    }
  ],
  onUnequipItem: [
    (w: World, e: IEntity, i: IItem, s: string) => {
      if (i.artifactId === 60) {
        let totalRanks = -3
        i.artifactTraits.forEach(t => {
          totalRanks += t.rank
          let spellId = artifactMappings[t.id][t.rank - 1]
          if (artifactTraitsById[spellId] !== undefined) {
            w.unteachAbility(e, artifactTraitsById[spellId](t.rank))
          } else {
            console.warn(`unrecognized artifact trait: ${spellId} (rank ${t.rank})`)
          }
        })
        w.unteachAbility(e, artifactTraitsById[211309](totalRanks))
        w.unteachAbility(e, artifactTraitsById[226829](totalRanks))
      }
    }
  ],
  onSpawn: [(w: World, e: IEntity) => {}]
})

vengeance._attributes = Object.assign(DefaultEntity._attributes, {
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
  ['artifact:defensive-spikes:duration']: 0.1
})
export default vengeance

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
