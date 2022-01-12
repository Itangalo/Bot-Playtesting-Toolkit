/**
 * Called when a game iteration is over. Returns an object with the data used
 * for statistics based on all games. Data must be numeric.
 *
 * @return Object on the form {property: numericalValue, ...}
 */
modules.noThanks.buildStatistics = function() {
  // Step 1: Determine the winner.
  for (let a of gameState.agents) {
    a.score = a.markers;

    // Get a list of the straights found in the cards in the agent's display.
    let cardValues = buildArrayWithProperty(a.deck.display, 'value');
    a.straights = getStraights(cardValues);
    // Deduct points for the lowest card in each straight.
    for (let s of a.straights)
      a.score -= s[0];
  }
  
  // Stats needs to be saved as numbers. Id of winner does not work.
  let stats = {
    aWins: 0,
    bWins: 0,
    cWins: 0,
    dWins: 0,
  };
  sortByProperty(gameState.agents, 'score', false);
  stats[gameState.agents[0].id + 'Wins'] = 1;
  stats.winnerPicks = gameState.agents[0].picks;
  stats.winnerPayments = gameState.agents[0].payments;

  stats.gameLength = gameState.round;

  stats.highestScore = getMax(gameState.agents, 'score');
  stats.lowestScore = getMin(gameState.agents, 'score');

  return stats;
}
