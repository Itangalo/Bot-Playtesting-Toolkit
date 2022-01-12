/**
 * Agent strategies. Must be stored in the agentStrategy object.
 * Strategies are called from the agent objects, by calling
 * agent.consultStrategy(method, arg1, arg2...).
 * In the actual methods, the first argument is always the agent object.
 */

// Add an entry for agentStrategies to the module.
modules.noThanks.agentStrategies = {};

// Add base entries for the strategies.
modules.noThanks.agentStrategies.random = {};
modules.noThanks.agentStrategies.default = {};

/**
 * Add strategy callbacks.
 */
// This is a dummy strategy. It uses a 1/n chance of picking up the card, where
// n is the number of markers the agent has.
modules.noThanks.agentStrategies.random.pickOrPay = function(agent) {
  if (Math.random() < (1 / agent.markers))
    pick(agent);
  else
    pay(agent);
};

// Picks up the card if the number of markers is at least 1/3 of the card value,
// or if the card fits a straight held by the agent.
modules.noThanks.agentStrategies.default.pickOrPay = function(agent) {
  if (agent.markers == 0)
    return pick(agent);
  if (gameState.markers *3 >= gameState.decks.deck.display[0].value)
    return pick(agent);
  if (distanceFromStraight(agent) < 1)
    return pick(agent);
  return pay(agent);
};
