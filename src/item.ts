import { IAbility } from './ability'
interface IItem {
  id: number
  slug: string
  slot: string
  stats: { [key: string]: number }
}
export { IItem }
