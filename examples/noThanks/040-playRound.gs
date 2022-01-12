/**
 * @file: Carries out each round in the game. Called once for each round.
 */

modules. noThanks.playRound = function() {
  // Each player turn is considered a round in this script. The agent at the top of the list
  // makes its turn, and is put last in the list.

  let agent = gameState.agents.shift()
  gameState.agents.push(agent);

  // The decision on whether to take the card or spend a marker is handled by the agent's strategy.
  // Note that the agent is automatically added as argument to the strategy callback.
  agent.consultStrategy('pickOrPay');
}
