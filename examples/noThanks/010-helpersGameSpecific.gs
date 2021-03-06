/**
 * Example simulation of the card game No Thanks!
 */

// Used for testing the simulation.
function noThanks() {
  simulate(10, 'noThanks');
}

// Returns the number of cards between the displayed card and any of the cards held by the agent.
function distanceFromStraight(agent) {
  let distance = Number.POSITIVE_INFINITY;
  for (let c of agent.deck.display) {
    distance = Math.min(distance, Math.abs(gameState.decks.deck.display[0].value - c.value));
  }
  return distance - 1;
}

// Used when an agent picks a card from the shared deck.
function pick(agent) {
  let card = gameState.decks.deck.pickFromDisplay()
  agent.deck.display.push(card);
  agent.trackChange('markers', gameState.markers);
  log('Turn ' + gameState.round + ': ' + agent.id + ' picks up card ' + card.value + ' along with ' + gameState.markers + ' markers. ' + agent.id + ' now has ' + agent.markers + '.', 'pick');
  gameState.markers = 0;
  agent.picks++;
  return 'pick';
}

// Used when an agent pays a marker instead of picking up a card.
function pay(agent) {
  // Make sure that the agent has markers to pay.
  if (agent.markers <= 0)
    throw('Agent ' + agent.id + ' tried to pay a marker, but has none.');

  let card = gameState.decks.deck.display[0];
  agent.trackChange('markers', -1);
  gameState.markers++;
  agent.payments++;
  log('Turn ' + gameState.round + ': ' + agent.id + ' puts a marker on card ' + card.value + '. There are now ' + gameState.markers + ' markers on the card. ' + agent.id + ' has ' + agent.markers + ' left.', 'pay');
  return 'pay';
}
