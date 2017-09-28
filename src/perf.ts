var now = require('performance-now')
var Table = require('cli-table')
let data = {}
let min = {}
let max = {}
let counts = {}
let starts = {}
function start(tag: string) {
  starts[tag] = now()
}
function end(tag: string) {
  let n = now()
  let v = n - starts[tag]
  data[tag] = (data[tag] || 0) + v
  min[tag] = Math.min(min[tag] || v, v)
  max[tag] = Math.max(max[tag] || 0, v)
  counts[tag] = (counts[tag] || 0) + 1
}
function dump() {
  var table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    head: ['Section', 'Min', 'Max', 'Average', 'Total', 'Count'],
    colAligns: ['left', 'right', 'right', 'right', 'right', 'right']
  })
  let minLength = 10
  for (let k in data) {
    minLength = Math.max(minLength, k.length)
  }
  var pad = ' '.repeat(minLength + 3)
  for (let k in data) {
    table.push([
      k,
      (10000 * min[k]).toFixed(1),
      (10000 * max[k]).toFixed(1),
      (10000 * data[k] / counts[k]).toFixed(1),
      data[k].toFixed(2),
      counts[k]
    ])
  }
  console.log(table.toString())
}
export { start, end, dump }
