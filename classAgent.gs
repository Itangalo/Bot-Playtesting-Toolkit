/**
 * Class for managing players/agents/avatars/characters.
 */
class Agent {
  constructor(id, agentData = false, strategy = false) {
    this.id = id;
    this.strategy = strategy;
    if (agentData) {
      for (let i in agentData) {
        this[i] = agentData[i];
      }
    }
  }

  /**
   * Used to call a strategy on behalf of the agent. Any arguments will be passed on
   * to the strategy method. First argument will always be the agent object.
   * @param {String} method: The name of the method in the strategy.
   */
  consultStrategy(method) {
    if (!this.strategy) {
      log('Agent ' + this.id + ' has no strategy set.', 'error');
      throw('Agent ' + this.id + ' has no strategy set.');
    }
    if (!agentStrategies[this.strategy]) {
      log('Strategy ' + this.strategy + ' does not exist.', 'error');
      throw('Strategy ' + this.strategy + ' does not exist.');
    }
    if (!agentStrategies[this.strategy][method]) {
      log('Method ' + method + ' does not exist in ' + this.strategy + '.', 'error');
      throw('Method ' + method + ' does not exist in ' + this.strategy + '.');
    }

    return agentStrategies[this.strategy][method](this, ...arguments);
  }
}
