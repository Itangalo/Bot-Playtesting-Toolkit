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
}
