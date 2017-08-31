let lookup = [
  'SPELL_MISS_NONE',
  'SPELL_MISS_MISS',
  'SPELL_MISS_RESIST',
  'SPELL_MISS_DODGE',
  'SPELL_MISS_PARRY',
  'SPELL_MISS_BLOCK',
  'SPELL_MISS_EVADE',
  'SPELL_MISS_IMMUNE',
  'SPELL_MISS_IMMUNE2',
  'SPELL_MISS_DEFLECT',
  'SPELL_MISS_ABSORB',
  'SPELL_MISS_REFLECT'
]
let data = {}
lookup.forEach(x => (data[x] = x))
export { lookup }
export default data
