import Entity from './entity'
import World from './world.js'
import Ability from './ability.js'
import Modifier from './modifier'
import dhVengeance from './templates/dh/vengeance'

const w = new World()
const e = new Entity(dhVengeance, { slug: 'test-entity' })
const a = new Ability({ slug: 'test-ability' })
const m = new Modifier({ slug: 'test-modifier' })

w.spawn(e)
e.castAbility('shear', e)
w.despawn(e)
