import { IEntity } from './Entity'
import World from './World'
interface IActor {
  act(w: World): void
}
export { IActor }
