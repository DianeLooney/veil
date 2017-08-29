import { IEntity } from '../../Entity'
import { IAbility, DefaultAbility } from '../../Ability.js'
import { IModifier } from '../../Modifier.js'

const shear = Object.assign(Object.create(DefaultAbility), {
  id: 203782,
  slug: 'shear',
  onCast: [
    (e, t) => {
      e.dealDamage({
        type: 'WEAPON_NORMALIZED',
        target: t,
        ability: shear,
        amount: 3.4
      })
      e.gainPower('Pain', 100)
    }
  ]
})

const vengeance = {
  onSpawn: [
    (e: IEntity) => {
      e.learnPower('Pain', 0, 1000)
      e.learnAbility(shear)
    }
  ]
}

export default vengeance
