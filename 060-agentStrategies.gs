/**
 * Agent strategies. Must be stored in the agentStrategy object.
 * Strategies are called from the agent objects, by calling
 * agent.consultStrategy(method, arg1, arg2...).
 * In the actual methods, the first argument is always the agent object.
 */

// Add an entry for the module.
agentStrategies.example = {};

// Add an entry for the strategy.
agentStrategies.example.default = {};

/**
 * Add strategy callbacks. This one just logs the agent object.
 */
agentStrategies.example.default.log = function(agent) {
  log(JSON.stringify(agent), 'example');
}
