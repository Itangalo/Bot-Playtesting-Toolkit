/**
 * Called when a game iteration is over. Returns an object with the data used
 * for statistics based on all games. Data must be numeric.
 *
 * @return Object on the form {property: numericalValue, ...}
 */
modules.example1.buildStatistics = function() {
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
