import { ISubscription, IMetric } from '../metric'
import { IWorld } from '../world'
import { IEntity } from '../entity'

let getCastMetric = function(w: IWorld, e: IEntity): IMetric {
  let castsByAbility = {} as { [key: string]: number }
  return {
    slug: 'cast-count',
    subscriptions: [{ event: 'CAST' }],
    notify: (event, data) => {
      switch (event) {
        case 'CAST':
          if (castsByAbility[data.ability] === undefined) {
            castsByAbility[data.ability] = 0
          }
          castsByAbility[data.ability] += 1
          break
      }
    },
    summary: () => {
      let total = 0
      for (let k in castsByAbility) {
        total += castsByAbility[k]
      }
      return {
        casts: castsByAbility
      }
    }
  }
}
export default getCastMetric
