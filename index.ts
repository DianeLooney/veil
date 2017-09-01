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
  console.log('agi', e['agility'])
  console.log('stam:', e['stamina'])
  console.log('maxHealth:', e['maxHealth'])
  console.log('armor:', e['armor:rating'])
  console.log('armor-dr', 100 * (1 - e['armor']))
  console.log('crit:', e['crit'] * 100)
  console.log('haste:', e['haste'] * 100)
  console.log('mastery:', e['mastery:standard'] * 100)
  console.log('vers:damage-done:', e['vers:damage-done'] * 100)
  console.log('vers:damage-taken:', e['vers:damage-taken'] * 100)
  console.log('vers:healing-done:', e['vers:healing-done'] * 100)
  console.log('dodge:', e['dodge'] * 100)
  console.log('parry:', e['parry'] * 100)
  console.log('nMHwd:', e['mainHand:damage:normalized'])
  console.log('nOHwd:', e['offHand:damage:normalized'])
  console.log('maxPain', e['pain:max'] / 10)
}
dump(e)
while (w.now < w._second * 3) {
  w.tick()
  w.castAbilityByName(e, 'shear', e)
}

w.despawn(e)
/*

import { parse, build } from './src/templates/attributeParser'
import data from './src/templates/playerAttributes'
build(parse(data))
*/
