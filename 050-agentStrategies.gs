/**
 * Agent strategies. Must be stored in the agentStrategy object.
 * Strategies are called from the agent objects, by calling
 * agent.consultStrategy(method, arg1, arg2...).
 * In the actual methods, the first argument is always the agent object.
 */

agentStrategies.default = {};

/**
 * @Examples: Just logs the agent object.
 */
agentStrategies.default.log = function(agent) {
  log(JSON.stringify(agent), 'example');
}
