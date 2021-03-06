import { IItem } from '../item'
import statMappings from '../consts/statMappings'

interface armoryStat {
  stat: number
  amount: number
}
interface armoryItem {
  id: number
  name: string
  icon: string
  quality: number
  itemLevel: number
  stats: armoryStat[]
  weaponInfo?: {
    damage: {
      exactMin: number
      exactMax: number
    }
    weaponSpeed: number
  }
  armor: number
  artifactId: number
  artifactTraits: { id: number; rank: number }[]
}
interface armoryExport {
  name: string
  items: {
    head: armoryItem
    neck: armoryItem
    shoulders: armoryItem
    back: armoryItem
    chest: armoryItem
    wrist: armoryItem
    hands: armoryItem
    waist: armoryItem
    feet: armoryItem
    finger1: armoryItem
    finger2: armoryItem
    trinket1: armoryItem
    trinket2: armoryItem
    mainHand: armoryItem
    offHand: armoryItem
  }
}
function calcItems(src: armoryExport): IItem[] {
  let retval: IItem[] = []
  for (var i in src.items) {
    if (i === 'averageItemLevel' || i === 'averageItemLevelEquipped') {
      continue
    }
    let x: armoryItem = src.items[i]
    let stats: { [key: string]: number } = {}

    x.stats.forEach(s => {
      if (statMappings[s.stat]) {
        stats[statMappings[s.stat]] = s.amount
      }
    })
    if (x.armor) {
      stats['+armor:rating'] = x.armor
    }
    if (i === 'mainHand') {
      if (x.weaponInfo) {
        stats['+mainHand:damage:min'] = x.weaponInfo.damage.exactMin
        stats['+mainHand:damage:max'] = x.weaponInfo.damage.exactMax
        stats['+mainHand:speed'] = x.weaponInfo.weaponSpeed
      }
    }
    if (i === 'offHand') {
      if (x.weaponInfo) {
        stats['+offHand:damage:min'] = x.weaponInfo.damage.exactMin
        stats['+offHand:damage:max'] = x.weaponInfo.damage.exactMax
        stats['+offHand:speed'] = x.weaponInfo.weaponSpeed
      }
    }
    retval.push({
      id: x.id,
      slug: x.name,
      slot: i,
      stats: stats,
      artifactId: x.artifactId,
      artifactTraits: x.artifactTraits
    })
  }
  return retval
}
export { calcItems }
