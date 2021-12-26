/**
 * Board game scripting tools.
 * See https://github.com/Itangalo/Board-game-scripting-tools for details,
 * including license (GNU GPL version 3) and issue queue.
 */

/**
 * @file: Runs simulation. Creates some global variables.
 * This file must be the first in the list of files when the script runs.
 */

// Initiate some global variables.
var global = {defaults: {module: 'example'}}; // Further populated by buildInitialData().
var modules = {}; // Populated by custom code.
var module = global.defaults.module;
var gameState = {};
var agentStrategies = {}; // Populated in separate files.
var cardResolvers = {}; // Populated in separate files.
var spaceResolvers = {}; // Populated in separate files.
var goodsResolvers = {}; // Populated in separate files.
global.startTime = Date.now();

function simulate(iterations = false, mod = false) {
  // Set which module (game simulation) to run.
  if (mod !== false)
    module = mod;

  log('Starting to build initial data.', 'system');
  let initialGameState = modules[module].buildInitialData();
  log('Initial data complete.', 'system');

  // Variable used to save data from each game iteration.
  let results = [];
  // Start iterating game plays.
  if (!iterations)
    iterations = global.defaults.iterations;
  for (let iteration = 1; iteration <= iterations; iteration++) {
    log('Starting iteration ' + iteration, 'system');
    let gs = JSON.parse(JSON.stringify(initialGameState)); // Short-hand for game state.

    /**
     * Set up each game.
     */
    // Set up decks, if any.
    if (gs.decks) {
      gs.decks = {};
      for (let o of initialGameState.decks) {
        gs.decks[o.deck.id] = new Deck(o.deck, o.cards);
      }
    }

    // Set up tracks, if any.
    if (gs.tracks) {
      gs.tracks = {};
      for (let o of initialGameState.tracks) {
        gs.tracks[o.track.id] = new Track(o.track, o.spaces);
      }
    }

    // Set up markets, if any.
    if (gs.markets) {
      gs.markets = {};
      for (let o of initialGameState.markets) {
        gs.markets[o.market.id] = new Market(o.market, o.goods);
      }
    }

    // Set up agents, if any. Note that these are stored in an array,
    // not keyed by id, to allow setting and changing order.
    if (gs.agents) {
      gs.agents = [];
      for (let a of initialGameState.agents) {
        gs.agents.push(new Agent(a));
      }
    }

    // Make any customized additional processing of the game state.
    modules[module].preIteration(gs);

    // Play the game until it is over.
    gs.round = 0;
    log('Starting first round in iteration ' + iteration, 'system');
    while (!modules[module].gameOver(gs)) {
      gs.round++;

      // Call the function carrying out the actual actions in a round.
      modules[module].playRound(gs);
    }

    /**
     * Process data that should be stored for statistics.
     */
    results.push(modules[module].buildStatistics(gs));
  }

  return processResults(results);
}
