import { IEntity, DefaultEntity } from '../../Entity'
import { IItem } from '../../item'
import World from '../../world'
import { IAbility, DefaultAbility, DefaultPassive } from '../../Ability.js'
import { IModifier } from '../../Modifier.js'
import artifactMappings from '../../consts/artifactMappings'

const shear = Object.assign(Object.create(DefaultAbility), {
  id: 203782,
  slug: 'shear',
  onCast: [
    (e: IEntity, t: IEntity) => {
      /*e.dealDamage({
        source: e,
        type: 'WEAPON_NORMALIZED',
        target: t,
        amount: 0,
        weaponAmount: 3.4
      })*/
      //e.gainPower('Pain', 100)
    }
  ]
})
const increasedThreat = Object.assign(Object.create(DefaultPassive), {
  id: 189926,
  slug: 'increased-threat',
  attributes: {
    '+threat': 900
  }
})
const demonicWards = Object.assign(Object.create(DefaultPassive), {
  id: 203513,
  slug: 'demonic-wards',
  attributes: {
    '*drAll': 0.8,
    '+attackerCritChance': -0.06,
    '+expertise': 3,
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
const tempArtifactWorkarounds = Object.assign(Object.create(DefaultPassive), {
  id: 221351,
  slug: 'temp-strikes',
  attributes: {
    '+crit:rating': 400
  }
})
const illidariDurability = Object.assign(Object.create(DefaultPassive), {
  id: 0,
  slug: 'illidari-durability',
  attributes: {
    //'*stam': 1.1  -- currently broken
  }
})
const belfCritChance = Object.assign(Object.create(DefaultPassive), {
  id: 221351,
  slug: 'belf-crit',
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
  }
}
const vengeance = Object.assign(Object.create(DefaultEntity), {
  onInit: [
    function(w: World, e: IEntity) {
      w.teachAbility(e, belfCritChance)
      w.teachAbility(e, shear)
      w.teachAbility(e, increasedThreat)
      w.teachAbility(e, demonicWards)
      w.teachAbility(e, leatherSpecialization)
      w.teachAbility(e, criticalStrikes)
      w.teachAbility(e, illidariDurability)
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
