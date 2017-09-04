import { IEntity, DefaultEntity, DefaultBossEntity } from './src/entity'
import World from './src/world.js'
import { IAbility } from './src/ability.js'
import { IModifier } from './src/modifier'
import { IActor } from './src/actor'
import dhVengeance from './src/templates/dh/vengeance'
import savedya from './src/templates/dh/savedya'
import savedya_gg from './src/templates/dh/savedya_greenglaives'
import { IActorSpammy, SpammyTemplate } from './src/templates/actors/spammy'
import consts from './src/consts'
import * as _debug from 'debug'
const debug = _debug('index')

const w = new World()
const e = Object.create(savedya) as IEntity
const idiot = Object.create(DefaultBossEntity) as IEntity
idiot.slug = 'idiot'
w.init(e)
w.init(idiot)
w.spawn(e)
w.spawn(idiot)
let dump = function(e: IEntity): void {
  console.log('agi', e['agility'])
  console.log('attackpower:', e['attackpower'])
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
  console.log('*damage', e['*damage'])
}
dump(e)
let first = true
setInterval(() => {
  w.tick()
  if (first && !e.isOnGCD()) {
    first = false
    w.castAbilityByName(e, 'sigil-of-flame')
    /*
    w.castAbilityByName(e, 'demon-spikes')
    w.castAbilityByName(e, 'spirit-bomb', idiot)
    w.castAbilityByName(e, 'fracture', idiot)
    w.castAbilityByName(e, 'shear', idiot)*/
  }
  //console.log(e['fragment:count'])
}, 40)

/*
while (w.now < w._second * 10) {
  w.tick()
  w.castAbilityByName(e, 'spirit-bomb', idiot)
  w.castAbilityByName(e, 'fracture', idiot)
  w.castAbilityByName(e, 'shear', idiot)
}

//w.despawn(e)
/*

import { parse, build } from './src/templates/attributeParser'
import data from './src/templates/playerAttributes'
build(parse(data))
*/
