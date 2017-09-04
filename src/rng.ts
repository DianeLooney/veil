import { IWorld } from './world'

interface IRngSource {
  next(...outcomes: number[]): number
  reset(): void
}
export { IRngSource }

const deckOfCards = function(cards: number, goodCards: number) {
  let total: number = cards
  let good: number = goodCards
  let bad: number = cards - good
  return {
    next(...outcomes: number[]): number {
      if (good + bad <= 0) {
        this.reset()
      }
      let goodDrawn: boolean = (good + bad) * Math.random() <= good
      if (goodDrawn) {
        good--
        return 1
      } else {
        bad--
        return 0
      }
    },
    reset(): void {
      good = goodCards
      bad = total - good
    }
  }
}
export { deckOfCards }
const sequence = function(chances: number[]) {
  let i = 0
  return {
    next(bonusMult: number): number {
      if (i >= chances.length) {
        i = 0
      }
      let c = chances[i]
      if (bonusMult !== undefined && typeof bonusMult === 'number') {
        c *= bonusMult
      }
      if (Math.random() <= c) {
        i = 0
        return 1
      }
      i++
      return 0
    },
    reset(): void {
      i = 0
    }
  }
}
export { sequence }

const rppm = function(w: IWorld, rate: number) {
  let interval = rate * 60 * w._second
  let lastProc = -1000 * w._second
  return {
    next(): boolean {
      let chance = Math.min(15 * w._second, w.now - lastProc) / interval
      chance *= Math.max(1, 1 + ((w.now - lastProc) / interval - 1.5) * 3)
      let result = Math.random() <= chance
      if (result) {
        lastProc = w.now
      }
      return result
    },
    maxOut(): void {
      lastProc = -1000 * w._second
    },
    reset(): void {
      lastProc = w.now
    }
  }
}
export { rppm }
