let lookup = [
  'SPELL_DAMAGE_CLASS_NONE',
  'SPELL_DAMAGE_CLASS_MAGIC',
  'SPELL_DAMAGE_CLASS_MELEE',
  'SPELL_DAMAGE_CLASS_RANGED'
]

let data = {}
lookup.forEach(x => (data[x] = x))
export { lookup }
export default data
