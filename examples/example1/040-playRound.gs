/**
 * @file: Carries out each round in the game. Called once for each round.
 */

modules.example1.playRound = function() {
  // Agents draw cards.
  for (let a of gameState.agents) {
    // Shuffle deck if player is out of cards. Discard pile is added by default.
    if (a.deck.cards.length == 0)
      a.deck.shuffle();

    a.card = a.deck.drawAndDiscard();
    // Some cards have resolver functions, doing extra stuff to the agent.
    // We pass the agent object as argument.
    a.card.resolve(a);
  }
  
  // The agent with _lowest_ card loses hit points.
  sortBySubProperty(gameState.agents, 'card', 'value');
  let damage = gameState.agents[0].card.value - gameState.agents[1].card.value; // Zero or negative.
  // Add any attack booster.
  if (damage > 0) {
    damage += gameState.agents[1].attackBoosters;
    gameState.agents[1].attackBoosters = 0;
  }
  gameState.agents[0].trackChange('hitPoints', damage);

  // After this thrilling combat, agents may buy stuff. Note that the agent is automatically
  // added as argument to the strategy callback.
  for (let a of gameState.agents) {
    a.consultStrategy('buy');
  }
}
