/**
 * Class for managing tracks where agents may be represented.
 * 
 * @param {Array} spacesArrayData: An array of objects describing each
 * space on the track. Some special properties:
 *    * resolver: Name of a method in the spaceResolver object. Called
 *      through track.resolve(agent).
 * 
 * @param {Object} trackData: An object with properties to set to the
 * track. Some special properties:
 *    * assumePresent: If true, missing agents start on the first space.
 */
class Track {
  constructor(id, spacesArrayData = false, trackData = false) {
    this.id = id;
    if (trackData) {
      for (let i in trackData) {
        this[i] = trackData[i];
      }
    }

    if (spacesArrayData)
      this.spaces = spacesArrayData;
    else
      this.spaces = [];
    
    // Object used to track where on the track agents are.
    this.agentIndices = {};
  }

  /**
   * Returns the index for the space where the agent is, or -1 if
   * agent is missing (and should not be assumed to start at 0).
   */
  getAgentIndex(agent) {
    if (!isNaN(this.agentIndices[agent.id])) {
      return this.agentIndices[agent.id];
    }
    if (this.assumePresent) {
      this.agentIndices[agent.id] = 0;
      return 0;
    }
    return -1;
  }

  /**
   * Returns the space object where the agent is.
   */
  getAgentSpace(agent) {
    let i = this.getAgentIndex(agent);
    if (i < 0) {
      log('Agent ' + agent.id + ' is not present on track ' + this.id + '. Cannot return space.', 'error');
      return false;
    }
    return this.spaces[i];
  }

  /**
   * Moves the agent a number of steps on the track. Returns the resulting space.
   */
  moveAgent(agent, steps = 1) {
    let i = this.getAgentIndex(agent.id);
    if (i < 0)
      throw('Cannot move agent ' + agent.id + ' on track ' + this.id + '. Agent is not present.');

    // Move up or down the track, but not beyond its edges.    
    i = Math.max(0, Math.min(i + steps, this.spaces.length - 1));
    this.agentIndices[agent.id] = i;
    return this.spaces[i];
  }

  /**
   * Calls any resolver set for the agent's space.
   * Resolver will be called with agent as first parameter, followed
   * by any other parameters provided.
   */
  resolve(agent) {
    let space = this.getAgentSpace(agent);
    if (!space.resolver)
      return false;
    if (!spaceResolvers[space.resolver]) {
      log('Space resolver ' + space.resolver + ' does not exist.', 'error');
      return false;
    }

    spaceResolvers[space.resolver](agent, ...arguments);
  }
}
