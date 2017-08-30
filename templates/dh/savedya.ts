import vengeance from './vengeance'
import { IEntity } from '../../entity'

const savedya = Object.assign(Object.create(vengeance), {
  slug: 'savedya'
})
savedya.onSpawn.push((e: IEntity): void => {
  e.equipItem('head', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 3744
    }
  })
  e.equipItem('neck', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2206
    }
  })
  e.equipItem('shoulders', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2808
    }
  })
  e.equipItem('back', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2422
    }
  })
  e.equipItem('chest', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 3744
    }
  })
  e.equipItem('wrists', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2537
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
      '+stam': 2680
    }
  })
  e.equipItem('legs', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 4510
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
      '+stam': 2106
    }
  })
  e.equipItem('finger2', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2206
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
  }) /*
  e.equipItem('weaponMH', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2006
      //'*stam': 1.58
    }
  })
  e.equipItem('weaponOH', {
    id: 0,
    slug: '',
    slot: 0,
    stats: {
      '+stam': 2006,
      '*stam': 1.1,
      '*maxHealth': 1.04
    }
  })*/
})
export default savedya
