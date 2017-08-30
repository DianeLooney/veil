import vengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh'
import { calcItems } from '../from-armory'
const savedya = Object.assign(Object.create(vengeance), {
  slug: 'savedya'
})

savedya.onSpawn.push((e: IEntity): void => {
  let items = calcItems(data)
  items.forEach(item => {
    e.equipItem(item.slot, item)
  })
  /*e.equipItem('head', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 3744,
      '+crit:rating': 1136
    }
  })
  e.equipItem('neck', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2206,
      '+crit:rating': 1987
    }
  })
  e.equipItem('shoulders', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2808,
      '+crit:rating': 768
    }
  })
  e.equipItem('back', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2422,
      '+crit:rating': 669
    }
  })
  e.equipItem('chest', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 3744,
      '+haste:rating': 649
    }
  })
  e.equipItem('wrists', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2206,
      '+crit:rating': 329
    }
  })
  e.equipItem('hands', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 4687
    }
  })
  e.equipItem('waist', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2680,
      '+crit:rating': 919
    }
  })
  e.equipItem('legs', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 3922,
      '+crit:rating': 585
    }
  })
  e.equipItem('feet', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 4687
    }
  })
  e.equipItem('finger1', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2106,
      '+crit:rating': 1837 + 200
    }
  })
  e.equipItem('finger2', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2206,
      '+crit:rating': 2271 + 200
    }
  })
  e.equipItem('trinket1', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 0
    }
  })
  e.equipItem('trinket2', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 0
    }
  })
  e.equipItem('weaponMH', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2006,
      '+crit:rating': 416,
      
    }
  })
  e.equipItem('weaponOH', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2006,
      '+crit:rating': 416,
      //Artifact traits
    }
  }) //*/
})
export default savedya
