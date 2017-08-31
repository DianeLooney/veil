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
export { IEnum, IFlagSetInstance, createFlagSet }
