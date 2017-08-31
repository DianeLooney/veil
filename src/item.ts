import { IAbility } from './ability'
interface IItem {
  id: number
  slug: string
  slot: string
  stats: { [key: string]: number }
  artifactId: number
  artifactTraits: { id: number; rank: number }[]
}
export { IItem }
