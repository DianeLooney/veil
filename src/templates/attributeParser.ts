import * as babylon from 'babylon'
import * as fs from 'fs'
function parse(data: any) {
  let depList: { key: string; value: any; parents: string[] }[] = []
  for (let key in data) {
    let val = data[key]
    switch (typeof val) {
      case 'number':
        depList.push({
          key: key,
          parents: [],
          value: val
        })
        break
      case 'object':
        if (val instanceof Array) {
          depList.push({
            key: key,
            parents: [],
            value: val
          })
        }
        break
      case 'function':
        let d = babylon.parse('export default ' + val.toString(), { sourceType: 'module' })
        let prev = null
        let deps = d.tokens.reduce((acc: string[], t) => {
          if (prev === 'e[' && t.type.label === 'string') {
            acc.push(t.value)
            prev = null
          }
          if (prev === 'e' && t.type.label === '[') {
            prev = 'e['
          }
          if (t.type.label === 'name' && t.value === 'e') {
            prev = 'e'
          }
          return acc
        }, [])
        depList.push({
          key: key,
          parents: deps,
          value: val
        })
        break
      default:
        //console.log('Unrecognized value type for key:', key)
        break
    }
  }
  return depList
}
function build(depList: { value: any; key: string; parents: string[] }[]) {
  let attrs: { [key: string]: { value: any; parents: string[]; children: Set<string> } } = {}
  depList.forEach(x => {
    attrs[x.key] = { value: x.value, parents: x.parents, children: new Set() }
  })
  let markChild = function(attrs: { [key: string]: { parents: string[]; children: Set<string> } }, key: string, val: string) {
    attrs[key].children.add(val)
    attrs[key].parents.forEach(p => {
      markChild(attrs, p, val)
    })
  }
  depList.forEach(x => {
    attrs[x.key].parents.forEach(p => {
      markChild(attrs, p, x.key)
    })
  })
  return attrs
}
export { parse, build }
