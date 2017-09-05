var now = require('performance-now')
let data = {}
let counts = {}
let starts = {}
function start(tag: string) {
  starts[tag] = now()
}
function end(tag: string) {
  let n = now()
  data[tag] = (data[tag] || 0) + (n - starts[tag])
  counts[tag] = (counts[tag] || 0) + 1
}
function dump() {
  let minLength = 0
  for (let k in data) {
    minLength = Math.max(minLength, k.length)
  }
  var pad = ' '.repeat(minLength + 3)
  for (let k in data) {
    console.log(
      `${k + pad.substring(0, pad.length - k.length)}:${(10000 * data[k] / counts[k]).toFixed(1)}\t${data[k].toFixed(2)}\t${counts[k]}`
    )
  }
}
export { start, end, dump }
