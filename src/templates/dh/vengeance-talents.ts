import { ITalentSlot, DefaultTalentSlot } from '../../entity'
import { IEntity } from '../../Entity'
import { IWorld, formatTime } from '../../world'
import { spawnFragment, consumeFragment } from './vengeance'
import * as _ from '../../actions'
import * as _debug from 'debug'
import { IAbilityTemplate, AbilityDefaults, IPassiveTemplate, IAbilityInstance, ICastFunc } from '../../Ability'

const debug = _debug('vengeance-talents')
const verbose = _debug('verbose:vengeance-talents')

// Tier 1
export const abyssalStrike: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'abyssal-strike',
  row: 0,
  column: 0,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'infernal-strike': { '+cooldown': -8 } } }
})

export const agonizingFlames: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'agonizing-flames',
  row: 0,
  column: 1,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'immolation-aura': { '*damage': 1.2 } } }
})

export const razorSpikes: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'razor-spikes',
  row: 0,
  column: 2,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'razor-spikes': { '*damage:physical': 1.3 } } }
})

// Tier 2
//TODO: FoS
export const fallout: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'fallout',
  row: 1,
  column: 1,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'immolation-aura': { '+fragments-per-target': 0.6 } } }
})
export const burningAlive: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'burning-alive',
  row: 1,
  column: 2,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'immolation-aura': { '+spread-per-tick': 1, '+damage-enabled': 1 } } }
})

// Tier 3
export const flameCrash: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'flame-crash',
  row: 1,
  column: 2,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'infernal-strike': { '+crash-enabled': 1 } } }
})

const fractureAbility = Object.assign({}, AbilityDefaults, {
  id: 209795,
  slug: 'fracture',
  cost: {
    'pain:current': 300
  },
  onCast: [
    (w: IWorld, e: IEntity, i: IAbilityInstance, t: IEntity) => {
      _.CastFreeAbilityByTemplate(w, e, fractureMainHand, t)
      _.Delayed(w, e, {
        when: w.now + 0.125 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          _.CastFreeAbilityByTemplate(w, e, fractureOffHand, t)
        }
      })
    }
  ] as ICastFunc[]
})
const fractureMainHand: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 225919,
  slug: 'fracture-mh',
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, i: IAbilityInstance, t: IEntity) => {
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        mhDamageNorm: 4.51 * e['*vengeance:damage'] * e['damage:physical'],
        ability: fractureMainHand
      })
      spawnFragment(w, e, false)
    }
  ] as ICastFunc[]
})
const fractureOffHand: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  id: 225921,
  slug: 'fracture-oh',
  onGCD: false,
  triggersGCD: false,
  onCast: [
    (w: IWorld, e: IEntity, i: IAbilityInstance, t: IEntity) => {
      _.DealDamage(w, e, t, {
        source: e,
        target: t,
        type: 'PHYSICAL',
        ohDamageNorm: 8.97 * e['*vengeance:damage'] * e['damage:physical'],
        ability: fractureOffHand
      })
      spawnFragment(w, e, false)
    }
  ] as ICastFunc[]
})
export const fracture: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'fracture',
  row: 2,
  column: 1,
  enabled: false,
  passives: [],
  actives: [fractureAbility],
  attributes: {}
})

// Tier 4
export const concentratedSigils = Object.assign({}, DefaultTalentSlot, {
  slug: 'concentrated-sigils',
  row: 1,
  column: 0,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'sigil-of-flame': { '+selfcast-enabled': 1 } } }
})

// Tier 5

const spiritBombAbility: IAbilityTemplate = Object.assign({}, AbilityDefaults, {
  slug: 'spirit-bomb',
  requires: {
    ['fragment:count']: 1
  },
  onCast: [
    (w: IWorld, e: IEntity, i: IAbilityInstance) => {
      let x = e['fragment:count']
      consumeFragment(w, e, x)
      debug('casting spirit bomb')
      _.Delayed(w, e, {
        when: w.now + 0.125 * w._second,
        func: (w: IWorld, e: IEntity): void => {
          //TODO: target units in range of the caster intsead of his target
          _.EnemiesTouchingRadius(w, e.position, 8).forEach(tar => {
            _.DealDamage(w, e, tar, {
              source: e,
              target: tar,
              type: 'FIRE',
              attackPower: 1.8 * x * e['damage:fire'],
              ability: spiritBombAbility
            })
          })

          //TODO: Apply healing modifier
        }
      })
    }
  ] as ICastFunc[]
})
export const spiritBomb = Object.assign({}, DefaultTalentSlot, {
  slug: 'spirit-bomb',
  row: 1,
  column: 2,
  enabled: false,
  passives: [],
  actives: [spiritBombAbility],
  attributes: {}
})
