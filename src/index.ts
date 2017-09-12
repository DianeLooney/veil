import { IEntity, DefaultEntity, DefaultBossEntity } from './entity'
import * as _ from './actions'
import { IWorld, DefaultWorld } from './world.js'
import { IAbilityTemplate, IPassiveTemplate } from './ability.js'
import {} from './modifier'
import dhVengeance from './templates/dh/vengeance'
import newSavedya from './templates/dh/savedya'
import savedya_gg from './templates/dh/savedya_greenglaives'
import consts from './consts'
import * as _debug from 'debug'
const debug = _debug('index')
import * as microtime from 'microtime'
var now = require('performance-now')
import { start, end, dump } from './perf'

let perfMode = process.env.VEIL_MODE === 'PERF'
if (perfMode) {
  debug('Started in Perf mode.')
  let total = 0
  let runs = 100
  let playerAttrs = _.BuildDefaultAttributesCache(newSavedya())
  let bossAttrs = _.BuildDefaultAttributesCache(DefaultBossEntity())
  for (let run = 0; run < runs; run++) {
    let startTime = now()
    let endTime
    const w = DefaultWorld() as IWorld
    const e = Object.assign({}, newSavedya()) as IEntity
    const idiot = DefaultBossEntity()
    idiot.slug = 'idiot'
    _.InitEntity(w, e, playerAttrs)
    _.InitEntity(w, idiot, bossAttrs)
    _.SpawnEntity(w, e)
    _.SpawnEntity(w, idiot)
    let first = true
    for (let i = 0; i < 25 * 300; i++) {
      //start('tick')
      _.TickWorld(w)
      //end('tick')

      if (!_.IsOnGCD(w, e)) {
        //start('casts')

        //start(`cast:'empower-wards'`)
        if (_.CastAbilityByName(w, e, 'empower-wards')) {
          //end('casts')
          //end(`cast:'empower-wards'`)
          continue
        }
        if (_.CastAbilityByName(w, e, 'infernal-strike', idiot)) {
          //end('casts')
          //end(`cast:'infernal-strike'`)
          continue
        }
        if (_.CastAbilityByName(w, e, 'metamorphosis', idiot)) {
          //end('casts')
          //end(`cast:'metamorphosis'`)
          continue
        }
        //start(`cast:'demon-spikes'`)
        if (_.CastAbilityByName(w, e, 'demon-spikes')) {
          //end('casts')
          //end(`cast:'demon-spikes'`)
          continue
        }
        //start(`cast:'soul-carver'`)
        if (_.CastAbilityByName(w, e, 'soul-carver', idiot)) {
          //end('casts')
          //end(`cast:'soul-carver'`)
          continue
        }
        //start(`cast:'sigil-of-flame'`)
        if (_.CastAbilityByName(w, e, 'sigil-of-flame', idiot)) {
          //end('casts')
          //end(`cast:'sigil-of-flame'`)
          continue
        }
        //start(`cast:'immolation-aura'`)
        if (_.CastAbilityByName(w, e, 'immolation-aura')) {
          //end('casts')
          //end(`cast:'immolation-aura'`)
          continue
        }
        //start(`cast:'spirit-bomb'`)
        if (e['fragment:count'] >= 4 && _.CastAbilityByName(w, e, 'spirit-bomb')) {
          //end('casts')
          //end(`cast:'spirit-bomb'`)
          continue
        }
        //start(`cast:'fracture'`)
        if (e['pain:current'] >= 300 && _.CastAbilityByName(w, e, 'fracture', idiot)) {
          //end('casts')
          //end(`cast:'fracture'`)
          continue
        }
        //start(`cast:'shear'`)
        if (_.CastAbilityByName(w, e, 'shear', idiot)) {
          //end('casts')
          //end(`cast:'shear'`)
          continue
        }
      }
    }
    endTime = now()
    total += endTime - startTime
    //debug('This time:', endTime - startTime)
    //dump()
  }
  console.log('Average time:', total / runs)
  dump()
} else {
  debug('Started in Live mode.')
  let playerAttrs = _.BuildDefaultAttributesCache(newSavedya())
  let bossAttrs = _.BuildDefaultAttributesCache(DefaultBossEntity())
  const w = DefaultWorld() as IWorld
  const e = Object.assign({}, newSavedya()) as IEntity
  const idiot = DefaultBossEntity()
  idiot.slug = 'idiot'
  _.InitEntity(w, e, playerAttrs)
  _.InitEntity(w, idiot, bossAttrs)
  e._talents.forEach(t => _.SelectTalent(w, e, t))
  _.SpawnEntity(w, e)
  _.SpawnEntity(w, idiot)
  let first = true

  //console.log(e.abilities['infernal-strike'].template['+cooldown'])

  setInterval(() => {
    //start('tick')
    _.TickWorld(w)
    //end('tick')

    if (!_.IsOnGCD(w, e)) {
      //start('casts')

      //start(`cast:'empower-wards'`)
      if (_.CastAbilityByName(w, e, 'empower-wards')) {
        //end('casts')
        //end(`cast:'empower-wards'`)
        return
      }
      if (_.CastAbilityByName(w, e, 'infernal-strike', idiot)) {
        //end('casts')
        //end(`cast:'infernal-strike'`)
        return
      }
      if (_.CastAbilityByName(w, e, 'metamorphosis', idiot)) {
        //end('casts')
        //end(`cast:'metamorphosis'`)
        return
      }
      //start(`cast:'demon-spikes'`)
      if (_.CastAbilityByName(w, e, 'demon-spikes')) {
        //end('casts')
        //end(`cast:'demon-spikes'`)
        return
      }
      //start(`cast:'soul-carver'`)
      if (_.CastAbilityByName(w, e, 'soul-carver', idiot)) {
        //end('casts')
        //end(`cast:'soul-carver'`)
        return
      }
      //start(`cast:'sigil-of-flame'`)
      if (_.CastAbilityByName(w, e, 'sigil-of-flame', idiot)) {
        //end('casts')
        //end(`cast:'sigil-of-flame'`)
        return
      }
      //start(`cast:'immolation-aura'`)
      if (_.CastAbilityByName(w, e, 'immolation-aura')) {
        //end('casts')
        //end(`cast:'immolation-aura'`)
        return
      }
      //start(`cast:'spirit-bomb'`)
      if (e['fragment:count'] >= 4 && _.CastAbilityByName(w, e, 'spirit-bomb')) {
        //end('casts')
        //end(`cast:'spirit-bomb'`)
        return
      }
      //start(`cast:'fracture'`)
      if (e['pain:current'] >= 300 && _.CastAbilityByName(w, e, 'fracture', idiot)) {
        //end('casts')
        //end(`cast:'fracture'`)
        return
      }
      //start(`cast:'shear'`)
      if (_.CastAbilityByName(w, e, 'shear', idiot)) {
        //end('casts')
        //end(`cast:'shear'`)
        return
      }
    }
  }, 40)

  //debug('This time:', endTime - startTime)
  //dump()
}
