import vengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh_greenglaives'
import * as _ from '../../actions'
import { calcItems } from '../fromArmory'
import { IWorld } from '../../world'

const savedya_greenglaives = Object.assign(Object.create(vengeance), {
  slug: 'savedya-green-glaives'
}) as IEntity
savedya_greenglaives.onInit.push((w: IWorld, e: IEntity) => {
  let items = calcItems(data)
  items.forEach(item => {
    _.EquipItem(w, e, item.slot, item)
  })
})
export default savedya_greenglaives
