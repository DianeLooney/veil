let playerAttributes = require('./player_template')
module.exports = Object.assign(playerAttributes, {
  ['pain:max:base']: 1000,
  ['+pain:max']: 0,
  ['pain:current']: 0,
  ['pain:max']: function(e) {
    return e['pain:max:base'] + e['+pain:max']
  },
  ['fragment:expiration:time']: [],
  ['fragment:count']: 0,
  ['*vengeance:damage']: 0.95,
  ['+shear:damage']: 0.12,

  ['artifact:defensive-spikes:amount']: 0.1,
  ['artifact:defensive-spikes:duration']: 0.1,
  ['mastery:rating:conversion:demon-spikes']: 0.75,
  ['mastery:demon-spikes']: function(e) {
    return e['mastery:standard'] * e['mastery:rating:conversion:demon-spikes']
  }
})
