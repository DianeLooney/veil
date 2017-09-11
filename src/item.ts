import { IAttributeGroup } from './entity'

interface IItem {
  id: number
  slug: string
  slot: string
  stats: IAttributeGroup
  artifactId: number
  artifactTraits: { id: number; rank: number }[]
}
export { IItem }
