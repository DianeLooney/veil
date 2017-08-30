import * as fs from 'fs'
import rawData from './consts/scaling'

interface dataDump {
  hp_per_stamina: number[]
  spell_scaling: {
    item: number[]
    consumable: number[]
    gem1: number[]
    gem2: number[]
    gem3: number[]
    health: number[]
  }
  base_mp: number[]
  combat_ratings: {
    Dodge: number[]
    Parry: number[]
    Block: number[]
    'Hit - Melee': number[]
    'Hit - Ranged': number[]
    'Hit - Spell': number[]
    Expertise: number[]
    Mastery: number[]
    'Crit - Melee': number[]
    'Crit - Ranged': number[]
    'Crit - Spell': number[]
    'Haste - Melee': number[]
    'Haste - Ranged': number[]
    'Haste - Spell': number[]
    'Versatility - Damage Done': number[]
    'Versatility - Healing Done': number[]
    'Versatility - Damage Taken': number[]
    Speed: number[]
    Avoidance: number[]
  }
  combat_ratings_mult_by_ilvl: {
    armor: number[]
    weapon: number[]
    trinket: number[]
    jewelry: number[]
  }
  item_socket_cost_per_level: number[]
  armor_mitigation_by_lvl: number[]
}

export default function(stat: string, lvl?: number): number {
  lvl = lvl | 110
  switch (stat) {
    case 'haste':
      return rawData.combat_ratings['Haste - Spell'][lvl - 1]
    case 'dodge':
      return rawData.combat_ratings['Dodge'][lvl - 1]
    case 'block':
      return rawData.combat_ratings['Block'][lvl - 1]
    case 'parry':
      return rawData.combat_ratings['Parry'][lvl - 1]
    case 'speed':
      return rawData.combat_ratings['Speed'][lvl - 1]
    case 'avoidance':
      return rawData.combat_ratings['Avoidance'][lvl - 1]
    case 'armor-k':
      return rawData.armor_mitigation_by_lvl[lvl - 1]
    default:
      return 0
    //TODO: Error
  }
}
