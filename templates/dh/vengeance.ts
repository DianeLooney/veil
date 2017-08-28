import Entity from '../../Entity'
import Ability from '../../Ability.js'
import Modifier from '../../Modifier.js'

const shear = new Ability({
  id: 203782,
  slug: 'shear',
  onCast: [
    (e, t) => {
      e.dealDamage({
        type: 'WEAPON_NORMALIZED',
        target: t,
        ability: shear,
        amount: 3.40
      })
      e.gainPower('Pain', 100)
    }
  ]
})

const vengeance = {
  onSpawn: [
    e => {
      e.learnPower('Pain', 0, 1000)
      e.learnAbility(shear)
    }
  ]
}

export default vengeance
