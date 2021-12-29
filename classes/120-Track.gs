/**
 * Class for managing tracks where pawns are moved.
 * 
 * @param {Object} trackData: An object with properties to set to the
 * track. Some special properties:
 *    - id: The unique id for the track. Required.
 *    - assumePresent: If true, missing pawns start on the first space.
 *    - loop: If true, the last space is followed by the first.
 * 
 * @param {Array} spacesDataArray: An array of objects describing each
 * space on the track. Some special properties:
 *    - resolver: Name of a method in the spaceResolver object. Called
 *      through track.resolve(pawnId).
 */
class Track {
  constructor(trackData, spacesDataArray = false) {
    // Build basic data and verify required properties.
    Object.assign(this, deckData);
    if (this.id === undefined)
      throw('Tracks must have an id property set.');
    
    // Add the track to gameState and, if relevant, to an agent with the same ID.
    if (gameState.tracks === undefined)
      gameState.tracks = {};
    gameState.tracks[this.id] = this;
    let agent = getAgentById(this.id);
    if (agent) {
      agent.track = this;
    }

    // Additional processing just for decks.
    this.spaces = [];
    if (spacesArrayData) {
      for (let s of spacesDataArray) {
        this.constructSpace(s);
      }
    }
    
    // Object used to track where on the track pawns are.
    this.pawnIndices = {};
  }

  /**
   * Creates a space object and adds last on the track.
   * @param {Object} spaceData: An object with any sets of property:value pairs.
   */
  constructSpace(spaceData) {
    let s = new Space(spaceData, this);
    return s;
  }

  // @TODO: Write method for adding spaces. And for modifying?

  /**
   * Returns the index for the space where the pawn is, or -1 if
   * pawn is missing (and should not be assumed to start at 0).
   */
  getPawnIndex(pawnId) {
    if (!isNaN(this.pawnIndices[pawnId])) {
      return this.pawnIndices[pawnId];
    }
    if (this.assumePresent) {
      this.pawnIndices[pawnId] = 0;
      return 0;
    }
    return -1;
  }

  /**
   * Returns the space object where the pawn is.
   */
  getPawnSpace(pawnId) {
    let i = this.getPawnIndex(pawnId);
    if (i < 0) {
      log('Pawn ' + pawnId + ' is not present on track ' + this.id + '. Cannot return space.', 'error');
      return false;
    }
    return this.spaces[i];
  }

  /**
   * Moves a pawn a number of steps on the track. Returns the resulting space.
   */
  movePawn(pawnId, steps = 1) {
    let i = this.getPawnIndex(pawnId);
    if (i < 0)
      throw('Cannot move pawn ' + pawnId + ' on track ' + this.id + '. Pawn is not present.');

    // Move up or down the track, but not beyond its edges.
    if (this.loop)
      i = (i + steps) % this.spaces.length;
    else 
      i = Math.max(0, Math.min(i + steps, this.spaces.length - 1));
    this.pawnIndices[pawnId] = i;
    return this.spaces[i];
  }

  /**
   * Moves the pawn to the first space. Creates pawn if necessary.
   */
  movePawnToStart(pawnId) {
    this.pawnIndices[pawnId] = 0;
  }

  /**
   * Moves the pawn to the last space. Creates pawn if necessary.
   */
  movePawnToStart(pawnId) {
    this.pawnIndices[pawnId] = this.spaces.length - 1;
  }

  /**
   * Tells whether the pawn is at the first space.
   */
  isAtStart(pawnId) {
    return (this.pawnIndices[pawnId] == 0);
  }

  /**
   * Tells whether the pawn is at the last space.
   */
  isAtEnd(pawnId) {
    return (this.pawnIndices[pawnId] == this.spaces.length - 1);
  }

  /**
   * Returns the first space matching the given property:value, or
   * false if none is found.
   */
  getSpace(property, value) {
    return pickFromArray(this.spaces, property, value);
  }

  /**
   * Returns the track index for the first space matching the
   * given property:value, or false if none is found.
   */
  getSpaceIndex(property, value) {
    for (let i in this.spaces) {
      if (this.spaces[i][property] == value)
        return i;
    }
    return false;
  }

  /**
   * Returns an array of all pawn IDs at a given track index.
   */
  getPawnsAtIndex(index) {
    let pawnIds = [];
    for (let p in this.pawnIndices) {
      if (this.pawnIndices[p] == index)
        pawnIds.push(p);
    }
    return pawnIds;
  }

  /**
   * Moves a pawn to the first space matching property:value. Creates
   * the pawn if necessary.
   */
  moveToSpace(pawnId, property, value) {
    let i = this.getSpaceIndex(property, value);
    if (i < 0)
      throw('Cannot move ' + pawnId + ' to a space matching ' + property + ':' + value + '. No such space.');
    this.pawnIndices[pawnId] = i;
  }

  /**
   * Calls any resolver set for the pawn's space.
   * Any arguments after the pawn ID will be sent to the resolver.
   * The space needs to have a the property 'resolver' set and a corresponding
   * method must be placed in modules[module].resolvers.spaces.
   * Note that resolver also can be called from space.resolve().
   */
  resolve(pawnId) {
    let space = this.getPawnSpace(pawnId);
    if (!space)
      return false;

    let args = parseArguments(arguments, 1);
    callResolver('spaces', space.resolver, ...args);
  }
}
