/**
 * Agent strategies. Must be stored in the agentStrategy object.
 * Strategies are called from the agent objects, by calling
 * agent.consultStrategy(method, arg1, arg2...).
 * In the actual methods, the first argument is always the agent object.
 */

// Add an entry for agentStrategies to the module.
modules.myModule.agentStrategies = {};

// Add base entries for the strategies.
modules.myModule.agentStrategies.random = {};

/**
 * Add strategy callbacks.
 */
// This strategy just selects a random card from the agent's display.
modules.myModule.agentStrategies.random.selectCard = function(agent) {
  return selectRandom(agent.deck.display);
}

// Add a new strategy, inheriting from the random strategy.
modules.myModule.agentStrategies.strategy2 = Object.assign({}, modules.myModule.agentStrategies.random);
// Overwrite the 'selectCard' method.
modules.myModule.agentStrategies.strategy2.selectCard = function(agent) {
  // Select the card with the lowest value for the property 'price'.
  sortByProperty(agent.deck.display, 'price');
  return agent.deck.display[0];
}
