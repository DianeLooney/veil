import { IEntity } from '../../Entity'
import { IAbility, DefaultAbility, DefaultPassive } from '../../Ability.js'
import { IModifier } from '../../Modifier.js'

const shear = Object.assign(Object.create(DefaultAbility), {
  id: 203782,
  slug: 'shear',
  onCast: [
    (e: IEntity, t: IEntity) => {
      e.dealDamage({
        source: e,
        type: 'WEAPON_NORMALIZED',
        target: t,
        amount: 3.4
      })
      e.gainPower('Pain', 100)
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
    '+stam%': 0.55,
    '+armor%': 0.75
  }
})
const vengeance = {
  onSpawn: [
    (e: IEntity) => {
      e.learnPower('Pain', 0, 1000)
      e.learnAbility(shear)
      e.learnAbility(increasedThreat)
    }
  ]
}

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
