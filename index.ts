import { IEntity, DefaultEntity } from './entity'
import World from './world.js'
import { IAbility } from './ability.js'
import { IModifier } from './modifier'
import { IActor } from './actor'
import dhVengeance from './templates/dh/vengeance'
import savedya from './templates/dh/savedya'
import { IActorSpammy, SpammyTemplate } from './templates/actors/spammy'
import consts from './consts'

const w = new World()
const e = Object.create(savedya) as IEntity
w.spawn(e)
console.log('stam:', e.attributes['stamina'])
console.log('health:', e.attributes['health-max'])
console.log('crit:', e.attributes['crit'])
e.castAbility('shear', e)
e.castAbility('shear', e)
w.despawn(e)
