/**
 * Bot Playtesting Toolkit
 *
 * See https://github.com/Itangalo/Board-game-scripting-tools for details,
 * including license (GNU GPL version 3) and issue queue.
 */

/**
 * @file: Runs simulation. Creates some global variables.
 * This file must be the first in the list of files when the script runs.
 */

// Initiate some global variables.
var global = {}; // Further populated by buildInitialData().
var modules = {}; // Populated by custom code.
var module;
var gameState = {};
global.startTime = Date.now();

function simulate(iterations = false, mod = false) {
  // Set global default values.
  setInitialDefaults();

  // Set which module (game simulation) to run.
  if (mod !== false)
    module = mod;

  log('Starting to build initial data.', 'system');
  let gameStateSeed = modules[module].buildInitialData();
  log('Initial data complete.', 'system');

  // Variable used to save data from each game iteration.
  let results = [];
  // Start iterating game plays.
  if (!iterations)
    iterations = global.defaults.iterations;
  for (let iteration = 1; iteration <= iterations; iteration++) {
    log('Starting iteration ' + iteration, 'system');
    gameState = copy(gameStateSeed);

    /**
     * Set up each game.
     */
    // Set up agents, if any. Note that these are stored in an array,
    // not keyed by id, to allow setting and changing order.
    if (gameState.agents) {
      delete (gameState.agents);
      for (let a of gameStateSeed.agents) {
        new Agent(a);
      }
    }
    // Set up any decks, tracks and markets.
    if (gameState.decks) {
      delete (gameState.decks);
      for (let o of gameStateSeed.decks) {
        new Deck(o.deck, o.cards);
      }
    }
    if (gameState.tracks) {
      delete (gameState.tracks);
      for (let o of gameStateSeed.tracks) {
        new Track(o.track, o.spaces);
      }
    }
    if (gameState.markets) {
      delete (gameState.markets);
      for (let o of gameStateSeed.markets) {
        new Market(o.market, o.goods);
      }
    }

    // Make any customized additional processing of the game state.
    modules[module].preIteration();

    // Play the game until it is over.
    gameState.round = 0;
    log('Starting first round in iteration ' + iteration, 'system');
    while (!modules[module].gameOver()) {
      gameState.round++;
      // Call the function carrying out the actual actions in a round.
      modules[module].playRound();
    }

    /**
     * Process data that should be stored for statistics.
     */
    results.push(modules[module].buildStatistics());
  }

  return processResults(results);
}
