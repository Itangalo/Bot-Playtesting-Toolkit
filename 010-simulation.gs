/**
 * Board game scripting tools.
 * See https://github.com/Itangalo/Board-game-scripting-tools for details,
 * including license (GNU GPL version 3) and issue queue.
 */

/**
 * @file: Runs simulation. Creates some global variables.
 * This file should be the first in the list of files.
 */

// Initiate some global variables.
var global = {defaultIterations: 1}; // Populated by buildInitialData().
var agentStrategies = {}; // Populated in separate files.
var cardResolvers = {}; // Populated in separate files.
var spaceResolvers = {}; // Populated in separate files.
global.startTime = Date.now();

function simulate(iterations = false) {
  log('Starting to build initial data.', 'system');
  let initialGameState = buildInitialData();
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

    // Set up agents, if any. Note that these are stored in an array,
    // not keyed by id, to allow setting and changing order.
    if (gs.agents) {
      gs.agents = [];
      for (let a of initialGameState.agents) {
        gs.agents.push(new Agent(a));
      }
    }

    // @TODO: Add a function here where additional processing may be made.

    // Play the game until it is over.
    gs.round = 0;
    log('Starting first round in iteration ' + iteration, 'system');
    while (!gameOver(gs)) {
      gs.round++;

      /**
       * This is where the magic happens.
       */
      // @TODO: Add a function here where rounds are carried out.
    }

    /**
     * Process data that should be stored for statistics.
     */
    results.push(buildStatistics(gs));
  }

  /**
   * Process and display + return data.
   */
  // @TODO: Move to a separate function and a separate file.
  // Sort results. (Needed for percentiles.)
  var sortedResults = {};
  for (let i in results[0]) {
    sortedResults[i] = [];
  }
  for (let i in results) {
    for (let j in results[i]) {
      sortedResults[j].push(results[i][j]);
    }
  }
  for (let i in sortedResults) {
    sortedResults[i].sort(function(a, b) {return a - b;});
  }

  // Build log
  let message = 'DISTRIBUTION: average (percentile ';
  let values = [];
  for (let p of global.percentilesForStatistics) {
    values.push(p);
  }
  message += values.join(' | ') + ')\r\n---\r\n';
  for (let i in sortedResults) {
    message += i + ': ';
    message += average(sortedResults[i]).toFixed(2) + ' (';
    values = [];
    for (let p of global.percentilesForStatistics) {
      values.push(percentile(sortedResults[i], p).toFixed(2));
    }
    message += values.join(' | ');
    message += ")\r\n";
  }
  log(message, 'statistics');

  // Build output array.
  let output = [['']];
  for (let i in sortedResults) {
    output[0].push(i);
  }
  output.push(['Average']);
  for (let i in sortedResults) {
    output[1].push(average(sortedResults[i]));
  }
  for (let p of global.percentilesForStatistics) {
    let line = ['percentile ' + p];
    for (let i in sortedResults) {
      line.push(percentile(sortedResults[i], p));
    }
    output.push(line);
  }
  return output;
}
