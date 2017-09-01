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
  console.log('attack_power', e['attack_power'])
  console.log('health:', e['health-max'])
  console.log('crit:', e['crit'])
  console.log('crit:rating', e['crit:rating'])
  console.log('parry:pre-dr', e['parry:pre-dr'])
  console.log('parry:', e['parry'])
  console.log('dodge:base', e['dodge:base'])
  console.log('dodge:pre-dr', e['dodge:pre-dr'])
  console.log('dodge:', e['dodge'])
  console.log('nMHwd:', e['normalized_mh_weapon_damage'])
  console.log('nOHwd:', e['normalized_oh_weapon_damage'])
}
dump(e)
w.despawn(e)
