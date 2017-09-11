import { ITalentSlot, DefaultTalentSlot } from '../../entity'
export const abyssalStrike: ITalentSlot = Object.assign({}, DefaultTalentSlot, {
  slug: 'abyssal-strike',
  row: 0,
  column: 0,
  enabled: false,
  passives: [],
  actives: [],
  attributes: { ability: { 'infernal-strike': { '+cooldown': -8 } } }
})
