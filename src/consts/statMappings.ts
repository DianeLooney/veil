interface IMapping {
  [key: number]: string
}

let map: IMapping = {
  [3]: '+agi:rating',
  [32]: '+crit:rating',
  [40]: '+vers:rating',
  [49]: '+mastery:rating',
  [73]: '+primary:rating',
  [71]: '+primary:rating',
  [72]: '+str_agi:rating',
  [7]: '+stam:rating'
}
Object.freeze(map)
export default map as IMapping
