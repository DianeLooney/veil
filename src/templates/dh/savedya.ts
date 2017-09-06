import DefaultVengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh_60'
import * as _ from '../../actions'
import { calcItems } from '../fromArmory'
import { IWorld } from '../../world'

function newSavedya() {
  const savedya = Object.assign(DefaultVengeance(), {
    slug: 'savedya'
  }) as IEntity
  savedya.onInit.push((w: IWorld, e: IEntity) => {
    let items = calcItems(data)
    items.forEach(item => {
      _.EquipItem(w, e, item.slot, item)
    })
  })
  return savedya
}

export default newSavedya
