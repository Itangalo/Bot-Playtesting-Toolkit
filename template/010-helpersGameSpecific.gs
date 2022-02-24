/**
 * Helper functions that are specific to your game and are not stored in the actual module.
 */

// Useful for running the module from the coding environment.
function simulateMyModule() {
  simulate(1, 'myModule');
}

// Useful shortcut if there is a track that is often referenced in code.
function board() {
  return gameState.tracks.board;
}

// It is sometimes useful to print out simplified representations of the board, or some game stats.
// How this could be done varies greatly from game to game. See also the Table class.
function printBoard() {
}
