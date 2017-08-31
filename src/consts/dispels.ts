let lookup = [
  'DISPEL_NONE',
  'DISPEL_MAGIC',
  'DISPEL_CURSE',
  'DISPEL_DISEASE',
  'DISPEL_POISON',
  'DISPEL_STEALTH',
  'DISPEL_INVISIBILITY',
  'DISPEL_ALL',
  'DISPEL_SPE_NPC_ONLY',
  'DISPEL_ENRAGE',
  'DISPEL_ZG_TICKET',
  'DESPEL_OLD_UNUSED'
]
let data = {}
lookup.forEach(x => (data[x] = x))
export { lookup }
export default data
