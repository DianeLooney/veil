import { IEntity, DefaultEntity } from './entity'
import World from './world.js'
import { IAbility } from './ability.js'
import { IModifier } from './modifier'
import { IActor } from './actor'
import dhVengeance from './templates/dh/vengeance'
import { IActorSpammy, SpammyTemplate } from './templates/actors/spammy'
import consts from './consts'

const w = new World()
const e = Object.create(dhVengeance)
const a = Object.create(SpammyTemplate) as IActorSpammy
a.attach(e, 'shear')
Object.assign(e, { slug: 'test-demon-hunter' })

w.spawn(e)
e.castAbility('shear', e)
e.castAbility('shear', e)
w.despawn(e)
