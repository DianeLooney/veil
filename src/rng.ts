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
    next(): number {
      if (i >= chances.length) {
        i = 0
      }
      let c = chances[i]
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
