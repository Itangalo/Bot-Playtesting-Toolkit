/**
 * Class for managing players/agents/avatars/characters.
 * 
 * @param {object} agentData: The data describing the agent. Some
 * special properties:
 *    - id: The unique id for the agent. Required.
 *    - strategy: Any strategy used by the agent, and called from
 *      agent.consultStragety(method, arguments...). Methods must be
 *      added to agentStrategies[module].
 *      
 */
class Agent {
  constructor(agentData) {
    this.tracking = {}; // Used for storing changes for statistics
    if (agentData) {
      for (let i in agentData) {
        this[i] = agentData[i];
      }
    }
  }

  // @TODO: Add ways to limit max and min values for properties.

  /**
   * Called when changes to agent properties should be logged, for example
   * to include number of changes in statistics.
   * 
   * @param {string} property: The name of the property to change.
   * @param {number} change: The change, relative current value.
   */
  trackChange(property, change) {
    if (isNaN(change)) {
      log('Tried to track change of property ' + property + ', but change ' + change + ' is not a number.', 'error');
      throw('Tried to track change of property ' + property + ', but change ' + change + ' is not a number.');
    }

    // Set up starting values for tracking, if not present.
    if (!this.tracking[property]) {
      this.tracking[property] = {
        increaseCount: 0,
        increaseSum: 0,
        decreaseCount: 0,
        decreaseSum: 0,
        unchangedCount: 0,
        count: 0,
        sum: 0,
      }
    }

    // Modify the property value for the agent.
    if (!this[property])
      this[property] = change;
    else
      this[property] += change;

    // Track the changes.
    this.tracking[property].count++;
    this.tracking[property].sum += change;
    if (change > 0) {
      this.tracking[property].increaseCount++;
      this.tracking[property].increaseSum += change;
    }
    else if (change < 0) {
      this.tracking[property].decreaseCount++;
      this.tracking[property].decreaseSum += change;
    }
    else {
      this.tracking[property].unchangedCount++;
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

    return agentStrategies[module][this.strategy][method](this, ...arguments);
  }
}
