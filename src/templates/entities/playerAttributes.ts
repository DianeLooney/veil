let attributes = {
  ['level']: 110,
  ['class']: 12,

  ['agi:base']: 9030, //TODO: Magic Number
  ['+primary:rating']: 0,
  ['+str_agi:rating']: 0,
  ['+agi_int:rating']: 0,
  ['+agi:rating']: 0,
  ['agility']: function(e) {
    return e['agi:base'] + e['+primary:rating'] + e['+str_agi:rating'] + e['+agi_int:rating'] + e['+agi:rating']
  },

  ['stam:base']: 6259, //TODO: Magic Number
  ['+stam:rating']: 0,
  ['*stam:rating']: 1,
  ['stamina']: function(e) {
    return Math.round((e['stam:base'] + e['+stam:rating']) * e['*stam:rating'])
  },

  ['+haste:rating']: 0,
  ['*haste:rating']: 1,
  ['+haste']: 0,
  ['haste:rating:conversion']: 37500, //TODO: Magic Number
  ['haste']: function(e) {
    return e['+haste'] + e['+haste:rating'] * e['*haste:rating'] / e['haste:rating:conversion']
  },

  ['+crit:rating']: 0,
  ['*crit:rating']: 1,
  ['crit:rating:conversion']: 40000, //TODO: Magic Number
  ['crit:rating']: function(e) {
    return e['+crit:rating'] * e['*crit:rating']
  },
  ['+crit']: 0,
  ['crit']: function(e) {
    //TODO: 0.05 shouldn't be here, it should be attached to the DH
    return 0.05 + e['+crit'] + e['crit:rating'] / e['crit:rating:conversion']
  },

  ['parry:rating:conversion']: 51500,
  ['parry:base']: 0.03,
  ['parry:pre-dr']: function(e) {
    //TODO: Only calculate for tanks that get this perk.
    return e['crit:rating'] / e['parry:rating:conversion']
  },
  ['+parry']: 0,
  ['parry']: function(e) {
    //TODO: Fix this Magic Number
    //TODO: Fix this Magic Number
    return e['parry:base'] + e['+parry'] + e['parry:pre-dr'] / (e['parry:pre-dr'] * 3.15 + 1 / 0.94)
  },

  ['dodge:base']: 0.03,
  ['+dodge']: 0,
  ['dodge:rating:conversion']: 131102,
  ['dodge:pre-dr']: function(e) {
    return (e['agility'] - e['agi:base']) / e['dodge:rating:conversion']
  },
  ['dodge']: function(e) {
    return e['dodge:base'] + e['+dodge'] + e['dodge:pre-dr'] / (e['dodge:pre-dr'] * 3.15 + 1 / 0.94)
  },

  ['+vers:rating']: 0,
  ['vers:rating:conversion:dd']: 47500,
  ['vers:damage-done']: function(e) {
    return e['+vers:rating'] / e['vers:rating:conversion:dd']
  },
  ['vers:rating:conversion:dt']: 95000,
  ['vers:damage-taken']: function(e) {
    return e['+vers:rating'] / e['vers:rating:conversion:dt']
  },
  ['vers:rating:conversion:hd']: 47500,
  ['vers:healing-done']: function(e) {
    return e['+vers:rating'] / e['vers:rating:conversion:hd']
  },

  ['+mastery:rating']: 0,
  ['mastery:rating:conversion:standard']: 40000,
  ['mastery:standard:base']: 0.08,
  ['mastery:standard']: function(e) {
    return e['mastery:standard:base'] + e['+mastery:rating'] / e['mastery:rating:conversion:standard']
  },
  ['attackpower']: function(e) {
    //TODO: Base this off of spec-specific str/agi/hpally/mw
    return (1 + e['mastery:standard']) * e['agility']
  },
  ['+mainHand:damage:min']: 0,
  ['+mainHand:damage:max']: 0,
  ['mainHand:speed']: 0,
  ['mainHand:damage:normalized']: function(e) {
    return (
      (e['+mainHand:damage:min'] + e['+mainHand:damage:max']) / 2 +
      (e['mainHand:speed'] || 0) * (1 / 3.5) * e['attackpower']
    )
  },
  ['mainHand:damage:dps']: function(e) {
    return e['mainHand:damage:normalized'] / e['mainHand:speed']
  },
  ['+offHand:damage:min']: 0,
  ['+offHand:damage:max']: 0,
  ['offHand:speed']: 0,
  ['offHand:damage:normalized']: function(e) {
    return (
      0.5 *
      ((e['+offHand:damage:min'] + e['+offHand:damage:max']) / 2 +
        (e['offHand:speed'] || 0) * (1 / 3.5) * e['attackpower'])
    )
  },
  ['offHand:damage:dps']: function(e) {
    return e['offHand:damage:normalized'] / e['offHand:speed']
  }
}
export default attributes
