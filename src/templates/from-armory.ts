import { IItem } from '../item'

const statMappings = {
  //[32]: '+crit:rating',
  //[40]: '+vers:rating',
  //[73]: '+primary:rating',
  [7]: '+stam'
}
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
    retval.push({
      id: x.id,
      slug: x.name,
      slot: i,
      stats: stats
    })
  }
  return retval
}
export { calcItems }
