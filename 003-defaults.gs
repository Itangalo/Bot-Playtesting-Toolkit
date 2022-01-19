/**
 * @file: Contains default settings, as well as a function for applying the default settings.
 */

function setInitialDefaults() {
  global.defaults = {
    module: 'example1',
    iterations: 100,
    logging : {
      categories: {
        rounds: true,
        notice: true,
        example: true,
        statistics: true,
        tests: true,
        system: true,
        errors: true,
      },
      showTimestamps: true,
    },
    statistics: {
      percentiles: [0, .05, .15, .50, .85, .95, 1],
    },
    deck: {
      shuffleWhenCreated: true,
      addDiscardWhenShuffling: true,
      displaySize: 0,
      autoFillDisplay: true,
    },
    track: {
      assumePresent: true,
      startSpaceId: false,
      loop: false,
      gridMovement: false,
      symmetricConnections: true,
    },
    market: {
      restockOnlyIncreases: true,
    },
    goods: {
      quantity: Number.POSITIVE_INFINITY,
      maxQuantity: Number.POSITIVE_INFINITY,
    },
    diceRoll: {
      quantity: 3,
      numberOfSides: 6,
      customSides: false,
    },
  };
  // Apply some defaults right away.
  module = global.defaults.module;
  for (let i of ['logging', 'statistics'])
    global[i] = global.defaults[i];
}