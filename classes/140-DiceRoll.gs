/**
 * Class for handling dice rolls (with numerical dice).
 */
class DiceRoll {
  constructor(quantity = false, numberOfSides = false, customSides = false) {
    let defaults = {
      quantity: 3,
      numberOfSides: 6,
      customSides: false,
    };
    if (global.defaults.diceRoll)
      Object.assign(defaults, global.defaults.diceRoll);

    // Use default values, if called for.
    if (!quantity)
      quantity = defaults.quantity;
    if (!numberOfSides)
      numberOfSides = defaults.numberOfSides;
    if (!customSides && defaults.customSides)
      customSides = defaults.customSides;
    this.quantity = quantity;
    this.numberOfSides = numberOfSides;
    this.customSides = customSides;

    // Roll the dice
    this.result = [];

    for (let i = 0; i < quantity; i++) {
      this.result.push(this.rollSingle());
    }
  }

  /**
   * Rolls a single die. Used internally.
   */
  rollSingle() {
    if (this.customSides.length > 0)
      return selectRandom(this.customSides);
    else
      return Math.floor(Math.random()*this.numberOfSides + 1);
  }

  /**
   * Treats die results as if only the n first dice are present, until
   * 'unlock' function is called.
   * @return The DiceRoll object.
   */
  restrict(n) {
    if (this.fullResult)
      throw('Tried to restrict number of dice to consider, but dice were already restricted.');
    this.fullResult = this.result;
    this.result = [];
    for (let i = 0; i < n; i++)
      this.result.push(this.fullResult[i]);
  }

  /**
   * Unlocks die result restrictions, locked by the 'restrict' function.
   * @return The DiceRoll object.
   */
  unlock() {
    if (!this.fullResult)
      return this;
    this.result = this.fullResult;
    this.fullResult = [];
    return this;
  }

  /**
   * Re-rolls a selected die. Returns the diceRoll object.
   */
  reRoll(n) {
    if (this.result[n] === undefined)
      throw('Tried to re-roll die with index ' + n + ', but no such die exists.');
    this.result[n] = this.rollSingle();
    return this;
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
  getFrequency(value) {
    return getFrequency(this.result, value);
  }

  /**
   * Get the frequency distribution in the dice results.
   */
  getFrequencies() {
    return getFrequencies(this.result);
  }

  /**
   * Returns an array of all straighst in the dice results, optionally only counting
   * results between 'lowest' and 'highest'. Result is on the form [[1, 2], [5, 6]].
   */
  getStraights(lowest, highest) {
    return getStraights(this.result, lowest, highest);
  }

  /**
   * Gets the longest straight in the dice results, optionally only counting results
   * between 'lowest' and 'highest'. Picks the highest if more than one is longest.
   */
  getLongestStraight(lowest, highest) {
    return getLongestStraight(this.result, lowest, highest);
  }

  /**
   * Returns the highest number of equal dice with value above 'threshold'.
   */
  countEquals(threshold = Number.NEGATIVE_INFINITY) {
    let distribution = getFrequencies(this.result);
    let max = 0;
    for (let i in distribution) {
      if (i >= threshold && distribution[i] > max)
        max = distribution[i];
    }
    return max;
  }
}