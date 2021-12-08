/**
 * Functions that are specific to each game.
 */

/**
 * Tells when the game is over.
 * @return Either true or false.
 */
function gameOver(gameState) {
  // Example: Game is over when 10 rounds have been played.
  if (gameState.round >= 10)
    return true;
  else
    return false;
}

/**
 * Called when a game iteration is over. Returns an object with the data used
 * for statistics based on all games. Data must be numeric.
 * @return Object on the form {property: numericalValue, ...}
 */
function buildStatistics(gameState) {
  let stats = {};

  // Examples.
  stats.gameLength = gameState.round;
  // stats.mostHitPoints = getMax(gameState.agents, 'hitPoints');

  return stats;
}
