interface IRngSource {
  next(...outcomes: number[]): number
  reset(): void
}

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
