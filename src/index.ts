import { IEntity, DefaultPlayerEntity, DefaultBossEntity } from './entity'
import * as _ from './actions'
import { IWorld, DefaultWorld } from './world.js'
import { IAbilityTemplate, IPassiveTemplate } from './ability.js'
import dhVengeance from './templates/dh/vengeance'
import newSavedya from './templates/dh/savedya'
import savedya_gg from './templates/dh/savedya_greenglaives'
import consts from './consts'
import getDPSMetric from './metrics/dps'
import getCastMetric from './metrics/casts'
import { isReady } from './report'
const _debug = require('debug')
const debug = _debug('index')
const microtime = require('microtime')
var now = require('performance-now')
import { start, end, dump } from './perf'

let doDhRotation = function(w: IWorld, e: IEntity, t: IEntity) {
  if (_.IsOnGCD(w, e)) {
    return
  }
  //start('casts')

  //start(`cast:'empower-wards'`)
  if (_.CastAbilityByName(w, e, 'empower-wards')) {
    //end('casts')
    //end(`cast:'empower-wards'`)
    return
  }
  if (_.CastAbilityByName(w, e, 'fiery-brand', t)) {
    //end('casts')
    //end(`cast:'fiery-brand'`)
    return
  }
  //start(`cast:'infernal-strike'`)
  if (_.CastAbilityByName(w, e, 'infernal-strike', t)) {
    //end('casts')
    //end(`cast:'infernal-strike'`)
    return
  }
  //start(`cast:'metamorphosis'`)
  if (_.CastAbilityByName(w, e, 'metamorphosis', t)) {
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
  if (_.CastAbilityByName(w, e, 'soul-carver', t)) {
    //end('casts')
    //end(`cast:'soul-carver'`)
    return
  }
  //start(`cast:'sigil-of-flame'`)
  if (_.CastAbilityByName(w, e, 'sigil-of-flame', t)) {
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
  if (e['fragment:count'] >= 5 && _.CastAbilityByName(w, e, 'spirit-bomb')) {
    //end('casts')
    //end(`cast:'spirit-bomb'`)
    return
  }
  //start(`cast:'fracture'`)
  if (_.CastAbilityByName(w, e, 'fracture', t)) {
    //end('casts')
    //end(`cast:'fracture'`)
    return
  }
  //start(`cast:'shear'`)
  if (_.CastAbilityByName(w, e, 'shear', t)) {
    //end('casts')
    //end(`cast:'shear'`)
    return
  }
}

switch (process.env.VEIL_MODE) {
  case 'PERF':
    {
      debug('Started in Perf mode.')
      let total = 0
      let runs = 100
      for (let run = 0; run < runs; run++) {
        let startTime = now()
        let endTime
        //start('spawning')
        const w = DefaultWorld() as IWorld
        const e = Object.assign({}, newSavedya()) as IEntity
        const idiot = DefaultBossEntity()
        idiot.slug = 'idiot'
        _.InitEntity(w, e)
        _.InitEntity(w, idiot)
        _.SpawnEntity(w, e)
        _.SpawnEntity(w, idiot)
        //end('spawning')
        let first = true
        //start('ticking')
        for (let i = 0; i < 25 * 300; i++) {
          start('tick')
          _.TickWorld(w)
          end('tick')
          doDhRotation(w, e, idiot)
        }
        //end('ticking')
        if (run % 10 === 0) {
          //start('gc')
          global.gc()
          //end('gc')
        }

        endTime = now()
        total += endTime - startTime
        //debug('This time:', endTime - startTime)
        //dump()
      }
      console.log('Average time:', total / runs)
      dump()
    }
    break
  case 'LIVE':
    {
      debug('Started in Live mode.')
      const w = DefaultWorld() as IWorld
      const e = Object.assign({}, newSavedya()) as IEntity
      const idiot = DefaultBossEntity()
      idiot.slug = 'idiot'
      _.InitEntity(w, e)
      _.InitEntity(w, idiot)
      e._talents.forEach(t => _.SelectTalent(w, e, t))
      _.SpawnEntity(w, e)
      _.SpawnEntity(w, idiot)
      let first = true

      //console.log(e.abilities['infernal-strike'].template['+cooldown'])
      setInterval(() => {
        if (!isReady()) {
          return
        }
        if (first) {
          _.StartCombat(w)
        }
        first = false
        _.TickWorld(w)
        doDhRotation(w, e, idiot)
      }, 40)
    }
    break
  case 'DPS':
  default:
    ;(() => {
      const w = DefaultWorld() as IWorld
      const e = Object.assign({}, newSavedya()) as IEntity
      const mDps = getDPSMetric(w, e)
      _.AttachMetric(w, mDps)
      const idiot = DefaultBossEntity()
      idiot.slug = 'idiot'
      _.InitEntity(w, e)
      _.InitEntity(w, idiot)
      _.SpawnEntity(w, e)
      _.SpawnEntity(w, idiot)
      let first = true
      let t = 200 * w._second / w._tickDelta
      _.StartCombat(w)
      for (let i = 0; i < t; i++) {
        _.TickWorld(w)
        doDhRotation(w, e, idiot)
      }
      _.EndCombat(w)
      console.log(mDps.summary())
    })()
    break
}
