import { IAbility } from './ability'
interface IItem {
  id: number
  slug: string
  slot: number
  stats: { [key: string]: number }
}
export { IItem }
