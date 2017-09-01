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
  console.log('health:', e['health-max'])
  console.log('+armor:', e['+armor'])
  console.log('*armor:', e['*armor'])
  console.log('armor:', e['armor'])
  console.log('armor-dr', 100 * (1 - e['armor_dr']))
  console.log('crit:', e['crit'] * 100)
  console.log('haste:', e['haste'] * 100)
  console.log('mastery:', e['mast_pct_standard'] * 100)
  console.log('vers:damage-done:', e['vers:damage-done'])
  console.log('vers:damage-taken:', e['vers:damage-taken'])
  console.log('vers:healing-done:', e['vers:healing-done'])
  console.log('dodge:', e['dodge'])
  console.log('parry:', e['parry'])
  console.log('nMHwd:', e['normalized_mh_weapon_damage'])
  console.log('nOHwd:', e['normalized_oh_weapon_damage'])
}
dump(e)
w.despawn(e)
