import vengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh_greenglaives'
import { calcItems } from '../fromArmory'
import World from '../../world'

const savedya_greenglaives = Object.assign(Object.create(vengeance), {
  slug: 'savedya-green-glaives'
}) as IEntity
savedya_greenglaives.onInit.push((w: World, e: IEntity) => {
  let items = calcItems(data)
  items.forEach(item => {
    w.equipItem(e, item.slot, item)
  })
})
export default savedya_greenglaives
