/**
 * Board game scripting tools.
 * See https://github.com/Itangalo/Board-game-scripting-tools
 */

/**
 * @file: Runs simulation. Creates some global variables.
 * This file should be the first in the list of files.
 */

// Initiate some global variables.
var global = {defaultIterations: 1}; // Set by buildInitialData().
var initialGameState = {}; // Set by buildInitialData().
var agentStrategies = {}; // Populated in separate files.
var cardResolvers = {}; // Populated in separate files.

function simulate(iterations = false) {
  if (!iterations)
    iterations = global.defaultIterations;
  
  buildInitialData();

  // Variable used to save data from each game iteration.
  let results = [];
  // Start iterating game plays.
  for (let iteration = 1; iteration <= iterations; iteration++) {
    let gs = JSON.parse(JSON.stringify(initialGameState)); // Short-hand for game state.

    /**
     * Set up each game.
     */
    // Set up decks, if any.
    if (gs.decks) {
      for (let d in gs.decks) {
        gs.decks[d] = new Deck(d, gs.decks[d]);
      }
    }

    // Set up agents, if any.
    if (gs.agents) {
      gs.agents = [];
      for (let a in initialGameState.agents) {
        gs.agents.push(new Agent(a, initialGameState.agent[a]));
      }
    }

    // Play the game until it is over.
    gs.round = 0;
    while (!gameOver(gs)) {
      gs.round++;

      /**
       * This is where the magic happens.
       */
    }

    /**
     * Process data that should be stored for statistics.
     */
    // @TODO: Move this to a separate function in helpersGameSpecific.
    let stats = {};
    stats.rounds = gs.round; // Example. Anything added to the stats object will be stored from the iteration.
    results.push(stats);
  }

  /**
   * Process and display + return data.
   */
  // @TODO: Write stub code.
}
