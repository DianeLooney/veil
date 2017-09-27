const babylon = require('babylon')
const fs = require('fs')
function parse(data) {
  let depList = []
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
        let deps = d.tokens.reduce((acc, t) => {
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
        console.log('Unrecognized value type for key:', key)
        break
    }
  }
  return depList
}
function build(depList) {
  let attrs = {}
  depList.forEach(x => {
    attrs[x.key] = { value: x.value, parents: x.parents, children: new Set() }
  })
  let markChild = function(attrs, key, val) {
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
let locations = [{ name: 'PlayerAttributes', path: '/src/attrs/player' }, { name: 'VengeanceAttributes', path: '/src/attrs/vengeance' }]
locations.map(batch => {
  let x = batch.path
  let data = build(parse(require('..' + x + '_template.js')))
  let out = `interface ICalcFunc {
    (e: any): number
  }\n`

  out += `interface I${batch.name} {\n`
  for (let k in data) {
    if (data[k].value instanceof Array) {
      out += `  '${k}': number[]\n`
    } else {
      out += `  '${k}': number\n`
    }
    //out += `private '__${k}__': number|undefined\n`
  }
  out += '}\n'
  out += `export { I${batch.name} }\n`
  out += `interface i${batch.name} extends I${batch.name} {\n`
  for (let k in data) {
    if (data[k].value instanceof Array) {
      out += `'__${k}__': number[]|undefined\n`
    } else {
      out += `'__${k}__': number|undefined\n`
    }
  }
  out += '}\n'
  out += `export default function attach${batch.name}(o: any):I${batch.name}{\n`
  out += `let e = o as i${batch.name}\n`
  out += '  let calc: { [key: string]: ICalcFunc | number } = {}\n'
  for (let k in data) {
    out += `  delete e['${k}']\n`
    if (typeof data[k].value === 'function') {
      out += `  calc['${k}'] = ${data[k].value.toString()}\n`
    }
    out += `  Object.defineProperty(e, '${k}', {
    get: function() {
      if (e['__${k}__'] === undefined) {\n`
    if (typeof data[k].value === 'function') {
      out += `      e['__${k}__'] = (calc['${k}'] as ICalcFunc)(e)
      }\n`
    } else if (typeof data[k].value === 'number') {
      out += `      e['__${k}__'] = ${data[k].value}
      }\n`
    } else if (data[k].value instanceof Array) {
      out += `    e['__${k}__'] = [${data[k].value.join(',')}]
    }\n`
    }

    out += `      return e['__${k}__']
  },
  set: function(v) {\n`
    if (typeof data[k].value === 'function') {
      out += `      console.error('Unable to set attribute ${k}')\n`
    } else if (typeof data[k].value === 'number') {
      data[k].children.forEach(c => {
        out += `      e['__${c}__'] = undefined\n`
      })
      out += `      e['__${k}__'] = v\n`
    } else if (data[k].value instanceof Array) {
      data[k].children.forEach(c => {
        out += `      e['__${c}__'] = undefined\n`
      })
      out += `      e['__${k}__'] = v\n`
    }
    out += `    }
  })\n`

    //console.log(`${k}:\t${data[k].toString()}`)
  }
  out += 'return e\n'
  out += '}'
  fs.writeFileSync('.' + x + '.ts', out)
  //console.log(build(parse(data)))
})
