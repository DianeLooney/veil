let lookup = [
  'IMMUNITY_EFFECT',
  'IMMUNITY_STATE',
  'IMMUNITY_SCHOOL',
  'IMMUNITY_DAMAGE',
  'IMMUNITY_DISPEL',
  'IMMUNITY_MECHANIC',
  'IMMUNITY_ID'
]
let data = {}
lookup.forEach(x => (data[x] = x))
export { lookup }
export default data
