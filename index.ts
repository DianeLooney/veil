import { IEntity, DefaultEntity } from './src/entity'
import World from './src/world.js'
import { IAbility } from './src/ability.js'
import { IModifier } from './src/modifier'
import { IActor } from './src/actor'
import dhVengeance from './src/templates/dh/vengeance'
import savedya from './src/templates/dh/savedya'
import { IActorSpammy, SpammyTemplate } from './src/templates/actors/spammy'
import consts from './src/consts'

const w = new World()
const e = Object.create(savedya) as IEntity
w.init(e)
w.spawn(e)
let dump = function(e: IEntity): void {
  console.log('+stam', e['+stam:rating'])
  console.log('*stam', e['*stam:rating'])
  console.log('stam:', e['stamina'])
  console.log('health:', e['health-max'])
  console.log('crit:', e['crit'])
  console.log('nMHwd:', e['normalized_mh_weapon_damage'])
  console.log('nOHwd:', e['normalized_oh_weapon_damage'])
}
dump(e)
//e.castAbility('shear', e)
//e.castAbility('shear', e)
w.unequipItem(e, 'mainHand')
w.unequipItem(e, 'offHand')
dump(e)
w.despawn(e)
