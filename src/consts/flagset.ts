interface IEnum {
  [key: string]: number
}
interface IFlagSetInstance {
  groupMapping: IEnum
  bitMapping: IEnum
  get(flag: string): boolean
  set(flag: string, bit: boolean): void
  _data: { [key: number]: number }
}
const createMappings = function(flags: string[][]) {
  let groupMapping: IEnum = {}
  let bitMapping: IEnum = {}
  for (let group = 0; flags[group] != undefined; group++) {
    let bit = 1
    for (let offset = 0; offset < 32; offset++) {
      let flagName = flags[group][offset]
      groupMapping[flagName] = group
      bitMapping[flagName] = bit
      bit = bit << 1
    }
  }
  return { groupMapping, bitMapping }
}
const createFlagSet = function(groupMapping: IEnum, bitMapping: IEnum): IFlagSetInstance {
  let _data = {}
  for (var g in groupMapping) {
    if (_data[groupMapping[g]] === undefined) {
      _data[groupMapping[g]] = 0
    }
  }
  return { groupMapping, bitMapping, _data, get, set }
}
const set = function(flag: string, bit: boolean): void {
  let group = this.groupMapping[flag]
  let value = this.bitMapping[flag]
  if (bit) {
    this._data[group] = this._data[group] | value
  } else {
    this._data[group] = this._data[group] & ~value
  }
}
const get = function(flag: string): boolean {
  let group = this.groupMapping[flag]
  let value = this.bitMapping[flag]
  return (this._data[group] & value) != 0
}
export { createMappings, IEnum, IFlagSetInstance, createFlagSet }
