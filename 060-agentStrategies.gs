/**
 * Agent strategies. Must be stored in the agentStrategy object.
 * Strategies are called from the agent objects, by calling
 * agent.consultStrategy(method, arg1, arg2...).
 * In the actual methods, the first argument is always the agent object.
 */

// Add an entry for agentStrategies to the module.
modules.example.agentStrategies = {};

// Add base entries for the strategies.
modules.example.agentStrategies.offensive = {};
modules.example.agentStrategies.defensive = {};

/**
 * Add strategy callbacks. This one just logs the agent object.
 */
modules.example.agentStrategies.offensive.buy = function(agent) {
  while (gameState.markets.market1.getBuyableItems(agent).attackBooster !== undefined) {
    // The buy returns the updated resources. The extra 'agent' argument is passed to the goods resolver.
    gameState.markets.market1.buy('attackBooster', agent);
    agent.attackBoosters++;
  }
}
modules.example.agentStrategies.defensive.buy = function(agent) {
  while (gameState.markets.market1.getBuyableItems(agent).healing !== undefined) {
    gameState.markets.market1.buy('healing', agent);
    agent.hitPoints += 2;
  }
}
