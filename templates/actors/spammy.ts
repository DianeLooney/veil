import { IEntity } from '../../entity'
import { IActor } from '../../actor'
import World from '../../World'

interface IActorSpammy extends IActor {
  attach(e: IEntity, s: string): void
}

const SpammyTemplate: IActorSpammy = {
  attach(e: IEntity, s: string): void {
    this.act = function(w: World): void {
      e.castAbility(s)
    }
  },
  act(w: World): void {}
}

export { SpammyTemplate }
export { IActorSpammy }
