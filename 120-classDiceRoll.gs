/**
 * Class for handling dice rolls (with numerical dice).
 */
class DiceRoll {
  constructor(quantity = false, numberOfSides = false, customSides = false) {
    // Use default values, if called for.
    if (!quantity)
      quantity = global.defaults.diceRoll.quantity;
    if (!numberOfSides)
      numberOfSides = global.defaults.diceRoll.numberOfSides;
    if (!customSides && global.defaults.diceRoll.customSides)
      customSides = global.defaults.diceRoll.customSides;
    this.quantity = quantity;
    this.numberOfSides = numberOfSides;
    this.customSides = customSides;

    // Roll the dice
    this.result = [];

    for (let i = 0; i < quantity; i++) {
      this.result.push(this.roll());
    }
  }

  /**
   * Rolls a single die.
   */
  roll() {
    if (this.customSides.length > 0)
      return selectRandom(this.customSides);
    else
      return Math.floor(Math.random()*this.numberOfSides + 1);
  }

  /**
   * Returns the sum of the rolled dice, plus any provided modifier.
   */
  sum(modifier = 0) {
    return this.result.reduce((a, b) => a + b) + modifier;
  }

  /**
   * Counts how many times 'value' occurs in the rolled dice.
   */
  countOccurances(value) {
    let occurances = 0;
    for (let d of this.result) {
      if (d == value)
        occurances++;
    }
    return occurances;
  }

  /**
   * Returns an array with the frequency for each result, starting on 1.
   * @TODO: Take custom sides better into consideration. There may be gaps and negative numbers.
   */
  getDistribution() {
    let max = this.numberOfSides;
    if (this.customSides) {
      max = Math.max(...this.customSides);
    }
    let counts = Array(max);
    counts.fill(0);
    for (let i of this.result) {
      if (i > threshold) {
        counts[i-1]++;
      }
    }
    return counts;
  }

  /**
   * Returns the highest number of equal dice with value above 'threshold'.
   */
  countEquals(threshold = 0) {
    let distribution = this.getDistribution();
    for (let i in distribution) {
      if (i <= threshold)
        distribution[i] = 0;
    }
    return Math.max(...distribution);
  }

  /**
   * Returns the longest straight found in the dice results, for example [2, 3, 4].
   * If several longest are found, the highest is returned.
   * @TODO: Take custom sides better into consideration. There may be gaps and negative numbers.
   */
  getLongestStraight() {
    let max = this.numberOfSides;
    if (this.customSides) {
      max = Math.max(...this.customSides);
    }
    let counts = [];
    for (let i = 0; i < max; i++) {
      counts.push([]);
    }

    // @TODO: Make this loop a bit more efficient.
    for (let i in counts) {
      let checkValue = parseInt(i) + 1;
      while(this.result.includes(checkValue)) {
        counts[i].push(checkValue);
        checkValue++;
      }
    }
    sortByProperty(counts, 'length', false);
    return counts[0];
  }

}