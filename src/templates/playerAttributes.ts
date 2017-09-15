interface ICalcFunc {
  (e: any): number
}
interface IPlayerAttributes {
  level: number
  class: number
  'agi:base': number
  '+primary:rating': number
  '+str_agi:rating': number
  '+agi_int:rating': number
  '+agi:rating': number
  agility: number
  'stam:base': number
  '+stam:rating': number
  '*stam:rating': number
  stamina: number
  '+maxHealth': number
  '*maxHealth': number
  'stamina:rating:conversion': number
  'maxHealth:base': number
  maxHealth: number
  '+haste:rating': number
  '*haste:rating': number
  '+haste': number
  'haste:rating:conversion': number
  haste: number
  '+crit:rating': number
  '*crit:rating': number
  'crit:rating:conversion': number
  'crit:rating': number
  '+crit': number
  crit: number
  'parry:rating:conversion': number
  'parry:base': number
  'parry:pre-dr': number
  '+parry': number
  parry: number
  'dodge:base': number
  '+dodge': number
  'dodge:rating:conversion': number
  'dodge:pre-dr': number
  dodge: number
  '+vers:rating': number
  'vers:rating:conversion:dd': number
  'vers:damage-done': number
  'vers:rating:conversion:dt': number
  'vers:damage-taken': number
  'vers:rating:conversion:hd': number
  'vers:healing-done': number
  '*damage': number
  damage: number
  '*damage:physical': number
  'damage:physical': number
  '*damage:fire': number
  'damage:fire': number
  '+mastery:rating': number
  'mastery:rating:conversion:standard': number
  'mastery:standard:base': number
  'mastery:standard': number
  attackpower: number
  '+mainHand:damage:min': number
  '+mainHand:damage:max': number
  '+mainHand:speed': number
  'mainHand:speed:normalized': number
  'mainHand:damage:normalized': number
  'mainHand:damage:dps': number
  '+offHand:damage:min': number
  '+offHand:damage:max': number
  '+offHand:speed': number
  'offHand:speed:normalized': number
  'offHand:damage:normalized': number
  'offHand:damage:dps': number
  '+armor:rating': number
  '*armor:rating': number
  'armor:rating': number
  'armor:k': number
  armor: number
  '*dr:all': number
  '*dr:physical': number
  '*dr:magical': number
  '+threat': number
  'gcd:base': number
  'gcd:min': number
  'gcd:time': number
  'gcd:remaining': number
  '*spell:recharge-rate:base': number
  'spell:recharge-rate:hasted': number
  'spell:recharge-rate:unhasted': number
}
export { IPlayerAttributes }
interface iPlayerAttributes extends IPlayerAttributes {
  __level__: number | undefined
  __class__: number | undefined
  '__agi:base__': number | undefined
  '__+primary:rating__': number | undefined
  '__+str_agi:rating__': number | undefined
  '__+agi_int:rating__': number | undefined
  '__+agi:rating__': number | undefined
  __agility__: number | undefined
  '__stam:base__': number | undefined
  '__+stam:rating__': number | undefined
  '__*stam:rating__': number | undefined
  __stamina__: number | undefined
  '__+maxHealth__': number | undefined
  '__*maxHealth__': number | undefined
  '__stamina:rating:conversion__': number | undefined
  '__maxHealth:base__': number | undefined
  __maxHealth__: number | undefined
  '__+haste:rating__': number | undefined
  '__*haste:rating__': number | undefined
  '__+haste__': number | undefined
  '__haste:rating:conversion__': number | undefined
  __haste__: number | undefined
  '__+crit:rating__': number | undefined
  '__*crit:rating__': number | undefined
  '__crit:rating:conversion__': number | undefined
  '__crit:rating__': number | undefined
  '__+crit__': number | undefined
  __crit__: number | undefined
  '__parry:rating:conversion__': number | undefined
  '__parry:base__': number | undefined
  '__parry:pre-dr__': number | undefined
  '__+parry__': number | undefined
  __parry__: number | undefined
  '__dodge:base__': number | undefined
  '__+dodge__': number | undefined
  '__dodge:rating:conversion__': number | undefined
  '__dodge:pre-dr__': number | undefined
  __dodge__: number | undefined
  '__+vers:rating__': number | undefined
  '__vers:rating:conversion:dd__': number | undefined
  '__vers:damage-done__': number | undefined
  '__vers:rating:conversion:dt__': number | undefined
  '__vers:damage-taken__': number | undefined
  '__vers:rating:conversion:hd__': number | undefined
  '__vers:healing-done__': number | undefined
  '__*damage__': number | undefined
  __damage__: number | undefined
  '__*damage:physical__': number | undefined
  '__damage:physical__': number | undefined
  '__*damage:fire__': number | undefined
  '__damage:fire__': number | undefined
  '__+mastery:rating__': number | undefined
  '__mastery:rating:conversion:standard__': number | undefined
  '__mastery:standard:base__': number | undefined
  '__mastery:standard__': number | undefined
  __attackpower__: number | undefined
  '__+mainHand:damage:min__': number | undefined
  '__+mainHand:damage:max__': number | undefined
  '__+mainHand:speed__': number | undefined
  '__mainHand:speed:normalized__': number | undefined
  '__mainHand:damage:normalized__': number | undefined
  '__mainHand:damage:dps__': number | undefined
  '__+offHand:damage:min__': number | undefined
  '__+offHand:damage:max__': number | undefined
  '__+offHand:speed__': number | undefined
  '__offHand:speed:normalized__': number | undefined
  '__offHand:damage:normalized__': number | undefined
  '__offHand:damage:dps__': number | undefined
  '__+armor:rating__': number | undefined
  '__*armor:rating__': number | undefined
  '__armor:rating__': number | undefined
  '__armor:k__': number | undefined
  __armor__: number | undefined
  '__*dr:all__': number | undefined
  '__*dr:physical__': number | undefined
  '__*dr:magical__': number | undefined
  '__+threat__': number | undefined
  '__gcd:base__': number | undefined
  '__gcd:min__': number | undefined
  '__gcd:time__': number | undefined
  '__gcd:remaining__': number | undefined
  '__*spell:recharge-rate:base__': number | undefined
  '__spell:recharge-rate:hasted__': number | undefined
  '__spell:recharge-rate:unhasted__': number | undefined
}
export default function attachPlayerAttributes(o: any): IPlayerAttributes {
  let e = o as iPlayerAttributes
  let calc: { [key: string]: ICalcFunc | number } = {}
  delete e['level']
  Object.defineProperty(e, 'level', {
    get: function() {
      if (e['__level__'] === undefined) {
        e['__level__'] = 110
      }
      return e['__level__']
    },
    set: function(v) {
      e['__level__'] = 110
    }
  })
  delete e['class']
  Object.defineProperty(e, 'class', {
    get: function() {
      if (e['__class__'] === undefined) {
        e['__class__'] = 12
      }
      return e['__class__']
    },
    set: function(v) {
      e['__class__'] = 12
    }
  })
  delete e['agi:base']
  Object.defineProperty(e, 'agi:base', {
    get: function() {
      if (e['__agi:base__'] === undefined) {
        e['__agi:base__'] = 9027
      }
      return e['__agi:base__']
    },
    set: function(v) {
      e['__agility__'] = undefined
      e['__dodge:pre-dr__'] = undefined
      e['__dodge__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__agi:base__'] = 9027
    }
  })
  delete e['+primary:rating']
  Object.defineProperty(e, '+primary:rating', {
    get: function() {
      if (e['__+primary:rating__'] === undefined) {
        e['__+primary:rating__'] = 0
      }
      return e['__+primary:rating__']
    },
    set: function(v) {
      e['__agility__'] = undefined
      e['__dodge:pre-dr__'] = undefined
      e['__dodge__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+primary:rating__'] = 0
    }
  })
  delete e['+str_agi:rating']
  Object.defineProperty(e, '+str_agi:rating', {
    get: function() {
      if (e['__+str_agi:rating__'] === undefined) {
        e['__+str_agi:rating__'] = 0
      }
      return e['__+str_agi:rating__']
    },
    set: function(v) {
      e['__agility__'] = undefined
      e['__dodge:pre-dr__'] = undefined
      e['__dodge__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+str_agi:rating__'] = 0
    }
  })
  delete e['+agi_int:rating']
  Object.defineProperty(e, '+agi_int:rating', {
    get: function() {
      if (e['__+agi_int:rating__'] === undefined) {
        e['__+agi_int:rating__'] = 0
      }
      return e['__+agi_int:rating__']
    },
    set: function(v) {
      e['__agility__'] = undefined
      e['__dodge:pre-dr__'] = undefined
      e['__dodge__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+agi_int:rating__'] = 0
    }
  })
  delete e['+agi:rating']
  Object.defineProperty(e, '+agi:rating', {
    get: function() {
      if (e['__+agi:rating__'] === undefined) {
        e['__+agi:rating__'] = 0
      }
      return e['__+agi:rating__']
    },
    set: function(v) {
      e['__agility__'] = undefined
      e['__dodge:pre-dr__'] = undefined
      e['__dodge__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+agi:rating__'] = 0
    }
  })
  delete e['agility']
  calc['agility'] = function(e) {
    return e['agi:base'] + e['+primary:rating'] + e['+str_agi:rating'] + e['+agi_int:rating'] + e['+agi:rating']
  }
  Object.defineProperty(e, 'agility', {
    get: function() {
      if (e['__agility__'] === undefined) {
        e['__agility__'] = (calc['agility'] as ICalcFunc)(e)
      }
      return e['__agility__']
    },
    set: function(v) {
      console.error('Unable to set attribute agility')
    }
  })
  delete e['stam:base']
  Object.defineProperty(e, 'stam:base', {
    get: function() {
      if (e['__stam:base__'] === undefined) {
        e['__stam:base__'] = 6259
      }
      return e['__stam:base__']
    },
    set: function(v) {
      e['__stamina__'] = undefined
      e['__maxHealth:base__'] = undefined
      e['__maxHealth__'] = undefined
      e['__stam:base__'] = 6259
    }
  })
  delete e['+stam:rating']
  Object.defineProperty(e, '+stam:rating', {
    get: function() {
      if (e['__+stam:rating__'] === undefined) {
        e['__+stam:rating__'] = 0
      }
      return e['__+stam:rating__']
    },
    set: function(v) {
      e['__stamina__'] = undefined
      e['__maxHealth:base__'] = undefined
      e['__maxHealth__'] = undefined
      e['__+stam:rating__'] = 0
    }
  })
  delete e['*stam:rating']
  Object.defineProperty(e, '*stam:rating', {
    get: function() {
      if (e['__*stam:rating__'] === undefined) {
        e['__*stam:rating__'] = 1
      }
      return e['__*stam:rating__']
    },
    set: function(v) {
      e['__stamina__'] = undefined
      e['__maxHealth:base__'] = undefined
      e['__maxHealth__'] = undefined
      e['__*stam:rating__'] = 1
    }
  })
  delete e['stamina']
  calc['stamina'] = function(e) {
    return Math.round((e['stam:base'] + e['+stam:rating']) * e['*stam:rating'])
  }
  Object.defineProperty(e, 'stamina', {
    get: function() {
      if (e['__stamina__'] === undefined) {
        e['__stamina__'] = (calc['stamina'] as ICalcFunc)(e)
      }
      return e['__stamina__']
    },
    set: function(v) {
      console.error('Unable to set attribute stamina')
    }
  })
  delete e['+maxHealth']
  Object.defineProperty(e, '+maxHealth', {
    get: function() {
      if (e['__+maxHealth__'] === undefined) {
        e['__+maxHealth__'] = 0
      }
      return e['__+maxHealth__']
    },
    set: function(v) {
      e['__maxHealth__'] = undefined
      e['__+maxHealth__'] = 0
    }
  })
  delete e['*maxHealth']
  Object.defineProperty(e, '*maxHealth', {
    get: function() {
      if (e['__*maxHealth__'] === undefined) {
        e['__*maxHealth__'] = 1
      }
      return e['__*maxHealth__']
    },
    set: function(v) {
      e['__maxHealth__'] = undefined
      e['__*maxHealth__'] = 1
    }
  })
  delete e['stamina:rating:conversion']
  Object.defineProperty(e, 'stamina:rating:conversion', {
    get: function() {
      if (e['__stamina:rating:conversion__'] === undefined) {
        e['__stamina:rating:conversion__'] = 60
      }
      return e['__stamina:rating:conversion__']
    },
    set: function(v) {
      e['__maxHealth:base__'] = undefined
      e['__maxHealth__'] = undefined
      e['__stamina:rating:conversion__'] = 60
    }
  })
  delete e['maxHealth:base']
  calc['maxHealth:base'] = function(e) {
    return e['stamina:rating:conversion'] * e['stamina']
  }
  Object.defineProperty(e, 'maxHealth:base', {
    get: function() {
      if (e['__maxHealth:base__'] === undefined) {
        e['__maxHealth:base__'] = (calc['maxHealth:base'] as ICalcFunc)(e)
      }
      return e['__maxHealth:base__']
    },
    set: function(v) {
      console.error('Unable to set attribute maxHealth:base')
    }
  })
  delete e['maxHealth']
  calc['maxHealth'] = function(e) {
    //TODO: Fix this magic number
    let m = Math.round((e['maxHealth:base'] + e['+maxHealth']) * e['*maxHealth'])
    return m >= 1 ? m : 1
  }
  Object.defineProperty(e, 'maxHealth', {
    get: function() {
      if (e['__maxHealth__'] === undefined) {
        e['__maxHealth__'] = (calc['maxHealth'] as ICalcFunc)(e)
      }
      return e['__maxHealth__']
    },
    set: function(v) {
      console.error('Unable to set attribute maxHealth')
    }
  })
  delete e['+haste:rating']
  Object.defineProperty(e, '+haste:rating', {
    get: function() {
      if (e['__+haste:rating__'] === undefined) {
        e['__+haste:rating__'] = 0
      }
      return e['__+haste:rating__']
    },
    set: function(v) {
      e['__haste__'] = undefined
      e['__gcd:time__'] = undefined
      e['__spell:recharge-rate:hasted__'] = undefined
      e['__+haste:rating__'] = 0
    }
  })
  delete e['*haste:rating']
  Object.defineProperty(e, '*haste:rating', {
    get: function() {
      if (e['__*haste:rating__'] === undefined) {
        e['__*haste:rating__'] = 1
      }
      return e['__*haste:rating__']
    },
    set: function(v) {
      e['__haste__'] = undefined
      e['__gcd:time__'] = undefined
      e['__spell:recharge-rate:hasted__'] = undefined
      e['__*haste:rating__'] = 1
    }
  })
  delete e['+haste']
  Object.defineProperty(e, '+haste', {
    get: function() {
      if (e['__+haste__'] === undefined) {
        e['__+haste__'] = 0
      }
      return e['__+haste__']
    },
    set: function(v) {
      e['__haste__'] = undefined
      e['__gcd:time__'] = undefined
      e['__spell:recharge-rate:hasted__'] = undefined
      e['__+haste__'] = 0
    }
  })
  delete e['haste:rating:conversion']
  Object.defineProperty(e, 'haste:rating:conversion', {
    get: function() {
      if (e['__haste:rating:conversion__'] === undefined) {
        e['__haste:rating:conversion__'] = 37500
      }
      return e['__haste:rating:conversion__']
    },
    set: function(v) {
      e['__haste__'] = undefined
      e['__gcd:time__'] = undefined
      e['__spell:recharge-rate:hasted__'] = undefined
      e['__haste:rating:conversion__'] = 37500
    }
  })
  delete e['haste']
  calc['haste'] = function(e) {
    return e['+haste'] + e['+haste:rating'] * e['*haste:rating'] / e['haste:rating:conversion']
  }
  Object.defineProperty(e, 'haste', {
    get: function() {
      if (e['__haste__'] === undefined) {
        e['__haste__'] = (calc['haste'] as ICalcFunc)(e)
      }
      return e['__haste__']
    },
    set: function(v) {
      console.error('Unable to set attribute haste')
    }
  })
  delete e['+crit:rating']
  Object.defineProperty(e, '+crit:rating', {
    get: function() {
      if (e['__+crit:rating__'] === undefined) {
        e['__+crit:rating__'] = 0
      }
      return e['__+crit:rating__']
    },
    set: function(v) {
      e['__crit:rating__'] = undefined
      e['__crit__'] = undefined
      e['__parry:pre-dr__'] = undefined
      e['__parry__'] = undefined
      e['__+crit:rating__'] = 0
    }
  })
  delete e['*crit:rating']
  Object.defineProperty(e, '*crit:rating', {
    get: function() {
      if (e['__*crit:rating__'] === undefined) {
        e['__*crit:rating__'] = 1
      }
      return e['__*crit:rating__']
    },
    set: function(v) {
      e['__crit:rating__'] = undefined
      e['__crit__'] = undefined
      e['__parry:pre-dr__'] = undefined
      e['__parry__'] = undefined
      e['__*crit:rating__'] = 1
    }
  })
  delete e['crit:rating:conversion']
  Object.defineProperty(e, 'crit:rating:conversion', {
    get: function() {
      if (e['__crit:rating:conversion__'] === undefined) {
        e['__crit:rating:conversion__'] = 40000
      }
      return e['__crit:rating:conversion__']
    },
    set: function(v) {
      e['__crit__'] = undefined
      e['__crit:rating:conversion__'] = 40000
    }
  })
  delete e['crit:rating']
  calc['crit:rating'] = function(e) {
    return e['+crit:rating'] * e['*crit:rating']
  }
  Object.defineProperty(e, 'crit:rating', {
    get: function() {
      if (e['__crit:rating__'] === undefined) {
        e['__crit:rating__'] = (calc['crit:rating'] as ICalcFunc)(e)
      }
      return e['__crit:rating__']
    },
    set: function(v) {
      console.error('Unable to set attribute crit:rating')
    }
  })
  delete e['+crit']
  Object.defineProperty(e, '+crit', {
    get: function() {
      if (e['__+crit__'] === undefined) {
        e['__+crit__'] = 0
      }
      return e['__+crit__']
    },
    set: function(v) {
      e['__crit__'] = undefined
      e['__+crit__'] = 0
    }
  })
  delete e['crit']
  calc['crit'] = function(e) {
    //TODO: 0.05 shouldn't be here, it should be attached to the DH
    return 0.05 + e['+crit'] + e['crit:rating'] / e['crit:rating:conversion']
  }
  Object.defineProperty(e, 'crit', {
    get: function() {
      if (e['__crit__'] === undefined) {
        e['__crit__'] = (calc['crit'] as ICalcFunc)(e)
      }
      return e['__crit__']
    },
    set: function(v) {
      console.error('Unable to set attribute crit')
    }
  })
  delete e['parry:rating:conversion']
  Object.defineProperty(e, 'parry:rating:conversion', {
    get: function() {
      if (e['__parry:rating:conversion__'] === undefined) {
        e['__parry:rating:conversion__'] = 51500
      }
      return e['__parry:rating:conversion__']
    },
    set: function(v) {
      e['__parry:pre-dr__'] = undefined
      e['__parry__'] = undefined
      e['__parry:rating:conversion__'] = 51500
    }
  })
  delete e['parry:base']
  Object.defineProperty(e, 'parry:base', {
    get: function() {
      if (e['__parry:base__'] === undefined) {
        e['__parry:base__'] = 0.03
      }
      return e['__parry:base__']
    },
    set: function(v) {
      e['__parry__'] = undefined
      e['__parry:base__'] = 0.03
    }
  })
  delete e['parry:pre-dr']
  calc['parry:pre-dr'] = function(e) {
    //TODO: Only calculate for tanks that get this perk.
    return e['crit:rating'] / e['parry:rating:conversion']
  }
  Object.defineProperty(e, 'parry:pre-dr', {
    get: function() {
      if (e['__parry:pre-dr__'] === undefined) {
        e['__parry:pre-dr__'] = (calc['parry:pre-dr'] as ICalcFunc)(e)
      }
      return e['__parry:pre-dr__']
    },
    set: function(v) {
      console.error('Unable to set attribute parry:pre-dr')
    }
  })
  delete e['+parry']
  Object.defineProperty(e, '+parry', {
    get: function() {
      if (e['__+parry__'] === undefined) {
        e['__+parry__'] = 0
      }
      return e['__+parry__']
    },
    set: function(v) {
      e['__parry__'] = undefined
      e['__+parry__'] = 0
    }
  })
  delete e['parry']
  calc['parry'] = function(e) {
    //TODO: Fix this Magic Number
    //TODO: Fix this Magic Number
    return e['parry:base'] + e['+parry'] + e['parry:pre-dr'] / (e['parry:pre-dr'] * 3.15 + 1 / 0.94)
  }
  Object.defineProperty(e, 'parry', {
    get: function() {
      if (e['__parry__'] === undefined) {
        e['__parry__'] = (calc['parry'] as ICalcFunc)(e)
      }
      return e['__parry__']
    },
    set: function(v) {
      console.error('Unable to set attribute parry')
    }
  })
  delete e['dodge:base']
  Object.defineProperty(e, 'dodge:base', {
    get: function() {
      if (e['__dodge:base__'] === undefined) {
        e['__dodge:base__'] = 0.03
      }
      return e['__dodge:base__']
    },
    set: function(v) {
      e['__dodge__'] = undefined
      e['__dodge:base__'] = 0.03
    }
  })
  delete e['+dodge']
  Object.defineProperty(e, '+dodge', {
    get: function() {
      if (e['__+dodge__'] === undefined) {
        e['__+dodge__'] = 0
      }
      return e['__+dodge__']
    },
    set: function(v) {
      e['__dodge__'] = undefined
      e['__+dodge__'] = 0
    }
  })
  delete e['dodge:rating:conversion']
  Object.defineProperty(e, 'dodge:rating:conversion', {
    get: function() {
      if (e['__dodge:rating:conversion__'] === undefined) {
        e['__dodge:rating:conversion__'] = 131102
      }
      return e['__dodge:rating:conversion__']
    },
    set: function(v) {
      e['__dodge:pre-dr__'] = undefined
      e['__dodge__'] = undefined
      e['__dodge:rating:conversion__'] = 131102
    }
  })
  delete e['dodge:pre-dr']
  calc['dodge:pre-dr'] = function(e) {
    return (e['agility'] - e['agi:base']) / e['dodge:rating:conversion']
  }
  Object.defineProperty(e, 'dodge:pre-dr', {
    get: function() {
      if (e['__dodge:pre-dr__'] === undefined) {
        e['__dodge:pre-dr__'] = (calc['dodge:pre-dr'] as ICalcFunc)(e)
      }
      return e['__dodge:pre-dr__']
    },
    set: function(v) {
      console.error('Unable to set attribute dodge:pre-dr')
    }
  })
  delete e['dodge']
  calc['dodge'] = function(e) {
    return e['dodge:base'] + e['+dodge'] + e['dodge:pre-dr'] / (e['dodge:pre-dr'] * 3.15 + 1 / 0.94)
  }
  Object.defineProperty(e, 'dodge', {
    get: function() {
      if (e['__dodge__'] === undefined) {
        e['__dodge__'] = (calc['dodge'] as ICalcFunc)(e)
      }
      return e['__dodge__']
    },
    set: function(v) {
      console.error('Unable to set attribute dodge')
    }
  })
  delete e['+vers:rating']
  Object.defineProperty(e, '+vers:rating', {
    get: function() {
      if (e['__+vers:rating__'] === undefined) {
        e['__+vers:rating__'] = 0
      }
      return e['__+vers:rating__']
    },
    set: function(v) {
      e['__vers:damage-done__'] = undefined
      e['__vers:damage-taken__'] = undefined
      e['__vers:healing-done__'] = undefined
      e['__damage__'] = undefined
      e['__damage:physical__'] = undefined
      e['__damage:fire__'] = undefined
      e['__+vers:rating__'] = 0
    }
  })
  delete e['vers:rating:conversion:dd']
  Object.defineProperty(e, 'vers:rating:conversion:dd', {
    get: function() {
      if (e['__vers:rating:conversion:dd__'] === undefined) {
        e['__vers:rating:conversion:dd__'] = 47500
      }
      return e['__vers:rating:conversion:dd__']
    },
    set: function(v) {
      e['__vers:damage-done__'] = undefined
      e['__damage__'] = undefined
      e['__damage:physical__'] = undefined
      e['__damage:fire__'] = undefined
      e['__vers:rating:conversion:dd__'] = 47500
    }
  })
  delete e['vers:damage-done']
  calc['vers:damage-done'] = function(e) {
    return e['+vers:rating'] / e['vers:rating:conversion:dd']
  }
  Object.defineProperty(e, 'vers:damage-done', {
    get: function() {
      if (e['__vers:damage-done__'] === undefined) {
        e['__vers:damage-done__'] = (calc['vers:damage-done'] as ICalcFunc)(e)
      }
      return e['__vers:damage-done__']
    },
    set: function(v) {
      console.error('Unable to set attribute vers:damage-done')
    }
  })
  delete e['vers:rating:conversion:dt']
  Object.defineProperty(e, 'vers:rating:conversion:dt', {
    get: function() {
      if (e['__vers:rating:conversion:dt__'] === undefined) {
        e['__vers:rating:conversion:dt__'] = 95000
      }
      return e['__vers:rating:conversion:dt__']
    },
    set: function(v) {
      e['__vers:damage-taken__'] = undefined
      e['__vers:rating:conversion:dt__'] = 95000
    }
  })
  delete e['vers:damage-taken']
  calc['vers:damage-taken'] = function(e) {
    return e['+vers:rating'] / e['vers:rating:conversion:dt']
  }
  Object.defineProperty(e, 'vers:damage-taken', {
    get: function() {
      if (e['__vers:damage-taken__'] === undefined) {
        e['__vers:damage-taken__'] = (calc['vers:damage-taken'] as ICalcFunc)(e)
      }
      return e['__vers:damage-taken__']
    },
    set: function(v) {
      console.error('Unable to set attribute vers:damage-taken')
    }
  })
  delete e['vers:rating:conversion:hd']
  Object.defineProperty(e, 'vers:rating:conversion:hd', {
    get: function() {
      if (e['__vers:rating:conversion:hd__'] === undefined) {
        e['__vers:rating:conversion:hd__'] = 47500
      }
      return e['__vers:rating:conversion:hd__']
    },
    set: function(v) {
      e['__vers:healing-done__'] = undefined
      e['__vers:rating:conversion:hd__'] = 47500
    }
  })
  delete e['vers:healing-done']
  calc['vers:healing-done'] = function(e) {
    return e['+vers:rating'] / e['vers:rating:conversion:hd']
  }
  Object.defineProperty(e, 'vers:healing-done', {
    get: function() {
      if (e['__vers:healing-done__'] === undefined) {
        e['__vers:healing-done__'] = (calc['vers:healing-done'] as ICalcFunc)(e)
      }
      return e['__vers:healing-done__']
    },
    set: function(v) {
      console.error('Unable to set attribute vers:healing-done')
    }
  })
  delete e['*damage']
  Object.defineProperty(e, '*damage', {
    get: function() {
      if (e['__*damage__'] === undefined) {
        e['__*damage__'] = 1
      }
      return e['__*damage__']
    },
    set: function(v) {
      e['__damage__'] = undefined
      e['__damage:physical__'] = undefined
      e['__damage:fire__'] = undefined
      e['__*damage__'] = 1
    }
  })
  delete e['damage']
  calc['damage'] = function(e) {
    return e['*damage'] * (1 + e['vers:damage-done'])
  }
  Object.defineProperty(e, 'damage', {
    get: function() {
      if (e['__damage__'] === undefined) {
        e['__damage__'] = (calc['damage'] as ICalcFunc)(e)
      }
      return e['__damage__']
    },
    set: function(v) {
      console.error('Unable to set attribute damage')
    }
  })
  delete e['*damage:physical']
  Object.defineProperty(e, '*damage:physical', {
    get: function() {
      if (e['__*damage:physical__'] === undefined) {
        e['__*damage:physical__'] = 1
      }
      return e['__*damage:physical__']
    },
    set: function(v) {
      e['__damage:physical__'] = undefined
      e['__*damage:physical__'] = 1
    }
  })
  delete e['damage:physical']
  calc['damage:physical'] = function(e) {
    return e['damage'] * e['*damage:physical']
  }
  Object.defineProperty(e, 'damage:physical', {
    get: function() {
      if (e['__damage:physical__'] === undefined) {
        e['__damage:physical__'] = (calc['damage:physical'] as ICalcFunc)(e)
      }
      return e['__damage:physical__']
    },
    set: function(v) {
      console.error('Unable to set attribute damage:physical')
    }
  })
  delete e['*damage:fire']
  Object.defineProperty(e, '*damage:fire', {
    get: function() {
      if (e['__*damage:fire__'] === undefined) {
        e['__*damage:fire__'] = 1
      }
      return e['__*damage:fire__']
    },
    set: function(v) {
      e['__damage:fire__'] = undefined
      e['__*damage:fire__'] = 1
    }
  })
  delete e['damage:fire']
  calc['damage:fire'] = function(e) {
    return e['damage'] * e['*damage:fire']
  }
  Object.defineProperty(e, 'damage:fire', {
    get: function() {
      if (e['__damage:fire__'] === undefined) {
        e['__damage:fire__'] = (calc['damage:fire'] as ICalcFunc)(e)
      }
      return e['__damage:fire__']
    },
    set: function(v) {
      console.error('Unable to set attribute damage:fire')
    }
  })
  delete e['+mastery:rating']
  Object.defineProperty(e, '+mastery:rating', {
    get: function() {
      if (e['__+mastery:rating__'] === undefined) {
        e['__+mastery:rating__'] = 0
      }
      return e['__+mastery:rating__']
    },
    set: function(v) {
      e['__mastery:standard__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+mastery:rating__'] = 0
    }
  })
  delete e['mastery:rating:conversion:standard']
  Object.defineProperty(e, 'mastery:rating:conversion:standard', {
    get: function() {
      if (e['__mastery:rating:conversion:standard__'] === undefined) {
        e['__mastery:rating:conversion:standard__'] = 40000
      }
      return e['__mastery:rating:conversion:standard__']
    },
    set: function(v) {
      e['__mastery:standard__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__mastery:rating:conversion:standard__'] = 40000
    }
  })
  delete e['mastery:standard:base']
  Object.defineProperty(e, 'mastery:standard:base', {
    get: function() {
      if (e['__mastery:standard:base__'] === undefined) {
        e['__mastery:standard:base__'] = 0.08
      }
      return e['__mastery:standard:base__']
    },
    set: function(v) {
      e['__mastery:standard__'] = undefined
      e['__attackpower__'] = undefined
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__mastery:standard:base__'] = 0.08
    }
  })
  delete e['mastery:standard']
  calc['mastery:standard'] = function(e) {
    return e['mastery:standard:base'] + e['+mastery:rating'] / e['mastery:rating:conversion:standard']
  }
  Object.defineProperty(e, 'mastery:standard', {
    get: function() {
      if (e['__mastery:standard__'] === undefined) {
        e['__mastery:standard__'] = (calc['mastery:standard'] as ICalcFunc)(e)
      }
      return e['__mastery:standard__']
    },
    set: function(v) {
      console.error('Unable to set attribute mastery:standard')
    }
  })
  delete e['attackpower']
  calc['attackpower'] = function(e) {
    //TODO: Base this off of spec-specific str/agi/hpally/mw
    return (1 + e['mastery:standard']) * e['agility']
  }
  Object.defineProperty(e, 'attackpower', {
    get: function() {
      if (e['__attackpower__'] === undefined) {
        e['__attackpower__'] = (calc['attackpower'] as ICalcFunc)(e)
      }
      return e['__attackpower__']
    },
    set: function(v) {
      console.error('Unable to set attribute attackpower')
    }
  })
  delete e['+mainHand:damage:min']
  Object.defineProperty(e, '+mainHand:damage:min', {
    get: function() {
      if (e['__+mainHand:damage:min__'] === undefined) {
        e['__+mainHand:damage:min__'] = 0
      }
      return e['__+mainHand:damage:min__']
    },
    set: function(v) {
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__+mainHand:damage:min__'] = 0
    }
  })
  delete e['+mainHand:damage:max']
  Object.defineProperty(e, '+mainHand:damage:max', {
    get: function() {
      if (e['__+mainHand:damage:max__'] === undefined) {
        e['__+mainHand:damage:max__'] = 0
      }
      return e['__+mainHand:damage:max__']
    },
    set: function(v) {
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__+mainHand:damage:max__'] = 0
    }
  })
  delete e['+mainHand:speed']
  Object.defineProperty(e, '+mainHand:speed', {
    get: function() {
      if (e['__+mainHand:speed__'] === undefined) {
        e['__+mainHand:speed__'] = 0
      }
      return e['__+mainHand:speed__']
    },
    set: function(v) {
      e['__mainHand:damage:dps__'] = undefined
      e['__+mainHand:speed__'] = 0
    }
  })
  delete e['mainHand:speed:normalized']
  Object.defineProperty(e, 'mainHand:speed:normalized', {
    get: function() {
      if (e['__mainHand:speed:normalized__'] === undefined) {
        e['__mainHand:speed:normalized__'] = 2.4
      }
      return e['__mainHand:speed:normalized__']
    },
    set: function(v) {
      e['__mainHand:damage:normalized__'] = undefined
      e['__mainHand:damage:dps__'] = undefined
      e['__mainHand:speed:normalized__'] = 2.4
    }
  })
  delete e['mainHand:damage:normalized']
  calc['mainHand:damage:normalized'] = function(e) {
    return Math.round((e['+mainHand:damage:min'] + e['+mainHand:damage:max']) / 2 + e['attackpower'] * e['mainHand:speed:normalized'] / 3.5)
  }
  Object.defineProperty(e, 'mainHand:damage:normalized', {
    get: function() {
      if (e['__mainHand:damage:normalized__'] === undefined) {
        e['__mainHand:damage:normalized__'] = (calc['mainHand:damage:normalized'] as ICalcFunc)(e)
      }
      return e['__mainHand:damage:normalized__']
    },
    set: function(v) {
      console.error('Unable to set attribute mainHand:damage:normalized')
    }
  })
  delete e['mainHand:damage:dps']
  calc['mainHand:damage:dps'] = function(e) {
    return e['+mainHand:speed'] == 0 ? 0 : e['mainHand:damage:normalized'] / e['+mainHand:speed']
  }
  Object.defineProperty(e, 'mainHand:damage:dps', {
    get: function() {
      if (e['__mainHand:damage:dps__'] === undefined) {
        e['__mainHand:damage:dps__'] = (calc['mainHand:damage:dps'] as ICalcFunc)(e)
      }
      return e['__mainHand:damage:dps__']
    },
    set: function(v) {
      console.error('Unable to set attribute mainHand:damage:dps')
    }
  })
  delete e['+offHand:damage:min']
  Object.defineProperty(e, '+offHand:damage:min', {
    get: function() {
      if (e['__+offHand:damage:min__'] === undefined) {
        e['__+offHand:damage:min__'] = 0
      }
      return e['__+offHand:damage:min__']
    },
    set: function(v) {
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+offHand:damage:min__'] = 0
    }
  })
  delete e['+offHand:damage:max']
  Object.defineProperty(e, '+offHand:damage:max', {
    get: function() {
      if (e['__+offHand:damage:max__'] === undefined) {
        e['__+offHand:damage:max__'] = 0
      }
      return e['__+offHand:damage:max__']
    },
    set: function(v) {
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__+offHand:damage:max__'] = 0
    }
  })
  delete e['+offHand:speed']
  Object.defineProperty(e, '+offHand:speed', {
    get: function() {
      if (e['__+offHand:speed__'] === undefined) {
        e['__+offHand:speed__'] = 0
      }
      return e['__+offHand:speed__']
    },
    set: function(v) {
      e['__offHand:damage:dps__'] = undefined
      e['__+offHand:speed__'] = 0
    }
  })
  delete e['offHand:speed:normalized']
  Object.defineProperty(e, 'offHand:speed:normalized', {
    get: function() {
      if (e['__offHand:speed:normalized__'] === undefined) {
        e['__offHand:speed:normalized__'] = 2.4
      }
      return e['__offHand:speed:normalized__']
    },
    set: function(v) {
      e['__offHand:damage:normalized__'] = undefined
      e['__offHand:damage:dps__'] = undefined
      e['__offHand:speed:normalized__'] = 2.4
    }
  })
  delete e['offHand:damage:normalized']
  calc['offHand:damage:normalized'] = function(e) {
    return 0.5 * ((e['+offHand:damage:min'] + e['+offHand:damage:max']) / 2 + e['offHand:speed:normalized'] * (1 / 3.5) * e['attackpower'])
  }
  Object.defineProperty(e, 'offHand:damage:normalized', {
    get: function() {
      if (e['__offHand:damage:normalized__'] === undefined) {
        e['__offHand:damage:normalized__'] = (calc['offHand:damage:normalized'] as ICalcFunc)(e)
      }
      return e['__offHand:damage:normalized__']
    },
    set: function(v) {
      console.error('Unable to set attribute offHand:damage:normalized')
    }
  })
  delete e['offHand:damage:dps']
  calc['offHand:damage:dps'] = function(e) {
    return e['+offHand:speed'] == 0 ? 0 : e['offHand:damage:normalized'] / e['+offHand:speed']
  }
  Object.defineProperty(e, 'offHand:damage:dps', {
    get: function() {
      if (e['__offHand:damage:dps__'] === undefined) {
        e['__offHand:damage:dps__'] = (calc['offHand:damage:dps'] as ICalcFunc)(e)
      }
      return e['__offHand:damage:dps__']
    },
    set: function(v) {
      console.error('Unable to set attribute offHand:damage:dps')
    }
  })
  delete e['+armor:rating']
  Object.defineProperty(e, '+armor:rating', {
    get: function() {
      if (e['__+armor:rating__'] === undefined) {
        e['__+armor:rating__'] = 0
      }
      return e['__+armor:rating__']
    },
    set: function(v) {
      e['__armor:rating__'] = undefined
      e['__armor__'] = undefined
      e['__+armor:rating__'] = 0
    }
  })
  delete e['*armor:rating']
  Object.defineProperty(e, '*armor:rating', {
    get: function() {
      if (e['__*armor:rating__'] === undefined) {
        e['__*armor:rating__'] = 1
      }
      return e['__*armor:rating__']
    },
    set: function(v) {
      e['__armor:rating__'] = undefined
      e['__armor__'] = undefined
      e['__*armor:rating__'] = 1
    }
  })
  delete e['armor:rating']
  calc['armor:rating'] = function(e) {
    return Math.round(e['+armor:rating'] * e['*armor:rating'])
  }
  Object.defineProperty(e, 'armor:rating', {
    get: function() {
      if (e['__armor:rating__'] === undefined) {
        e['__armor:rating__'] = (calc['armor:rating'] as ICalcFunc)(e)
      }
      return e['__armor:rating__']
    },
    set: function(v) {
      console.error('Unable to set attribute armor:rating')
    }
  })
  delete e['armor:k']
  Object.defineProperty(e, 'armor:k', {
    get: function() {
      if (e['__armor:k__'] === undefined) {
        e['__armor:k__'] = 7390
      }
      return e['__armor:k__']
    },
    set: function(v) {
      e['__armor__'] = undefined
      e['__armor:k__'] = 7390
    }
  })
  delete e['armor']
  calc['armor'] = function(e) {
    //mult = 1 / (1 + x / k)
    //TODO: Fix Magic Number
    return 1 / (1 + e['armor:rating'] / e['armor:k'])
  }
  Object.defineProperty(e, 'armor', {
    get: function() {
      if (e['__armor__'] === undefined) {
        e['__armor__'] = (calc['armor'] as ICalcFunc)(e)
      }
      return e['__armor__']
    },
    set: function(v) {
      console.error('Unable to set attribute armor')
    }
  })
  delete e['*dr:all']
  Object.defineProperty(e, '*dr:all', {
    get: function() {
      if (e['__*dr:all__'] === undefined) {
        e['__*dr:all__'] = 1
      }
      return e['__*dr:all__']
    },
    set: function(v) {
      e['__*dr:all__'] = 1
    }
  })
  delete e['*dr:physical']
  Object.defineProperty(e, '*dr:physical', {
    get: function() {
      if (e['__*dr:physical__'] === undefined) {
        e['__*dr:physical__'] = 1
      }
      return e['__*dr:physical__']
    },
    set: function(v) {
      e['__*dr:physical__'] = 1
    }
  })
  delete e['*dr:magical']
  Object.defineProperty(e, '*dr:magical', {
    get: function() {
      if (e['__*dr:magical__'] === undefined) {
        e['__*dr:magical__'] = 1
      }
      return e['__*dr:magical__']
    },
    set: function(v) {
      e['__*dr:magical__'] = 1
    }
  })
  delete e['+threat']
  Object.defineProperty(e, '+threat', {
    get: function() {
      if (e['__+threat__'] === undefined) {
        e['__+threat__'] = 1
      }
      return e['__+threat__']
    },
    set: function(v) {
      e['__+threat__'] = 1
    }
  })
  delete e['gcd:base']
  Object.defineProperty(e, 'gcd:base', {
    get: function() {
      if (e['__gcd:base__'] === undefined) {
        e['__gcd:base__'] = 1500
      }
      return e['__gcd:base__']
    },
    set: function(v) {
      e['__gcd:time__'] = undefined
      e['__gcd:base__'] = 1500
    }
  })
  delete e['gcd:min']
  Object.defineProperty(e, 'gcd:min', {
    get: function() {
      if (e['__gcd:min__'] === undefined) {
        e['__gcd:min__'] = 1000
      }
      return e['__gcd:min__']
    },
    set: function(v) {
      e['__gcd:time__'] = undefined
      e['__gcd:min__'] = 1000
    }
  })
  delete e['gcd:time']
  calc['gcd:time'] = function(e) {
    return Math.max(e['gcd:min'], e['gcd:base'] / (1.0 + e['haste']))
  }
  Object.defineProperty(e, 'gcd:time', {
    get: function() {
      if (e['__gcd:time__'] === undefined) {
        e['__gcd:time__'] = (calc['gcd:time'] as ICalcFunc)(e)
      }
      return e['__gcd:time__']
    },
    set: function(v) {
      console.error('Unable to set attribute gcd:time')
    }
  })
  delete e['gcd:remaining']
  Object.defineProperty(e, 'gcd:remaining', {
    get: function() {
      if (e['__gcd:remaining__'] === undefined) {
        e['__gcd:remaining__'] = 0
      }
      return e['__gcd:remaining__']
    },
    set: function(v) {
      e['__gcd:remaining__'] = 0
    }
  })
  delete e['*spell:recharge-rate:base']
  Object.defineProperty(e, '*spell:recharge-rate:base', {
    get: function() {
      if (e['__*spell:recharge-rate:base__'] === undefined) {
        e['__*spell:recharge-rate:base__'] = 0.04
      }
      return e['__*spell:recharge-rate:base__']
    },
    set: function(v) {
      e['__spell:recharge-rate:hasted__'] = undefined
      e['__spell:recharge-rate:unhasted__'] = undefined
      e['__*spell:recharge-rate:base__'] = 0.04
    }
  })
  delete e['spell:recharge-rate:hasted']
  calc['spell:recharge-rate:hasted'] = function(e) {
    return e['*spell:recharge-rate:base'] * (1 + e['haste'])
  }
  Object.defineProperty(e, 'spell:recharge-rate:hasted', {
    get: function() {
      if (e['__spell:recharge-rate:hasted__'] === undefined) {
        e['__spell:recharge-rate:hasted__'] = (calc['spell:recharge-rate:hasted'] as ICalcFunc)(e)
      }
      return e['__spell:recharge-rate:hasted__']
    },
    set: function(v) {
      console.error('Unable to set attribute spell:recharge-rate:hasted')
    }
  })
  delete e['spell:recharge-rate:unhasted']
  calc['spell:recharge-rate:unhasted'] = function(e) {
    return e['*spell:recharge-rate:base']
  }
  Object.defineProperty(e, 'spell:recharge-rate:unhasted', {
    get: function() {
      if (e['__spell:recharge-rate:unhasted__'] === undefined) {
        e['__spell:recharge-rate:unhasted__'] = (calc['spell:recharge-rate:unhasted'] as ICalcFunc)(e)
      }
      return e['__spell:recharge-rate:unhasted__']
    },
    set: function(v) {
      console.error('Unable to set attribute spell:recharge-rate:unhasted')
    }
  })
  return e
}
