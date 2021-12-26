/**
 * Agent strategies. Must be stored in the agentStrategy object.
 * Strategies are called from the agent objects, by calling
 * agent.consultStrategy(method, arg1, arg2...).
 * In the actual methods, the first argument is always the agent object.
 */

// Add an entry for the module.
agentStrategies.example = {};

// Add an entry for the strategy.
agentStrategies.example.offensive = {};
agentStrategies.example.defensive = {};

/**
 * Add strategy callbacks. This one just logs the agent object.
 */
agentStrategies.example.offensive.buy = function(agent, gameState) {
  while (gameState.market.market1.getBuyableItems(agent.resources).attackBooster !== undefined) {
    // The buy returns the updated resources. The extra 'agent' argument is passed to the goods resolver.
    agent.resources = gameState.market.market1.buy('attackBooster', agent.resources, agent);
  }
}
agentStrategies.example.defensive.buy = function(agent, gameState) {
  while (gameState.market.market1.getBuyableItems(agent.resources).healing !== undefined) {
    agent.resources = gameState.market.market1.buy('healing', agent.resources, agent);
  }
}
