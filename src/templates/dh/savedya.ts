import vengeance from './vengeance'
import { IEntity } from '../../entity'
import data from './savedyadh'
import { calcItems } from '../fromArmory'
const savedya = Object.assign(Object.create(vengeance), {
  slug: 'savedya',
  onInit: [
    (e: IEntity) => {
      let items = calcItems(data)
      items.forEach(item => {
        e.equipItem(item.slot, item)
      })
    }
  ]
})
export default savedya
