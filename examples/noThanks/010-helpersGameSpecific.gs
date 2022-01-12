/**
 * Example simulation of the card game No Thanks!
 */

// Used for testing the simulation.
function noThanks() {
  simulate(100, 'noThanks');
}

// Used when an agent picks a card from the shared deck.
function pick(agent) {
  agent.deck.display.push(gameState.decks.deck.pickFromDisplay());
  agent.trackChange('markers', gameState.markers);
  gameState.markers = 0;
  agent.picks++;
}

// Used when an agent pays a marker instead of picking up a card.
function pay(agent) {
  // Make sure that the agent has markers to pay.
  if (agent.markers <= 0)
    throw('Agent ' + agent.id + ' tried to pay a marker, but has none.');

  agent.trackChange('markers', -1);
  gameState.markers++;
  agent.payments++;
}
