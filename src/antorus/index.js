let categories = {
  tank: { name: 'aggramar', ppm: 2.2, dur: 15 },
  healer: { name: 'amanthul', ppm: 2, dur: 14 },
  str: { name: 'khazgoroth', ppm: 2, dur: 12 },
  agi: { name: 'golganneth', ppm: 4, dur: 8 },
  int: { name: 'norgannon', ppm: 1.6, dur: 18 },
  other: { name: 'amanthul', ppm: 2, dur: 12 }
}

let sim = function(rc) {
  let players = []
  for (var k in rc) {
    for (let i = 0; i < rc[k]; i++) {
      players.push({
        role: k,
        lastproc: -100
      })
    }
  }
  let raidProcs = {
    tank: 0,
    healer: 0,
    str: 0,
    agi: 0,
    int: 0,
    other: 0
  }
  let uptime = 0
  let lastRaidProc = -16
  for (let t = 0; t < 300; t++) {
    players.forEach((p, i) => {
      let chance = 1
      if (Math.random() < chance * categories[p.role].ppm / 60) {
        raidProcs[p.role] = categories[p.role].dur + t
      }
    })
    if (t > lastRaidProc + 15) {
      let shouldProc = true
      for (var r in raidProcs) {
        if (raidProcs[r] < t) {
          shouldProc = false
          break
        }
      }
      if (shouldProc) {
        lastRaidProc = t
      }
    }
    if (lastRaidProc + 15 >= t) {
      uptime += 1
    }
  }
  return uptime
}
let batch = function(raidcomp) {
  let total = 0
  let count = 1000
  for (let i = 0; i < count; i++) {
    total += sim(raidcomp)
  }
  return total / count
}

let minDpsRole = 2
let maxDpsRole = 8

let maxFound = 0
let maxComp = {}
for (var str = minDpsRole; str <= maxDpsRole; str++) {
  for (var agi = minDpsRole; agi <= maxDpsRole; agi++) {
    for (var int = minDpsRole; int <= maxDpsRole; int++) {
      let other = 20 - str - agi - int - 2 - 4
      if (str <= 0 || agi <= 0 || int <= 0 || other <= 0) {
        continue
      }
      let raidcomp = {
        tank: 2,
        healer: 4,
        str: str,
        agi: agi,
        int: int,
        other: other
      }
      let b = batch(raidcomp)
      if (b > maxFound) {
        maxFound = b
        maxComp = raidcomp
      }
      if (b > 150) {
        console.log('new reasonable comp:')
        console.log(b)
        console.log(raidcomp)
      }
    }
  }
}
console.log('global max:')
console.log(maxFound)
console.log(maxComp)
