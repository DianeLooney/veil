import { IEntity, DefaultEntity } from '../../Entity'
import { IItem } from '../../item'
import World from '../../world'
import { IAbility, DefaultAbility, DefaultPassive } from '../../Ability.js'
import { IModifier } from '../../Modifier'
import { sequence } from '../../rng'

import artifactMappings from '../../consts/artifactMappings'

const spawnFragment = function(w: World, e: IEntity, greater: boolean): void {
  e.delays.push({
    when: w.now + w._second * 1.08,
    func: (w: World, e: IEntity) => {
      //Spawn fragment here
    }
  })
}
const consumeFragment = function(w: World, e: IEntity): void {}

const shear = Object.assign(Object.create(DefaultAbility), {
  id: 203782,
  slug: 'shear',
  onCast: [
    (w: World, e: IEntity, t: IEntity) => {
      //340% Weapon Damage
      //+100 Pain
      //Shatter, if we hit a target
      w.dealDamage(e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        mhDamageRaw: 3.4,
        ability: shear
      })
      console.log(t.health)
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
  241091: function illidariDurability(rank: number): any {
    return Object.assign(Object.create(DefaultPassive), {
      id: 212819,
      slug: 'illidari-durability',
      attributes: {
        //currently bugged: '*stam:rating': 1.1
        //TODO: Damage Done
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
      }
    }
  ],
  onSpawn: [
    (w: World, e: IEntity) => {
      //e.learnPower('Pain', 0, 1000)
    }
  ]
})

vengeance._attributes = Object.assign(DefaultEntity._attributes, {
  ['pain:max:base']: 1000,
  ['+pain:max']: 0,
  ['pain:current']: 0,
  ['pain:max']: function(e) {
    return e['pain:max:base'] + e['+pain:max']
  }
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
