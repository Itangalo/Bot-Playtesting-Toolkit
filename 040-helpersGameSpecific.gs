/**
 * Functions that are specific to each game.
 */

/**
 * Tells when the game is over.
 *
 * @return Either true or false.
 */
modules.example.gameOver = function(gameState) {
  // Game is over if (at least) one agent is out of hit points.
  for (let a of gameState.agents) {
    if (a.hitPoints <= 0)
      return true;
  }
  return false;
}

/**
 * Called when a game iteration is over. Returns an object with the data used
 * for statistics based on all games. Data must be numeric.
 *
 * @return Object on the form {property: numericalValue, ...}
 */
modules.example.buildStatistics = function(gameState) {
  let stats = {};

  stats.gameLength = gameState.round;
  stats.redWins = 0;
  stats.blueWins = 0;
  if (getAgentById('red').hitPoints > 0)
    stats.redWins = 1;
  else
    stats.blueWins = 1;

  stats.winnerHitPoints = getMax(gameState.agents, 'hitPoints');

  return stats;
}
