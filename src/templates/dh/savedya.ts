import vengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh_60'
import { calcItems } from '../fromArmory'
import World from '../../world'

const savedya = Object.assign(Object.create(vengeance), {
  slug: 'savedya'
}) as IEntity
savedya.onInit.push((w: World, e: IEntity) => {
  let items = calcItems(data)
  items.forEach(item => {
    w.equipItem(e, item.slot, item)
  })
})
export default savedya
