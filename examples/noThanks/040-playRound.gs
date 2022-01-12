/**
 * @file: Carries out each round in the game. Called once for each round.
 */

modules. noThanks.playRound = function() {
  // Each player turn is considered a round in this script. The agent at the top of the list
  // makes its turn

  let agent = gameState.agents[0]

  // The decision on whether to take the card or spend a marker is handled by the agent's strategy.
  // The strategy returns 'pick' or 'pay', depending on which strategy is used.
  // Note that the agent is automatically added as argument to the strategy callback.
  let action = agent.consultStrategy('pickOrPay');
  // Unless the agent picked the card, place the agent last in the queue of agents.
  if (action != 'pick') {
    gameState.agents.shift()
    gameState.agents.push(agent);
  }
}
