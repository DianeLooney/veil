import vengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh_60'
import * as _ from '../../actions'
import { calcItems } from '../fromArmory'
import { IWorld } from '../../world'

const savedya = Object.assign(Object.create(vengeance), {
  slug: 'savedya'
}) as IEntity
savedya.onInit.push((w: IWorld, e: IEntity) => {
  let items = calcItems(data)
  items.forEach(item => {
    _.EquipItem(w, e, item.slot, item)
  })
})
export default savedya
