import { ISubscription, IMetric } from '../metric'
import { IWorld } from '../world'
import { IEntity } from '../entity'

let getDPSMetric = function(w: IWorld, e: IEntity): IMetric {
  let damageByAbility = {} as { [key: string]: number }
  let castsByAbility = {} as { [key: string]: number }
  let combatStart = 0
  let combatEnd = 1
  return {
    slug: 'dps',
    subscriptions: [{ event: 'COMBAT_START' }, { event: 'COMBAT_END' }, { event: 'DAMAGE_DONE' }, { event: 'CAST' }],
    notify: (event, data) => {
      switch (event) {
        case 'CAST':
          if (castsByAbility[data.ability] === undefined) {
            castsByAbility[data.ability] = 0
          }
          castsByAbility[data.ability] += 1
          break
        case 'COMBAT_START':
          combatEnd = data.timestamp
          break
        case 'COMBAT_END':
          combatEnd = data.timestamp
          break
        case 'DAMAGE_DONE':
          if (damageByAbility[data.ability.slug] === undefined) {
            damageByAbility[data.ability.slug] = 0
          }
          damageByAbility[data.ability.slug] += data.amount
          if (isNaN(data.amount)) {
            console.log(data)
          }
          break
      }
    },
    summary: () => {
      let total = 0
      let damagePerCast = {}
      for (let k in damageByAbility) {
        total += damageByAbility[k]
      }
      for (let k in castsByAbility) {
        if (damageByAbility[k] > 0) {
          damagePerCast[k] = damageByAbility[k] / castsByAbility[k]
        }
      }
      return {
        timeInCombat: combatEnd - combatStart,
        damageDone: total,
        dps: total / (combatEnd - combatStart),
        breakdown: damageByAbility,
        perCast: damagePerCast
      }
    }
  }
}
export default getDPSMetric
