interface IMapping {
  [key: number]: string
}

let map: IMapping = {
  [32]: '+crit:rating',
  //[40]: '+vers:rating',
  //[73]: '+primary:rating',
  [7]: '+stam:rating'
}
Object.freeze(map)
export default map as IMapping
