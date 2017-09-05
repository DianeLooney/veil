import { IEntity, DefaultEntity, DefaultBossEntity } from './src/entity'
import * as _ from './src/actions'
import { IWorld, DefaultWorld } from './src/world.js'
import { IAbility } from './src/ability.js'
import { IModifier } from './src/modifier'
import dhVengeance from './src/templates/dh/vengeance'
import savedya from './src/templates/dh/savedya'
import savedya_gg from './src/templates/dh/savedya_greenglaives'
import consts from './src/consts'
import * as _debug from 'debug'
const debug = _debug('index')
import * as microtime from 'microtime'
var now = require('performance-now')
import { start, end, dump } from './src/perf'

let total = 0
let runs = 100
for (let run = 0; run < runs; run++) {
  let startTime = now()
  let endTime
  const w = DefaultWorld() as IWorld

  const e = Object.assign({}, savedya) as IEntity

  const idiot = DefaultBossEntity()
  idiot.slug = 'idiot'
  _.InitEntity(w, e)
  _.InitEntity(w, idiot)
  _.SpawnEntity(w, e)
  _.SpawnEntity(w, idiot)

  let first = true
  for (let i = 0; i < 40 * 300; i++) {
    start('tick')
    _.TickWorld(w)
    end('tick')

    if (!_.IsOnGCD(e)) {
      start('casts')
      _.CastAbilityByName(w, e, 'empower-wards')
      _.CastAbilityByName(w, e, 'demon-spikes')
      _.CastAbilityByName(w, e, 'soul-carver', idiot)
      _.CastAbilityByName(w, e, 'sigil-of-flame', idiot)
      _.CastAbilityByName(w, e, 'immolation-aura')
      if (e['fragment:count'] >= 4) {
        _.CastAbilityByName(w, e, 'spirit-bomb')
      }
      _.CastAbilityByName(w, e, 'fracture', idiot)
      _.CastAbilityByName(w, e, 'shear', idiot)
      end('casts')
    }
  }
  endTime = now()
  total += endTime - startTime
}
console.log('Average time:', total / runs)
dump()
