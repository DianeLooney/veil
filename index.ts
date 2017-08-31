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
console.log('stam:', e.attributes['stamina'])
console.log('health:', e.attributes['health-max'])
console.log('crit:', e.attributes['crit'])
console.log('nMHwd:', e.attributes['normalized_mh_weapon_damage'])
console.log('nOHwd:', e.attributes['normalized_oh_weapon_damage'])
e.castAbility('shear', e)
e.castAbility('shear', e)
w.despawn(e)
