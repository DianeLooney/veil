import { IEntity } from '../../entity'
import { IActor } from '../../actor'
import World from '../../World'

interface IActorSpammy extends IActor {
  attach(w: World, e: IEntity, s: string): void
}

const SpammyTemplate: IActorSpammy = {
  attach(w: World, e: IEntity, s: string): void {
    this.act = function(w: World): void {
      w.castAbilityByName(e, s)
      //e.castAbility(s)
    }
  },
  act(w: World): void {}
}

export { SpammyTemplate }
export { IActorSpammy }
